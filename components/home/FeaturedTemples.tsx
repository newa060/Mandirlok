"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight, Sparkles } from "lucide-react";

interface Temple {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  category: string;
  deity: string;
  description: string;
  rating: number;
  totalReviews: number;
  pujasAvailable: number;
  images: string[];
  isFeatured: boolean;
}

export default function FeaturedTemples() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedTemples() {
      try {
        const res = await fetch("/api/temples?featured=true&limit=6");
        const data = await res.json();
        setTemples(data.temples || []);
      } catch (err) {
        console.error("Failed to fetch featured temples", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedTemples();
  }, []);

  return (
    <section className="py-16 bg-gray-50 flower-bg">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-tag mb-3">
              <Sparkles size={12} />
              SACRED TEMPLES
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Famous Temples
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Connect with holy temples and shrines of India
            </p>
          </div>
          <Link
            href="/temples"
            className="hidden md:flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all"
          >
            View all temples <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-cards-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-52 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : temples.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛕</p>
            <p className="font-medium">No featured temples found</p>
            <p className="text-sm mt-1">Add temples from the admin panel</p>
          </div>
        ) : (
          <div className="grid-cards-3">
            {temples.map((temple) => (
              <TempleCard key={temple._id} temple={temple} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/temples" className="btn-outline text-sm px-6 py-2.5">
            View All Temples <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TempleCard({ temple }: { temple: Temple }) {
  // Category color map
  const categoryColors: Record<string, string> = {
    Jyotirlinga: "bg-amber-500",
    Shaktipeeth: "bg-rose-500",
    Vaishnavite: "bg-blue-500",
    "Char Dham": "bg-green-600",
    "Famous Temples": "bg-purple-500",
  };
  const badgeColor = categoryColors[temple.category] || "bg-orange-500";

  return (
    <Link href={`/temples/${temple.slug}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-temple-card overflow-hidden bg-orange-50">
        {temple.images && temple.images[0] ? (
          <Image
            src={temple.images[0]}
            alt={temple.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="img-placeholder w-full h-full">
            <div className="img-placeholder-label">
              <span className="text-5xl">🛕</span>
            </div>
          </div>
        )}

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 ${badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}
        >
          {temple.category}
        </span>

        {/* Poojas chip */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
          🪔 {temple.pujasAvailable} Poojas
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
          {temple.name}
        </h3>

        <p className="flex items-center gap-1 text-gray-500 text-xs mb-2">
          <MapPin size={11} />
          {temple.city}, {temple.state}
        </p>

        <p className="text-gray-500 text-xs line-clamp-2 mb-3">
          {temple.description}
        </p>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-gray-500">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <strong className="text-gray-700">{temple.rating}</strong>
            <span>({temple.totalReviews.toLocaleString("en-IN")})</span>
          </span>
          <span className="text-orange-500 font-semibold">View Poojas →</span>
        </div>
      </div>
    </Link>
  );
}
