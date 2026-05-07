import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Wand2, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

const COLOR_SUGGESTIONS = [
  { name: "Burgundy", hex: "#800020" },
  { name: "Lavender", hex: "#B57EDC" },
  { name: "Sage Green", hex: "#9CAF88" },
  { name: "Dusty Rose", hex: "#DCAE96" },
  { name: "Cobalt Blue", hex: "#0047AB" },
  { name: "Mauve", hex: "#E0B0B0" },
  { name: "Mustard", hex: "#CEAB07" },
  { name: "Terracotta", hex: "#C96A45" },
  { name: "Mint", hex: "#98D8C8" },
  { name: "Slate", hex: "#708090" },
  { name: "Champagne", hex: "#F7E7CE" },
  { name: "Plum", hex: "#8E4585" },
];

const PATTERN_SUGGESTIONS = [
  { name: "Wavy", icon: "〰️" },
  { name: "Polka Dot", icon: "⚪" },
  { name: "Geometric", icon: "◆" },
  { name: "Floral", icon: "🌸" },
  { name: "Striped", icon: "▬" },
  { name: "Plaid", icon: "▦" },
  { name: "Paisley", icon: "☯" },
  { name: "Abstract", icon: "✦" },
  { name: "Animal Print", icon: "🐆" },
  { name: "Tie-Dye", icon: "🌀" },
  { name: "Houndstooth", icon: "◈" },
  { name: "Marble", icon: "◉" },
];

function SuggestionChip({ label, icon, hex, selected, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium
        transition-all duration-200
        ${selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card border-border text-foreground hover:border-accent/40 hover:bg-accent/5"
        }
      `}
    >
      {hex && (
        <div
          className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0"
          style={{ backgroundColor: hex }}
        />
      )}
      {icon && <span className="text-xs">{icon}</span>}
      {label}
    </motion.button>
  );
}

function AiResultCard({ suggestion, onApply }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 space-y-2"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{suggestion.name}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {suggestion.description}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onApply(suggestion)}
        className="w-full rounded-lg text-xs h-8 gap-1.5"
      >
        <Wand2 className="w-3 h-3" />
        Apply this look
      </Button>
    </motion.div>
  );
}

function SuggestionsDialog({ suggestions, onApply, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-background border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">AI Suggestions</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-3">
          {suggestions.map((s, i) => (
            <AiResultCard key={i} suggestion={s} onApply={(sug) => { onApply(sug); onClose(); }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function FashionModePanel({ imageUrl, onApply, isApplying }) {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [customColor, setCustomColor] = useState("");
  const [customPattern, setCustomPattern] = useState("");
  const [targetPart, setTargetPart] = useState("");
  const [aiResults, setAiResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showColorSuggestions, setShowColorSuggestions] = useState(true);
  const [showPatternSuggestions, setShowPatternSuggestions] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const toggleColor = (name) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const togglePattern = (name) => {
    setSelectedPatterns((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const hasSelections = selectedColors.length > 0 || selectedPatterns.length > 0 || customColor || customPattern;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAiResults(null);

    const colorPart = [
      ...selectedColors,
      ...(customColor ? [customColor] : []),
    ].join(", ");

    const patternPart = [
      ...selectedPatterns,
      ...(customPattern ? [customPattern] : []),
    ].join(", ");

    const prompt = `You are a fashion AI. Analyze this image and suggest 5 creative fashion transformation ideas.

${targetPart ? `Focus specifically on this part of the outfit: ${targetPart}` : ""}
${colorPart ? `Color preferences: ${colorPart}` : ""}
${patternPart ? `Pattern/design preferences: ${patternPart}` : ""}
${!colorPart && !patternPart ? "Suggest freely based on current trends." : ""}

For each suggestion, combine the selected colors and/or patterns in a creative, wearable way.
For each option provide:
- A creative name for this look
- Hex code (if color-based, otherwise null)
- A one-line aesthetic description of how it would look

Make it trendy, modern, and fashion-forward. Return exactly 5 suggestions.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [imageUrl],
      response_json_schema: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                hex_code: { type: "string" },
                description: { type: "string" },
              },
            },
          },
        },
      },
    });

    setAiResults(result.suggestions);
    setIsGenerating(false);
    setShowDialog(true);
  };

  const handleApply = (suggestion) => {
    const colorDesc = suggestion.hex_code
      ? `${suggestion.name} (${suggestion.hex_code})`
      : suggestion.name;

    const patternDesc = selectedPatterns.length > 0
      ? ` with ${selectedPatterns.join(" and ")} pattern`
      : customPattern
        ? ` with ${customPattern} pattern`
        : "";

    const partDesc = targetPart ? ` on ${targetPart}` : "";

    onApply(colorDesc + patternDesc + partDesc, suggestion.description);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-5"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Fashion Mode
        </h3>
      </div>

      {/* What to change */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          🎯 What to change
        </p>
        <Textarea
          value={targetPart}
          onChange={(e) => setTargetPart(e.target.value)}
          placeholder="e.g. the hijab, the trousers, the jacket, the whole outfit…"
          className="rounded-xl text-sm bg-card border-border resize-none h-16"
        />
      </div>

      {/* Color Section */}
      <div className="space-y-3">
        <button
          onClick={() => setShowColorSuggestions((v) => !v)}
          className="flex items-center justify-between w-full"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            🎨 Color
          </p>
          {showColorSuggestions
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          }
        </button>

        <AnimatePresence>
          {showColorSuggestions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                {COLOR_SUGGESTIONS.map((c) => (
                  <SuggestionChip
                    key={c.name}
                    label={c.name}
                    hex={c.hex}
                    selected={selectedColors.includes(c.name)}
                    onClick={() => toggleColor(c.name)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Input
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          placeholder="Or type a custom color… e.g. Dusty Mauve"
          className="h-10 rounded-xl text-sm bg-card border-border"
        />
      </div>

      {/* Pattern Section */}
      <div className="space-y-3">
        <button
          onClick={() => setShowPatternSuggestions((v) => !v)}
          className="flex items-center justify-between w-full"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            ✦ Pattern & Design
          </p>
          {showPatternSuggestions
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          }
        </button>

        <AnimatePresence>
          {showPatternSuggestions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                {PATTERN_SUGGESTIONS.map((p) => (
                  <SuggestionChip
                    key={p.name}
                    label={p.name}
                    icon={p.icon}
                    selected={selectedPatterns.includes(p.name)}
                    onClick={() => togglePattern(p.name)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Input
          value={customPattern}
          onChange={(e) => setCustomPattern(e.target.value)}
          placeholder="Or type a custom style… e.g. Baroque, Camo"
          className="h-10 rounded-xl text-sm bg-card border-border"
        />
      </div>

      {/* Selected summary */}
      {(selectedColors.length > 0 || selectedPatterns.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-accent/5 border border-accent/20"
        >
          <span className="text-xs text-muted-foreground w-full mb-1 font-medium">Selected mix:</span>
          {selectedColors.map((c) => (
            <span key={c} className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
              {c}
            </span>
          ))}
          {selectedPatterns.map((p) => (
            <span key={p} className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">
              {p}
            </span>
          ))}
        </motion.div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || isApplying}
        className="w-full h-11 rounded-xl gap-2 bg-primary hover:bg-primary/90"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Curating your look…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {hasSelections ? "Generate with my picks" : "Surprise me ✨"}
          </>
        )}
      </Button>

      {/* Suggestions Dialog */}
      <AnimatePresence>
        {showDialog && aiResults && (
          <SuggestionsDialog
            suggestions={aiResults}
            onApply={handleApply}
            onClose={() => setShowDialog(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}