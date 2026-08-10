import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@17.7.0';
import { secrets } from 'base44:runtime';

const PRICE_ID = "price_1U2nABRmd9KU2hs5WSvmhUvq";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"));
    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${origin}/profile?payment=success`,
      cancel_url: `${origin}/profile?payment=cancelled`,
      metadata: {
        base44_app_id: secrets.get("BASE44_APP_ID"),
        user_id: user.id,
      },
      customer_email: user.email,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("create-checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}