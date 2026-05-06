import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";

function SuggestionCard({ suggestion, index, onRecolor }) {
  const [copied, setCopied] = useState(false);

  const copyHex = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(suggestion.hex_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => onRecolor(suggestion.color_name)}
      className="group cursor-pointer bg-card border border-border rounded-xl p-4 hover:border-accent/30 hover:shadow-sm transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg shadow-sm border border-border/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundColor: suggestion.hex_code }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {suggestion.color_name}
            </p>
            <button
              onClick={copyHex}
              className="p-1 rounded hover:bg-secondary transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            {suggestion.hex_code}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {suggestion.description}
          </p>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-border/50">
        <span className="text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Tap to apply this color →
        </span>
      </div>
    </motion.div>
  );
}

export default function FashionSuggestions({ suggestions, onRecolor, isGenerating }) {
  if (!suggestions && !isGenerating) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Fashion Suggestions
        </h3>
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Curating trendy options...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions?.map((suggestion, index) => (
            <SuggestionCard
              key={index}
              suggestion={suggestion}
              index={index}
              onRecolor={onRecolor}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}