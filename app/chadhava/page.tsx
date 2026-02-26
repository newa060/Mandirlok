"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Temple {
  _id: string;
  name: string;
  location: string;
  slug: string;
}

interface Chadhava {
  _id: string;
  name: string;
  emoji: string;
  image?: string;
  price: number;
  description: string;
  isActive: boolean;
  templeId: Temple;
  createdAt: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SORT_OPTIONS = ["Default", "A-Z"];

// ── Chadhava Card ─────────────────────────────────────────────────────────────
function ChadhavaCard({ item }: { item: Chadhava }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
      {/* Image / Emoji Area */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-amber-700/60 to-yellow-900/70 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center text-white/40 gap-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">No Image Available</span>
          </div>
        )}
        {/* Temple badge */}
        {item.templeId?.name && (
          <div className="absolute bottom-3 left-3 right-3">
            <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm line-clamp-1">
              🛕 {item.templeId.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-snug">
          {item.name}
        </h3>

        {item.templeId?.location && (
          <div className="flex items-start gap-1.5 mb-3">
            <svg
              className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <p className="text-xs text-gray-500 line-clamp-1">
              {item.templeId.location}
            </p>
          </div>
        )}

        {item.description && (
          <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
            {item.description}
          </p>
        )}

        {/* CTA Button Only */}
        <div className="flex items-center justify-end pt-3 border-t border-gray-100 mt-auto">
          <button
            onClick={() => {
              if (item.templeId?._id) {
                window.location.href = `/temples/${item.templeId._id}`;
              } else {
                window.location.href = "/temples";
              }
            }}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-amber-200"
          >
            Offer Now
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-8 bg-gray-200 rounded w-full mt-4" />
      </div>
    </div>
  );
}

// ── Page Banner ───────────────────────────────────────────────────────────────
function PageBanner() {
  return (
    <section className="relative h-64 md:h-80 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4a2000] to-[#1a0a00]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a00]/90 via-[#3a1500]/70 to-transparent" />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-amber-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Sacred Chadhava Offerings
            </span>
            <span className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              Offered by Expert Pandits
            </span>
            <span className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              Video Proof in 24–48 Hours
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Mandirlok Chadhava Seva
          </h1>
          <p className="text-white/80 text-base max-w-xl leading-relaxed">
            Make sacred offerings — flowers, fruits, sweets & more — at India's
            most powerful temples on your behalf. Connect with the divine from
            anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── How It Works Banner ───────────────────────────────────────────────────────
function HowItWorksBanner() {
  const steps = [
    {
      icon: <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      title: "Choose Temple",
      desc: "Select from 500+ sacred temples across India",
    },
    {
      icon: <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      title: "Pick Chadhava",
      desc: "Choose flowers, fruits, sweets or any sacred item",
    },
    {
      icon: <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      title: "Secure Payment",
      desc: "Pay securely via UPI, card or net banking",
    },
    {
      icon: <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
      title: "Receive Video",
      desc: "Get video proof of your offering within 24–48 hrs",
    },
  ];
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-b border-amber-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
                {s.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">
                  {s.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function ChadhavaPage() {
  const [items, setItems] = useState<Chadhava[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("Default");
  const [search, setSearch] = useState("");

  // Fetch chadhava items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);

        const res = await fetch(`/api/chadhava?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          let result: Chadhava[] = data.data;

          // Client-side sorting (price sorting removed)
          if (sortBy === "A-Z")
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));

          setItems(result);
        } else {
          setError("Failed to load chadhava offerings.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchItems, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [sortBy, search]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 font-sans">
        <PageBanner />
        <HowItWorksBanner />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search + Sort */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search chadhava offerings, temples..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-gray-700"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <span className="text-sm text-gray-400 ml-auto">
              {loading
                ? "Loading..."
                : `${items.length} offering${items.length !== 1 ? "s" : ""} found`}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => {
                  setSearch("");
                }}
                className="bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Chadhava Grid */}
          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ChadhavaCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && items.length === 0 && (
            <div className="text-center py-20">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No offerings found
              </h3>
              <p className="text-gray-500 mb-6">
                Try a different search keyword
              </p>
              <button
                onClick={() => setSearch("")}
                className="bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-amber-600 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
