"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, ArrowRight, Flame } from "lucide-react";

interface Pooja {
  _id: string;
  name: string;
  slug: string;
  deity: string;
  emoji: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  totalReviews: number;
  tag: string;
  tagColor: string;
  isFeatured: boolean;
  images: string[];
  templeId: {
    _id: string;
    name: string;
    city: string;
  };
}

export default function FeaturedPoojas() {
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedPoojas() {
      try {
        const res = await fetch("/api/poojas?featured=true&limit=6");
        const data = await res.json();
        setPoojas(data.poojas || []);
      } catch (err) {
        console.error("Failed to fetch featured poojas", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedPoojas();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-tag mb-3">
              <Flame size={12} />
              MOST BOOKED
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Featured Poojas
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Performed by verified pandits at sacred temples across India
            </p>
          </div>
          <Link
            href="/poojas"
            className="hidden md:flex items-center gap-1 text-orange-500 font-semibold text-sm hover:gap-2 transition-all"
          >
            View all poojas <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-cards-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-2/3 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-10 w-full rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : poojas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🪔</p>
            <p className="font-medium">No featured poojas found</p>
            <p className="text-sm mt-1">Add poojas from the admin panel</p>
          </div>
        ) : (
          <div className="grid-cards-3">
            {poojas.map((pooja) => (
              <PoojaCard key={pooja._id} pooja={pooja} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/poojas" className="btn-outline text-sm px-6 py-2.5">
            View All Poojas <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PoojaCard({ pooja }: { pooja: Pooja }) {
  return (
    <div className="card group">
      {/* Image */}
      <div className="relative aspect-puja-card bg-orange-50 overflow-hidden">
        {pooja.images && pooja.images[0] ? (
          <Image
            src={pooja.images[0]}
            alt={pooja.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="img-placeholder w-full h-full">
            <div className="img-placeholder-label">
              <span className="text-5xl">{pooja.emoji || "🪔"}</span>
            </div>
          </div>
        )}

        {/* Tag badge */}
        {pooja.tag && (
          <span
            className={`absolute top-3 left-3 ${pooja.tagColor || "bg-orange-500"} text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide`}
          >
            {pooja.tag}
          </span>
        )}

        {/* Temple chip */}
        {pooja.templeId && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            🛕 {pooja.templeId.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
            {pooja.name}
          </h3>
          <span className="text-orange-500 font-bold text-sm whitespace-nowrap">
            ₹{pooja.price.toLocaleString("en-IN")}
          </span>
        </div>

        <p className="text-gray-500 text-xs line-clamp-2 mb-3">
          {pooja.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <strong className="text-gray-700">{pooja.rating}</strong>(
            {pooja.totalReviews.toLocaleString("en-IN")})
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {pooja.duration}
          </span>
        </div>

        <Link
          href={`/poojas/${pooja.slug}`}
          className="btn-primary w-full justify-center text-sm py-2.5"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
