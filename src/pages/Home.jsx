import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import ColorResult from "@/components/ColorResult";
import RecolorPanel from "@/components/RecolorPanel";
import FashionModePanel from "@/components/FashionModePanel";
import ShareButton from "@/components/ShareButton";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [recoloredUrl, setRecoloredUrl] = useState(null);
  const [showComparison, setShowComparison] = useState(true);
  const [colorData, setColorData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecoloring, setIsRecoloring] = useState(false);
  const [showFashionMode, setShowFashionMode] = useState(false);
  const [activeTab, setActiveTab] = useState("standard"); // "standard" | "fashion"
  const { toast } = useToast();


  const handleImageSelect = async (file) => {
    setIsUploading(true);
    setColorData(null);
    setRecoloredUrl(null);
    setShowFashionMode(false);
    setActiveTab("standard");
    setShowComparison(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);
    setIsUploading(false);

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
        required: ["simple_color_name", "fashion_color_name", "hex_code", "explanation"],
      },
    });
    setColorData(result);
    setIsAnalyzing(false);
  };

  const handleRecolor = async (targetColor, targetPart) => {
    if (!imageUrl) return;
    setIsRecoloring(true);
    setShowComparison(true);

    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Change the color of ${targetPart ? targetPart : "the main object"} in this image to: ${targetColor}

STRICT RULES:
- Only change the color of: ${targetPart || "the main object"}
- Keep everything else exactly the same
- Preserve lighting, shadows, texture, and realism
- Do NOT change shape or design
- Only modify color tone realistically
- Output must look like a real edited photo

Target color: ${targetColor}`,
        existing_image_urls: [imageUrl],
      });
      setRecoloredUrl(result.url);
    } catch (err) {
      const msg = err?.message?.replace(/^Base44Error:\s*/i, "") || "Image generation failed.";
      toast({ description: msg, duration: 2000 });
    }
    setIsRecoloring(false);
  };

  const handleFashionApply = async (styleDescription, aestheticNote) => {
    if (!imageUrl) return;
    setIsRecoloring(true);
    setShowComparison(true);

    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Transform the main object in this image with the following fashion style: ${styleDescription}

Style notes: ${aestheticNote || ""}

STRICT RULES:
- Keep the object shape, silhouette, and structure exactly the same
- Preserve lighting direction and shadow placement
- Apply the new color and/or pattern realistically onto the fabric/surface
- Do NOT change background or environment
- Result must look like a real fashion photo edit, photorealistic

Apply: ${styleDescription}`,
        existing_image_urls: [imageUrl],
      });
      setRecoloredUrl(result.url);
    } catch (err) {
      const msg = err?.message?.replace(/^Base44Error:\s*/i, "") || "Image generation failed.";
      toast({ description: msg, duration: 2000 });
    }
    setIsRecoloring(false);
  };

  const handleReset = () => {
    setImageUrl(null);
    setRecoloredUrl(null);
    setColorData(null);
    setShowFashionMode(false);
    setActiveTab("standard");
    setShowComparison(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-chart-2 flex items-center justify-center shadow-sm shadow-accent/30">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight">
              Chromatica
            </span>
          </div>
          {imageUrl && (
            <ShareButton
              originalUrl={imageUrl}
              recoloredUrl={recoloredUrl}
              colorData={colorData}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
        <AnimatePresence mode="wait">
          {!imageUrl ? (
            <motion.div key="upload-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              {/* Decorative background glow */}
              <div className="pointer-events-none absolute inset-x-0 -top-6 h-72 overflow-hidden -z-10">
                <div className="absolute -left-10 top-0 w-56 h-56 rounded-full bg-accent/25 blur-3xl" />
                <div className="absolute right-0 top-10 w-48 h-48 rounded-full bg-chart-2/25 blur-3xl" />
                <div className="absolute left-1/3 top-24 w-40 h-40 rounded-full bg-chart-3/20 blur-3xl" />
              </div>

              <div className="text-center mb-7 pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-accent/15 to-chart-2/15 border border-accent/20 text-[11px] font-medium text-accent mb-4"
                >
                  <Sparkles className="w-3 h-3" />
                  AI-powered color studio
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="font-serif text-2xl md:text-3xl font-semibold text-foreground leading-snug"
                >
                  Discover &amp; recolor
                  <br />
                  <span className="bg-gradient-to-r from-accent to-chart-2 bg-clip-text text-transparent">
                    any shade you love
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-muted-foreground text-[13px] mt-2.5 max-w-[15rem] mx-auto leading-relaxed"
                >
                  Upload a fashion piece to identify its exact color and reimagine it in any shade or pattern.
                </motion.p>
              </div>

              <ImageUploader onImageSelect={handleImageSelect} isLoading={isUploading} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-2 mt-7"
              >
                {[
                  { label: "Color Detection", className: "bg-accent/10 text-accent border-accent/20" },
                  { label: "AI Recoloring", className: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
                  { label: "Fashion Naming", className: "bg-chart-3/15 text-foreground/70 border-chart-3/25" },
                  { label: "Pattern Styles", className: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
                ].map((f) => (
                  <span
                    key={f.label}
                    className={`px-3 py-1.5 rounded-full border text-[11px] font-medium ${f.className}`}
                  >
                    {f.label}
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
              <motion.div
                animate={activeTab === "fashion" ? { y: -16 } : { y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {isRecoloring ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full rounded-2xl overflow-hidden bg-secondary/30 border border-border flex flex-col items-center justify-center gap-4"
                    style={{ minHeight: 280 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-10 h-10 text-accent" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground font-medium">Generating your look…</p>
                  </motion.div>
                ) : (
                  <ImagePreview
                    originalUrl={imageUrl}
                    recoloredUrl={recoloredUrl}
                    showComparison={showComparison}
                    onToggleComparison={() => setShowComparison(!showComparison)}
                    onReset={handleReset}
                  />
                )}
              </motion.div>

              {isAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-6"
                >
                  <div className="w-5 h-5 border-2 border-muted-foreground/20 border-t-accent rounded-full animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Analyzing colors...</span>
                </motion.div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-secondary/60 rounded-xl border border-border">
                {[
                  { key: "standard", label: "Recolor" },
                  { key: "fashion", label: "✦ Fashion" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "fashion" ? (
                  <motion.div key="fashion" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <FashionModePanel imageUrl={imageUrl} onApply={handleFashionApply} isApplying={isRecoloring} />
                  </motion.div>
                ) : (
                  <motion.div key="standard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
                    <ColorResult colorData={colorData} />
                    {colorData && <RecolorPanel onRecolor={handleRecolor} isLoading={isRecoloring} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* Footer */}
      <footer className="max-w-lg mx-auto px-4 py-6 flex items-center justify-center gap-4 border-t border-border/40">
        <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <span className="text-border">·</span>
        <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Terms & Conditions
        </Link>
      </footer>
    </div>
  );
}