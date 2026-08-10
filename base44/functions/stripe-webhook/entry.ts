import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@17.7.0';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"));
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        secrets.get("STRIPE_WEBHOOK_SECRET")
      );
    } catch (err) {
      console.error("Stripe signature verification failed:", err.message);
      return Response.json({ error: `Signature failed: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const customerId = session.customer;
      if (userId) {
        await base44.asServiceRole.entities.User.update(userId, {
          tier: "pro",
          stripe_customer_id: customerId,
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("stripe-webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}