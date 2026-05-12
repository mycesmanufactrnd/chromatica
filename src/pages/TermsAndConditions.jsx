import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </Link>
          <span className="font-serif text-lg font-semibold">Terms & Conditions</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6 text-sm text-foreground leading-relaxed">
        <p className="text-muted-foreground text-xs">Last updated: May 2026</p>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using Chromatica, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the app.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">2. Use of the Service</h2>
          <p className="text-muted-foreground">
            Chromatica is intended for personal, non-commercial use. You agree not to misuse the service, upload harmful content, or attempt to reverse-engineer any part of the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">3. Uploaded Content</h2>
          <p className="text-muted-foreground">
            You retain ownership of any images you upload. By uploading content, you grant Chromatica a limited license to process those images solely for the purpose of delivering the service to you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">4. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All design, branding, and technology within Chromatica are the intellectual property of the platform. You may not copy, modify, or distribute any part of the service without permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">5. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground">
            Chromatica is provided "as is" without warranties of any kind. We do not guarantee the accuracy of color analysis or AI-generated outputs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">6. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted by law, Chromatica shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">7. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to update these Terms at any time. Continued use of the app after changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-base">8. Contact</h2>
          <p className="text-muted-foreground">
            For any questions regarding these Terms, please reach out through the app.
          </p>
        </section>
      </main>
    </div>
  );
}