"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Temple {
  _id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  category: string;
  deity: string;
  description: string;
  rating: number;
  totalReviews: number;
  pujasAvailable: number;
  isPopular: boolean;
  isFeatured: boolean;
  images: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All Temples",
  "Jyotirlinga",
  "Shaktipeeth",
  "Vaishnavite",
  "Char Dham",
  "Famous Temples",
];

const STATES = [
  "All States",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "Uttarakhand",
  "Maharashtra",
  "Tamil Nadu",
  "Himachal Pradesh",
  "Madhya Pradesh",
];

// ── Image Placeholder ─────────────────────────────────────────────────────────
function ImagePlaceholder({ label = "", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`relative bg-gradient-to-br from-orange-800/60 to-red-950/70 flex items-center justify-center overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.8'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="flex flex-col items-center text-white/50 gap-1 z-10 p-4">
        <span className="text-3xl">🛕</span>
        {label && <p className="text-xs text-center line-clamp-2 max-w-[120px]">{label}</p>}
      </div>
    </div>
  );
}

// ── Temple Card ───────────────────────────────────────────────────────────────
function TempleCard({ temple }: { temple: Temple }) {
  return (
    <Link href={`/temples/${temple.slug || temple._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {temple.images?.[0] ? (
            <img
              src={temple.images[0]}
              alt={temple.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <ImagePlaceholder
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              label={temple.name}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {temple.isFeatured && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                FEATURED
              </span>
            )}
            {temple.isPopular && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                POPULAR
              </span>
            )}
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {temple.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{temple.name}</h3>

          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="text-xs text-gray-500">{temple.location}</span>
          </div>

          <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">{temple.description}</p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-gray-900">{temple.rating}</span>
              <span className="text-xs text-gray-400">({temple.totalReviews?.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-600">
              <span className="text-xs font-semibold">{temple.pujasAvailable} Pujas Available</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton Card (loading state) ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

// ── Page Banner ───────────────────────────────────────────────────────────────
function PageBanner() {
  return (
    <section className="relative h-64 md:h-80 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d0a00] to-[#1a0500]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, transparent, transparent 20px, rgba(255,255,255,.1) 20px, rgba(255,255,255,.1) 21px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <p className="text-orange-300 text-xs font-semibold tracking-widest uppercase mb-3">
            Sacred Pilgrimage Sites
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Temples of India</h1>
          <p className="text-white/80 text-base max-w-xl">
            Explore 500+ sacred temples from Jyotirlingas to Shaktipeeths. Book authentic pujas and
            receive divine blessings from anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function TemplesPage() {
  const [temples,          setTemples]          = useState<Temple[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState("");
  const [activeCategory,   setActiveCategory]   = useState("All Temples");
  const [activeState,      setActiveState]      = useState("All States");
  const [search,           setSearch]           = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch temples from API
  useEffect(() => {
    const fetchTemples = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "All Temples") params.set("category", activeCategory);
        if (activeState    !== "All States")  params.set("state",    activeState);
        if (showFeaturedOnly)                 params.set("featured", "true");
        if (search)                           params.set("search",   search);

        const res  = await fetch(`/api/temples?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setTemples(data.data);
        } else {
          setError("Failed to load temples.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input by 400ms
    const timer = setTimeout(fetchTemples, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [activeCategory, activeState, showFeaturedOnly, search]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 font-sans">
        <PageBanner />

        {/* Filter Bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search + Filters Row */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search temples, deities, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />
            </div>

            {/* State Filter */}
            <select
              value={activeState}
              onChange={(e) => setActiveState(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-gray-700"
            >
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>

            {/* Featured Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${showFeaturedOnly ? "bg-orange-500" : "bg-gray-200"}`}
                onClick={() => setShowFeaturedOnly((v) => !v)}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showFeaturedOnly ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Featured Only</span>
            </label>

            <span className="text-sm text-gray-400 ml-auto">
              {loading ? "Loading..." : `${temples.length} temples found`}
            </span>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All Temples"); }}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Temple Grid */}
          {!loading && !error && temples.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {temples.map((temple) => (
                <TempleCard key={temple._id} temple={temple} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && temples.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No temples found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Temples");
                  setActiveState("All States");
                  setShowFeaturedOnly(false);
                }}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}