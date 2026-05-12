import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <span className="font-serif text-lg font-semibold">Privacy Policy</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6 text-sm text-foreground leading-relaxed">
        <p className="text-muted-foreground text-xs">Last updated: May 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            When you use Chromatica, we collect images you upload or capture via camera solely to provide the color analysis and AI recoloring features. We do not store your images permanently on our servers beyond what is needed to process your request.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            Uploaded images are sent to our AI processing service to generate color analysis and recolored outputs. We do not use your images for training AI models or share them with third parties for marketing purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">3. Data Sharing</h2>
          <p className="text-muted-foreground">
            We may share your data with trusted service providers who assist us in operating our platform (e.g., cloud storage, AI services). These providers are contractually obligated to keep your data secure and confidential.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">4. Cookies</h2>
          <p className="text-muted-foreground">
            We use essential cookies to maintain your session and preferences. We do not use tracking or advertising cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">5. Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to request deletion of any data associated with your account. Contact us at any time to exercise your data rights.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">6. Security</h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">7. Contact</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us through the app.
          </p>
        </section>
      </main>
    </div>
  );
}