import React, { useRef, useState, useCallback } from "react";
import { Upload, Camera, X, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

export default function ImageUploader({ onImageSelect, isLoading }) {
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 3840,
      height: 2160,
    });
    if (!imageSrc) return;

    // Convert base64 PNG to File (lossless, no color shift)
    fetch(imageSrc)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], "capture.png", { type: "image/png" });
        setShowCamera(false);
        setCameraReady(false);
        onImageSelect(file);
      });
  }, [onImageSelect]);

  const closeCamera = () => {
    setShowCamera(false);
    setCameraReady(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-3"
    >
      <AnimatePresence>
        {showCamera ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-2xl overflow-hidden border border-border bg-black"
          >
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{
                facingMode: "environment",
                width: { ideal: 3840 },
                height: { ideal: 2160 },
              }}
              onUserMedia={() => setCameraReady(true)}
              className="w-full h-auto max-h-[420px] object-cover"
            />

            {/* Camera UI overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {/* Top bar */}
              <div className="flex justify-end pointer-events-auto">
                <button
                  onClick={closeCamera}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-center pointer-events-auto">
                <button
                  onClick={handleCapture}
                  disabled={!cameraReady}
                  className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm border-4 border-white shadow-lg flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
                >
                  <Circle className="w-7 h-7 text-primary fill-primary" />
                </button>
              </div>
            </div>

            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer group
                border-2 border-dashed border-border rounded-2xl
                bg-card/50 backdrop-blur-sm
                transition-all duration-300
                hover:border-accent/50 hover:bg-accent/5
                ${isLoading ? "pointer-events-none opacity-60" : ""}
              `}
            >
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-accent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  )}
                </div>
                <p className="text-base font-medium text-foreground mb-1">
                  {isLoading ? "Uploading..." : "Drop your image here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse · JPG, PNG, WEBP
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      {!showCamera && !isLoading && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl gap-2 h-11 text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl gap-2 h-11 text-sm"
            onClick={() => setShowCamera(true)}
          >
            <Camera className="w-4 h-4" />
            Use Camera
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </motion.div>
  );
}