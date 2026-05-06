import React, { useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ImageUploader({ onImageSelect, isLoading }) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
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
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors duration-300">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-accent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
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