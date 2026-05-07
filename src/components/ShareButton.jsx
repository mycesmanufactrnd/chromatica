import React, { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function ShareButton({ originalUrl, recoloredUrl, colorData }) {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return;
    }

    setLoading(true);
    const experiment = await base44.entities.StyleExperiment.create({
      original_url: originalUrl,
      recolored_url: recoloredUrl || null,
      fashion_color_name: colorData?.fashion_color_name || "",
      simple_color_name: colorData?.simple_color_name || "",
      hex_code: colorData?.hex_code || "",
      explanation: colorData?.explanation || "",
    });

    const url = `${window.location.origin}/share/${experiment.id}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={loading}
      className="rounded-xl text-xs gap-1.5"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : copied ? (
        <Check className="w-3.5 h-3.5 text-accent" />
      ) : (
        <Share2 className="w-3.5 h-3.5" />
      )}
      {loading ? "Saving..." : copied ? "Link Copied!" : "Share"}
    </Button>
  );
}