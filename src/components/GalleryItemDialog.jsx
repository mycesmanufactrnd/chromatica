import React from "react";
import { motion } from "framer-motion";
import { X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/ShareButton";

export default function GalleryItemDialog({ item, onClose, onEdit, onDelete }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background border border-border rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold capitalize">{item.type}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          <img
            src={item.image_url}
            alt={item.fashion_color_name || "Gallery look"}
            className="w-full rounded-xl object-contain max-h-[50vh]"
          />
          {item.fashion_color_name && (
            <div className="space-y-1">
              <p className="text-base font-semibold">{item.fashion_color_name}</p>
              <p className="text-sm text-muted-foreground">{item.simple_color_name}</p>
              {item.hex_code && (
                <p className="text-xs font-mono text-muted-foreground">{item.hex_code}</p>
              )}
              {item.explanation && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="rounded-xl gap-1.5">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="rounded-xl gap-1.5 text-destructive ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
          <ShareButton
            originalUrl={item.image_url}
            recoloredUrl={item.type !== "original" ? item.image_url : null}
            colorData={item}
          />
        </div>
      </motion.div>
    </div>
  );
}