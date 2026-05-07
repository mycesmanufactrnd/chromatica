import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Camera, Upload, Loader2, X, Circle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import Webcam from "react-webcam";

export default function ARTryOnPanel({ recoloredUrl, originalUrl, colorData }) {
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  const itemUrl = recoloredUrl || originalUrl;

  const handleSelfieFile = async (file) => {
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setSelfieUrl(file_url);
    setTryOnResult(null);
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({ width: 1920, height: 1080 });
    if (!imageSrc) return;
    fetch(imageSrc)
      .then((r) => r.blob())
      .then(async (blob) => {
        const file = new File([blob], "selfie.png", { type: "image/png" });
        setShowCamera(false);
        setCameraReady(false);
        await handleSelfieFile(file);
      });
  }, []);

  const handleGenerate = async () => {
    if (!selfieUrl || !itemUrl) return;
    setIsGenerating(true);

    const colorDesc = colorData?.fashion_color_name
      ? `${colorData.fashion_color_name} (${colorData.hex_code})`
      : "the recolored color";

    const result = await base44.integrations.Core.GenerateImage({
      prompt: `This is a fashion try-on task. You are given two images:
1. A photo of a person (selfie)
2. A fashion item in ${colorDesc}

Task: Realistically composite the fashion item onto the person in the selfie. The item should appear naturally worn, matching the person's pose, lighting, and body proportions. Make it look like a real photo, not a collage. Preserve the person's face and overall appearance.`,
      existing_image_urls: [selfieUrl, itemUrl],
    });

    setTryOnResult(result.url);
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-5"
    >
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          AR Try-On
        </h3>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Take a selfie or upload your photo — AI will composite the recolored item onto you.
      </p>

      {/* Selfie capture area */}
      <AnimatePresence mode="wait">
        {showCamera ? (
          <motion.div
            key="cam"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-2xl overflow-hidden border border-border bg-black"
          >
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{ facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } }}
              onUserMedia={() => setCameraReady(true)}
              className="w-full h-auto max-h-[320px] object-cover"
            />
            <button
              onClick={() => { setShowCamera(false); setCameraReady(false); }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleCapture}
              disabled={!cameraReady}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white/90 border-4 border-white shadow-lg flex items-center justify-center z-10 disabled:opacity-50"
            >
              <Circle className="w-6 h-6 text-primary fill-primary" />
            </button>
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        ) : selfieUrl ? (
          <motion.div key="selfie" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <img
              src={selfieUrl}
              alt="Your selfie"
              className="w-full h-48 object-cover rounded-2xl border border-border"
            />
            <button
              onClick={() => { setSelfieUrl(null); setTryOnResult(null); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="upload-selfie" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              onClick={() => setShowCamera(true)}
              className="flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-dashed border-border bg-card/50 hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <Camera className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Take Selfie</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-dashed border-border bg-card/50 hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Upload Photo</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSelfieFile(f); }}
      />

      {/* Generate button */}
      {selfieUrl && !showCamera && (
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-11 rounded-xl gap-2 bg-primary hover:bg-primary/90"
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Generating try-on…</>
          ) : (
            <><Sparkles className="w-4 h-4" />Try it on me</>
          )}
        </Button>
      )}

      {/* Try-on result */}
      <AnimatePresence>
        {tryOnResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Look</p>
            <div className="relative rounded-2xl overflow-hidden border border-border">
              <img src={tryOnResult} alt="AR try-on result" className="w-full h-auto" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl text-xs"
              onClick={() => window.open(tryOnResult, "_blank")}
            >
              Download Result
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}