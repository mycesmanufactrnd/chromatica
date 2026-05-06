import React from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ColorResult({ colorData }) {
  const [copied, setCopied] = useState(false);

  if (!colorData) return null;

  const copyHex = () => {
    navigator.clipboard.writeText(colorData.hex_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl shadow-sm border border-border/50 flex-shrink-0"
              style={{ backgroundColor: colorData.hex_code }}
            />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-foreground leading-tight">
                {colorData.fashion_color_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {colorData.simple_color_name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-4 py-3">
            <span className="text-sm font-mono font-medium text-foreground tracking-wide">
              {colorData.hex_code}
            </span>
            <button
              onClick={copyHex}
              className="p-1.5 rounded-lg hover:bg-background/80 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-accent" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {colorData.explanation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}