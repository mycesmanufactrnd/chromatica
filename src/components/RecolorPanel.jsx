import React, { useState } from "react";
import { motion } from "framer-motion";
import { Paintbrush, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const QUICK_COLORS = [
  { name: "Burgundy", hex: "#800020" },
  { name: "Lavender", hex: "#B57EDC" },
  { name: "Sage", hex: "#9CAF88" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Blush", hex: "#DE8C8C" },
  { name: "Mustard", hex: "#CEAB07" },
  { name: "Ivory", hex: "#FFFFF0" },
];

export default function RecolorPanel({ onRecolor, isLoading }) {
  const [targetColor, setTargetColor] = useState("");
  const [targetPart, setTargetPart] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetColor.trim()) {
      onRecolor(targetColor.trim(), targetPart.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <Paintbrush className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Recolor
        </h3>
      </div>

      <div className="mb-3">
        <Textarea
          value={targetPart}
          onChange={(e) => setTargetPart(e.target.value)}
          placeholder="What to change? e.g. the hijab, the jacket, the trousers… (leave blank to change everything)"
          className="rounded-xl text-sm bg-card border-border resize-none h-16"
          disabled={isLoading}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={targetColor}
          onChange={(e) => setTargetColor(e.target.value)}
          placeholder="e.g. Dusty Rose, Teal, Wine Red..."
          className="flex-1 bg-card border-border rounded-xl h-11 text-sm"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!targetColor.trim() || isLoading}
          className="h-11 px-4 rounded-xl bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {QUICK_COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => {
              setTargetColor(color.name);
              onRecolor(color.name, targetPart.trim());
            }}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border text-xs font-medium text-foreground hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 disabled:opacity-50"
          >
            <div
              className="w-3 h-3 rounded-full border border-border/50"
              style={{ backgroundColor: color.hex }}
            />
            {color.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}