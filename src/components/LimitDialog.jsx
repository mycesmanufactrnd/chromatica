import React from "react";
import { motion } from "framer-motion";
import { X, Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PRO_PRICE } from "@/lib/usageLimits";

const BENEFITS = [
  "50 image uploads",
  "100 recolors",
  "100 refashions",
  "Unlimited gallery saves",
];

const TITLES = {
  upload: "Upload limit reached",
  recolor: "Recolor limit reached",
  refashion: "Refashion limit reached",
  gallery: "Gallery limit reached",
};

const MESSAGES = {
  upload: "You've used all your free uploads.",
  recolor: "You've used all your free recolors.",
  refashion: "You've used all your free refashions.",
  gallery: "Your gallery is full (50 saves).",
};

export default function LimitDialog({ open, type, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background border border-border rounded-2xl w-full max-w-sm p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            <h3 className="font-serif text-lg font-semibold">
              {TITLES[type] || "Limit reached"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {MESSAGES[type] || "You've reached your free limit."}
        </p>

        <div className="rounded-xl bg-gradient-to-br from-accent/10 to-chart-2/10 border border-accent/20 p-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
            Upgrade to Pro
          </p>
          <ul className="space-y-1.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-3.5 h-3.5 text-accent" /> {b}
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => navigate("/profile")}
          className="w-full rounded-xl h-11 bg-gradient-to-r from-accent to-chart-2 text-white gap-2"
        >
          <Crown className="w-4 h-4" /> Upgrade to Pro — ${PRO_PRICE}
        </Button>
        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full rounded-xl mt-2 text-muted-foreground"
        >
          Maybe later
        </Button>
      </motion.div>
    </div>
  );
}