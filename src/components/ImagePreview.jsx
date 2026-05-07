import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RotateCcw, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImagePreview({
  originalUrl,
  recoloredUrl,
  showComparison,
  onToggleComparison,
  onReset,
}) {
  const displayUrl = showComparison && recoloredUrl ? recoloredUrl : originalUrl;

  const handleDownload = () => {
    if (recoloredUrl) {
      window.open(recoloredUrl, "_blank");
    }
  };

  if (!originalUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="relative rounded-2xl overflow-hidden bg-secondary/30 border border-border flex items-center justify-center" style={{ minHeight: 200 }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={displayUrl}
            src={displayUrl}
            alt="Uploaded image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-auto max-h-[480px] object-contain block"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </AnimatePresence>

        {recoloredUrl && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
              {showComparison ? "Recolored" : "Original"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        {recoloredUrl && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleComparison}
              className="rounded-xl text-xs gap-1.5"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              {showComparison ? "Show Original" : "Show Recolored"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="rounded-xl text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="rounded-xl text-xs gap-1.5 ml-auto text-muted-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Image
        </Button>
      </div>
    </motion.div>
  );
}