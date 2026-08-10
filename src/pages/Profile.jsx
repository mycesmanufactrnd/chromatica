import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Crown, Check, Sparkles, Upload, LogOut } from "lucide-react";
import { PRO_PRICE, getUsage, getLimit } from "@/lib/usageLimits";

const EMOJIS = ["🎨", "🌸", "✨", "👗", "🦋", "🌈", "💫", "🪄", "🖤", "🤍", "🔥", "💎"];

const USAGE_TYPES = [
  { key: "upload", label: "Image Uploads" },
  { key: "recolor", label: "Recolors" },
  { key: "refashion", label: "Refashions" },
];

export default function Profile() {
  const { user, isAuthenticated, navigateToLogin, refreshUser, logout } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [icon, setIcon] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || user.full_name || "");
      setIcon(user.profile_icon || "");
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setPaymentStatus("success");
      refreshUser();
    } else if (params.get("payment") === "cancelled") {
      setPaymentStatus("cancelled");
    }
  }, []);

  const tier = user?.tier || "free";

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = { display_name: displayName, profile_icon: icon };
      if (image) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: image });
        data.profile_image_url = file_url;
      }
      await base44.auth.updateMe(data);
      await refreshUser();
      setImage(null);
      toast({ description: "Profile saved", duration: 2000 });
    } catch (err) {
      toast({ description: "Failed to save profile", duration: 2000 });
    }
    setSaving(false);
  };

  const handleUpgrade = async () => {
    if (window.self !== window.top) {
      alert("Checkout works only from a published app. Please open the app in a new tab to upgrade.");
      return;
    }
    setUpgrading(true);
    try {
      const res = await base44.functions.invoke("create-checkout", {});
      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast({ description: "Could not start checkout", duration: 2000 });
        setUpgrading(false);
      }
    } catch (err) {
      toast({ description: "Checkout failed", duration: 2000 });
      setUpgrading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <Crown className="w-10 h-10 text-accent mb-4" />
        <h1 className="font-serif text-xl font-semibold mb-2">Log in to view your profile</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your profile, usage, and Pro plan.</p>
        <Button onClick={navigateToLogin}>Log in</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="font-serif text-base font-semibold">Profile</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {paymentStatus === "success" && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent">
            <Check className="w-4 h-4" /> Payment received — activating Pro…
          </div>
        )}
        {paymentStatus === "cancelled" && (
          <div className="p-3 rounded-xl bg-secondary border border-border text-sm text-muted-foreground">
            Checkout was cancelled.
          </div>
        )}

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
            ) : user?.profile_image_url ? (
              <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">{icon || "🎨"}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold">
              {displayName || user?.full_name || "Your name"}
            </span>
            {tier === "pro" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-accent to-chart-2 text-white text-[10px] font-medium">
                <Crown className="w-3 h-3" /> PRO
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>

        {/* Edit form */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Display name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setIcon(e)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border transition-colors ${
                    icon === e ? "border-accent bg-accent/10" : "border-border hover:bg-secondary"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile image</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-secondary">
                <Upload className="w-3.5 h-3.5" /> {image ? "Change image" : "Upload image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl h-11">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save profile"}
          </Button>
        </div>

        {/* Usage */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Usage</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                tier === "pro" ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
              }`}
            >
              {tier.toUpperCase()}
            </span>
          </div>
          {USAGE_TYPES.map((u) => {
            const used = getUsage(user, u.key);
            const limit = getLimit(tier, u.key);
            const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
            return (
              <div key={u.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{u.label}</span>
                  <span className="font-medium">{used} / {limit}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-chart-2"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade */}
        {tier !== "pro" && (
          <div className="bg-gradient-to-br from-accent/10 to-chart-2/10 border border-accent/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              <h3 className="font-serif text-lg font-semibold">Upgrade to Pro</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get <strong>50 uploads</strong>, <strong>100 recolors</strong>, and <strong>100 refashions</strong> — a one-time payment of <strong>${PRO_PRICE}</strong>.
            </p>
            <Button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full rounded-xl h-11 bg-gradient-to-r from-accent to-chart-2 text-white"
            >
              {upgrading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Upgrade for ${PRO_PRICE}
                </>
              )}
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => logout()}
          className="w-full rounded-xl h-11 text-muted-foreground hover:text-destructive gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </main>
    </div>
  );
}