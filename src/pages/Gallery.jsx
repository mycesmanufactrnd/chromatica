import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import GalleryItemDialog from "@/components/GalleryItemDialog";

export default function Gallery() {
  const { user, isAuthenticated, navigateToLogin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.GalleryItem.list("-created_date", 200);
      setItems(list);
    } catch (e) {
      console.error("Gallery load failed", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleDelete = async () => {
    if (!selected) return;
    await base44.entities.GalleryItem.delete(selected.id);
    setSelected(null);
    load();
  };

  const handleEdit = () => {
    navigate("/", { state: { galleryImage: selected } });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <ImageIcon className="w-10 h-10 text-accent mb-4" />
        <h1 className="font-serif text-xl font-semibold mb-2">Log in to view your gallery</h1>
        <p className="text-sm text-muted-foreground mb-6">Your saved looks are private to you.</p>
        <Button onClick={navigateToLogin}>Log in</Button>
      </div>
    );
  }

  const isPro = user?.tier === "pro";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="font-serif text-base font-semibold">My Gallery</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{items.length} saved</p>
          {!isPro && <p className="text-xs text-muted-foreground">{items.length} / 50</p>}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ImageIcon className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">No saved looks yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Upload an image or save a recolor to start your gallery.
            </p>
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-xl">Go to studio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => setSelected(it)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-secondary/30 group"
              >
                <img
                  src={it.image_url}
                  alt={it.fashion_color_name || "look"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] capitalize">
                  {it.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <GalleryItemDialog
          item={selected}
          onClose={() => setSelected(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}