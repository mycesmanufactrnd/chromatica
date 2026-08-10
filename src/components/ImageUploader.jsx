import React, { useRef, useState, useCallback } from "react";
import { Upload, Camera, X, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

export default function ImageUploader({ onImageSelect, isLoading, isAuthenticated, onRequireAuth }) {
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
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
    const video = webcamRef.current?.video;
    if (!video) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    // Draw the raw video frame at its native resolution — no stretching
    const canvas = document.createElement("canvas");
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, vw, vh);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setShowCamera(false);
        setCameraReady(false);
        onImageSelect(file);
      },
      "image/jpeg",
      0.92
    );
  }, [onImageSelect]);

  const closeCamera = () => {
    setShowCamera(false);
    setCameraReady(false);
  };

  const guard = (fn) => () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }
    fn();
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
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={{
                facingMode: "environment",
                width: { ideal: 1080 },
                height: { ideal: 1440 },
              }}
              onUserMedia={() => setCameraReady(true)}
              className="w-full h-auto block"
            />

            {/* Close button */}
            <button
              onClick={closeCamera}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Shutter button */}
            <button
              onClick={handleCapture}
              disabled={!cameraReady}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/90 border-4 border-white shadow-lg flex items-center justify-center z-10 disabled:opacity-50"
            >
              <Circle className="w-7 h-7 text-primary fill-primary" />
            </button>

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
              onClick={guard(() => fileInputRef.current?.click())}
              className={`
                relative cursor-pointer group
                border-2 border-dashed border-accent/25 rounded-3xl
                bg-gradient-to-b from-card/60 to-accent/5 backdrop-blur-sm
                transition-all duration-300
                hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10
                ${isLoading ? "pointer-events-none opacity-60" : ""}
              `}
            >
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center mb-4 group-hover:from-accent/30 group-hover:to-chart-2/30 transition-colors duration-300">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-accent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-accent transition-colors duration-300" />
                  )}
                </div>
                <p className="text-[15px] font-medium text-foreground mb-1">
                  {isLoading ? "Uploading..." : "Drop your image here"}
                </p>
                <p className="text-[13px] text-muted-foreground">
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
            className="flex-1 rounded-full gap-2 h-11 text-sm border-accent/25 hover:bg-accent/10 hover:text-accent"
            onClick={guard(() => fileInputRef.current?.click())}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full gap-2 h-11 text-sm border-accent/25 hover:bg-accent/10 hover:text-accent"
            onClick={guard(() => setShowCamera(true))}
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