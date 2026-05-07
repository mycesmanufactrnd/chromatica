import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Palette, Copy, Check, ArrowLeftRight } from "lucide-react";

export default function SharePage() {
  const id = window.location.pathname.split("/share/")[1];
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (!id) return;
    base44.entities.StyleExperiment.filter({ id })
      .then((results) => {
        setExperiment(results[0] || null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!experiment) return;
    document.title = `${experiment.fashion_color_name} – Chromé`;
    // Update meta tags
    const setMeta = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`) ||
               document.querySelector(`meta[name="${property}"]`);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(property.startsWith("og:") || property.startsWith("twitter:") ? "property" : "name", property);
      el.setAttribute("content", content);
    };
    const imgUrl = experiment.recolored_url || experiment.original_url;
    setMeta("og:title", `${experiment.fashion_color_name} – Chromé`);
    setMeta("og:description", experiment.explanation || "Check out this fashion color experiment on Chromé!");
    setMeta("og:image", imgUrl);
    setMeta("og:url", window.location.href);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", `${experiment.fashion_color_name} – Chromé`);
    setMeta("twitter:image", imgUrl);
  }, [experiment]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Style experiment not found.</p>
      </div>
    );
  }

  const displayUrl = showOriginal ? experiment.original_url : (experiment.recolored_url || experiment.original_url);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight">Chromé</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-secondary/30 border border-border">
            <img
              src={displayUrl}
              alt="Style experiment"
              className="w-full h-auto max-h-[420px] object-contain"
            />
            {experiment.recolored_url && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                {showOriginal ? "Original" : "Recolored"}
              </span>
            )}
          </div>

          {/* Toggle */}
          {experiment.recolored_url && (
            <button
              onClick={() => setShowOriginal((v) => !v)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
              {showOriginal ? "Show Recolored" : "Show Original"}
            </button>
          )}

          {/* Color info card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl border border-border/50 shadow-sm flex-shrink-0"
                style={{ backgroundColor: experiment.hex_code }}
              />
              <div>
                <p className="text-xl font-semibold font-serif text-foreground">{experiment.fashion_color_name}</p>
                <p className="text-sm text-muted-foreground">{experiment.simple_color_name}</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-4 py-3">
              <span className="text-sm font-mono font-medium tracking-wide">{experiment.hex_code}</span>
              <button onClick={copyLink} className="p-1.5 rounded-lg hover:bg-background/80 transition-colors">
                {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>

            {experiment.explanation && (
              <p className="text-sm text-muted-foreground leading-relaxed">{experiment.explanation}</p>
            )}
          </div>

          {/* Share buttons */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Share this look</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Twitter / X", color: "bg-black text-white", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this ${experiment.fashion_color_name} look on Chromé! 🎨`)}` },
                { label: "WhatsApp", color: "bg-green-500 text-white", url: `https://wa.me/?text=${encodeURIComponent(`Check out this ${experiment.fashion_color_name} look! ${window.location.href}`)}` },
                { label: "Copy Link", color: "bg-secondary text-foreground border border-border", url: null },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => s.url ? window.open(s.url, "_blank") : copyLink()}
                  className={`${s.color} text-xs font-medium px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80`}
                >
                  {s.label === "Copy Link" && copied ? "Copied!" : s.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href="/"
            className="block w-full text-center py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Try Chromé for free →
          </a>
        </motion.div>
      </main>
    </div>
  );
}