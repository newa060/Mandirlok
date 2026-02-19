"use client";

import { useState } from "react";
import Link from "next/link";
// import Navbar from "@/components/navbar/Navbar"; // Adjust this path to match your navbar folder structure
// import Footer from "@/components/footer/Footer"; // Adjust this path to match your footer location
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Data ──────────────────────────────────────────────────────────────────────
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

const TEMPLES = [
  {
    id: "kashi-vishwanath",
    name: "Shri Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    category: "Jyotirlinga",
    deity: "Lord Shiva",
    description:
      "One of the 12 Jyotirlingas, this ancient temple on the banks of the Ganga is one of the holiest shrines in Hinduism.",
    pujasAvailable: 12,
    rating: 4.9,
    reviews: 2847,
    state: "Uttar Pradesh",
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "tirupati-balaji",
    name: "Sri Venkateswara Temple",
    location: "Tirupati, Andhra Pradesh",
    category: "Vaishnavite",
    deity: "Lord Venkateswara",
    description:
      "The richest temple in the world and one of the most visited pilgrimage sites, known for Tirumala hills and divine darshan.",
    pujasAvailable: 18,
    rating: 4.9,
    reviews: 5120,
    state: "Andhra Pradesh",
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "siddhivinayak",
    name: "Shree Siddhivinayak Ganapati",
    location: "Prabhadevi, Mumbai",
    category: "Famous Temples",
    deity: "Lord Ganesha",
    description:
      "The most celebrated Ganesha temple in Maharashtra, visited by millions seeking Ganpati's blessings for new beginnings.",
    pujasAvailable: 9,
    rating: 4.8,
    reviews: 3214,
    state: "Maharashtra",
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "vaishno-devi",
    name: "Shri Mata Vaishno Devi Mandir",
    location: "Katra, Jammu & Kashmir",
    category: "Shaktipeeth",
    deity: "Mata Vaishno Devi",
    description:
      "One of the most revered Hindu shrines, nestled in the Trikuta Mountains, drawing millions of pilgrims annually.",
    pujasAvailable: 7,
    rating: 4.9,
    reviews: 4250,
    state: "J&K",
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "somnath",
    name: "Shri Somnath Mahadev Temple",
    location: "Prabhas Patan, Gujarat",
    category: "Jyotirlinga",
    deity: "Lord Shiva",
    description:
      "The first of the 12 Jyotirlingas, this grand temple on the Arabian Sea coast holds immense spiritual significance.",
    pujasAvailable: 10,
    rating: 4.8,
    reviews: 1876,
    state: "Gujarat",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "mahakaleshwar",
    name: "Mahakaleshwar Jyotirlinga",
    location: "Ujjain, Madhya Pradesh",
    category: "Jyotirlinga",
    deity: "Lord Shiva (Mahakal)",
    description:
      "The only south-facing Jyotirlinga and the 'Lord of Time'. Famous for the Bhasma Aarti performed at dawn each day.",
    pujasAvailable: 15,
    rating: 4.9,
    reviews: 3820,
    state: "Madhya Pradesh",
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "shirdi-sai",
    name: "Shri Sai Baba Mandir",
    location: "Shirdi, Maharashtra",
    category: "Famous Temples",
    deity: "Shri Sai Baba",
    description:
      "The sacred home of Sai Baba of Shirdi — a place of universal brotherhood, equality and divine faith.",
    pujasAvailable: 8,
    rating: 4.8,
    reviews: 2950,
    state: "Maharashtra",
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "badrinath",
    name: "Shri Badrinath Temple",
    location: "Badrinath, Uttarakhand",
    category: "Char Dham",
    deity: "Lord Vishnu (Badri Narayan)",
    description:
      "One of the four Char Dham pilgrimage sites, located in the Garhwal hills near the Alaknanda river.",
    pujasAvailable: 11,
    rating: 4.9,
    reviews: 1654,
    state: "Uttarakhand",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "kedarnath",
    name: "Shri Kedarnath Temple",
    location: "Kedarnath, Uttarakhand",
    category: "Char Dham",
    deity: "Lord Shiva",
    description:
      "A Jyotirlinga and Char Dham site in the Himalayas, one of the most revered shrines of Lord Shiva.",
    pujasAvailable: 9,
    rating: 4.9,
    reviews: 2105,
    state: "Uttarakhand",
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "meenakshi",
    name: "Meenakshi Amman Temple",
    location: "Madurai, Tamil Nadu",
    category: "Famous Temples",
    deity: "Goddess Meenakshi",
    description:
      "An architectural marvel with 14 gopurams, this ancient temple dedicated to Goddess Meenakshi is a spiritual and cultural treasure.",
    pujasAvailable: 13,
    rating: 4.8,
    reviews: 2340,
    state: "Tamil Nadu",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "dwarka",
    name: "Dwarkadhish Temple",
    location: "Dwarka, Gujarat",
    category: "Char Dham",
    deity: "Lord Krishna (Dwarkadhish)",
    description:
      "One of the four Char Dham sites and a Vaishnavite pilgrimage center, the legendary city of Lord Krishna.",
    pujasAvailable: 8,
    rating: 4.7,
    reviews: 1432,
    state: "Gujarat",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "golden-temple",
    name: "Harmandir Sahib (Golden Temple)",
    location: "Amritsar, Punjab",
    category: "Famous Temples",
    deity: "Waheguru (Sikh Shrine)",
    description:
      "The holiest Gurdwara of Sikhism, shimmering in gold on the sacred Amrit Sarovar. A symbol of peace and brotherhood.",
    pujasAvailable: 5,
    rating: 4.9,
    reviews: 4870,
    state: "Punjab",
    isPopular: true,
    isFeatured: false,
  },
];

// ── Image Placeholder ──────────────────────────────────────────────────────────
function ImagePlaceholder({
  label = "",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-gradient-to-br from-orange-800/60 to-red-950/70 flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.8'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="flex flex-col items-center text-white/50 gap-1 z-10 p-4">
        <span className="text-3xl">🛕</span>
        {label && (
          <p className="text-xs text-center line-clamp-2 max-w-[120px]">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Temple Card ────────────────────────────────────────────────────────────────
function TempleCard({ temple }: { temple: (typeof TEMPLES)[0] }) {
  return (
    <Link href={`/temples/${temple.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <ImagePlaceholder
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            label={temple.name}
          />

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
          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
            {temple.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-2">
            <svg
              className="w-3.5 h-3.5 text-orange-400 shrink-0"
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
            <span className="text-xs text-gray-500">{temple.location}</span>
          </div>

          <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">
            {temple.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-amber-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-gray-900">
                {temple.rating}
              </span>
              <span className="text-xs text-gray-400">
                ({temple.reviews.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-600">
              <span className="text-xs font-semibold">
                {temple.pujasAvailable} Pujas Available
              </span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Page Banner ────────────────────────────────────────────────────────────────
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Temples of India
          </h1>
          <p className="text-white/80 text-base max-w-xl">
            Explore 500+ sacred temples from Jyotirlingas to Shaktipeeths. Book
            authentic pujas and receive divine blessings from anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function TemplesPage() {
  const [activeCategory, setActiveCategory] = useState("All Temples");
  const [activeState, setActiveState] = useState("All States");
  const [search, setSearch] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filtered = TEMPLES.filter((t) => {
    const matchCat =
      activeCategory === "All Temples" || t.category === activeCategory;
    const matchState = activeState === "All States" || t.state === activeState;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.deity.toLowerCase().includes(search.toLowerCase());
    const matchFeatured = !showFeaturedOnly || t.isFeatured;
    return matchCat && matchState && matchSearch && matchFeatured;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 font-sans">
        <PageBanner />

        {/* Filter Bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide no-scrollbar">
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
                placeholder="Search temples, deities, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-white"
              />
            </div>

            {/* State Filter */}
            <select
              value={activeState}
              onChange={(e) => setActiveState(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white text-gray-700"
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* Featured Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${showFeaturedOnly ? "bg-orange-500" : "bg-gray-200"}`}
                onClick={() => setShowFeaturedOnly((v) => !v)}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showFeaturedOnly ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                Featured Only
              </span>
            </label>

            <span className="text-sm text-gray-400 ml-auto">
              {filtered.length} temples found
            </span>
          </div>

          {/* Temple Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((temple) => (
                <TempleCard key={temple.id} temple={temple} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No temples found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Temples");
                  setActiveState("All States");
                }}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Load More */}
          {filtered.length > 0 && (
            <div className="text-center mt-12">
              <button className="inline-flex items-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold px-8 py-3 rounded-full transition-all duration-200">
                Load More Temples
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
