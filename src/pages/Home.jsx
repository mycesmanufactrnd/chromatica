import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import ColorResult from "@/components/ColorResult";
import RecolorPanel from "@/components/RecolorPanel";
import FashionSuggestions from "@/components/FashionSuggestions";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [recoloredUrl, setRecoloredUrl] = useState(null);
  const [showComparison, setShowComparison] = useState(true);
  const [colorData, setColorData] = useState(null);
  const [fashionSuggestions, setFashionSuggestions] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecoloring, setIsRecoloring] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleImageSelect = async (file) => {
    setIsUploading(true);
    setColorData(null);
    setRecoloredUrl(null);
    setFashionSuggestions(null);
    setShowComparison(true);

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);
    setIsUploading(false);

    // Auto-analyze color
    setIsAnalyzing(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this image.

Return:
1. Dominant simple color name
2. Fashion / aesthetic color name
3. HEX code
4. One-sentence explanation

Keep response short and clear.`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          simple_color_name: { type: "string" },
          fashion_color_name: { type: "string" },
          hex_code: { type: "string" },
          explanation: { type: "string" },
        },
        required: [
          "simple_color_name",
          "fashion_color_name",
          "hex_code",
          "explanation",
        ],
      },
    });
    setColorData(result);
    setIsAnalyzing(false);
  };

  const handleRecolor = async (targetColor) => {
    if (!imageUrl) return;
    setIsRecoloring(true);
    setShowComparison(true);

    const result = await base44.integrations.Core.GenerateImage({
      prompt: `Change the color of the main object in this image to: ${targetColor}

STRICT RULES:
- Keep everything else exactly the same
- Preserve lighting, shadows, texture, and realism
- Do NOT change shape or design
- Only modify color tone realistically
- Output must look like a real edited photo

Target color: ${targetColor}`,
      existing_image_urls: [imageUrl],
    });

    setRecoloredUrl(result.url);
    setIsRecoloring(false);
  };

  const handleFashionMode = async () => {
    if (!imageUrl) return;
    setIsSuggesting(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this image and suggest 3 alternative fashion color options for the main object.

For each option provide:
- Color name
- HEX code
- Aesthetic description (1 line)

Make suggestions trendy and modern (fashion + aesthetic focused).`,
      file_urls: [imageUrl],
      response_json_schema: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                color_name: { type: "string" },
                hex_code: { type: "string" },
                description: { type: "string" },
              },
            },
          },
        },
      },
    });
    setFashionSuggestions(result.suggestions);
    setIsSuggesting(false);
  };

  const handleReset = () => {
    setImageUrl(null);
    setRecoloredUrl(null);
    setColorData(null);
    setFashionSuggestions(null);
    setShowComparison(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight">
              Chromé
            </span>
          </div>
          {imageUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1.5 rounded-xl"
              onClick={handleFashionMode}
              disabled={isSuggesting}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fashion Mode
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
        <AnimatePresence mode="wait">
          {!imageUrl ? (
            <motion.div
              key="upload-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero */}
              <div className="text-center mb-8 pt-8">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight"
                >
                  Discover & Recolor
                  <br />
                  <span className="text-accent">Any Shade</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-muted-foreground text-sm mt-3 max-w-xs mx-auto leading-relaxed"
                >
                  Upload any fashion item to identify its exact color and
                  reimagine it in any shade you love.
                </motion.p>
              </div>

              <ImageUploader
                onImageSelect={handleImageSelect}
                isLoading={isUploading}
              />

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-8"
              >
                {[
                  "Color Detection",
                  "AI Recoloring",
                  "Fashion Naming",
                  "Trendy Suggestions",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1.5 rounded-full bg-secondary/60 border border-border text-xs font-medium text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <ImagePreview
                originalUrl={imageUrl}
                recoloredUrl={recoloredUrl}
                showComparison={showComparison}
                onToggleComparison={() => setShowComparison(!showComparison)}
                onReset={handleReset}
              />

              {/* Analysis Loading */}
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-6"
                >
                  <div className="w-5 h-5 border-2 border-muted-foreground/20 border-t-accent rounded-full animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Analyzing colors...
                  </span>
                </motion.div>
              )}

              <ColorResult colorData={colorData} />

              {colorData && (
                <RecolorPanel
                  onRecolor={handleRecolor}
                  isLoading={isRecoloring}
                />
              )}

              {/* Recoloring Loading */}
              {isRecoloring && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-4"
                >
                  <div className="w-5 h-5 border-2 border-muted-foreground/20 border-t-accent rounded-full animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Generating recolored image...
                  </span>
                </motion.div>
              )}

              <FashionSuggestions
                suggestions={fashionSuggestions}
                onRecolor={handleRecolor}
                isGenerating={isSuggesting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}