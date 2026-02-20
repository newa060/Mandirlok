"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TempleImage, { TEMPLE_IMAGES } from "@/components/ui/TempleImage";
import PoojaCard from "@/components/pooja/PoojaCard";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import { ALL_POOJAS } from "@/components/pooja/PoojaData";
import { MapPin, Clock, Globe, Phone, ChevronRight, Heart } from "lucide-react";

// Temple data keyed by ID
const TEMPLE_DATA: Record<
  string,
  {
    id: number;
    name: string;
    imageKey: string;
    deity: string;
    location: string;
    state: string;
    about: string;
    rating: number;
    reviews: number;
    openTime: string;
    phone: string;
    website: string;
    mapUrl: string;
    poojaIds: number[];
    chadhavaItems: { id: number; name: string; price: number; emoji: string }[];
    ratings: { stars: number; percent: number }[];
    gallery: string[];
  }
> = {
  "1": {
    id: 1,
    name: "Kashi Vishwanath Temple",
    imageKey: "kashi-vishwanath",
    deity: "Shiva",
    location: "Vishwanath Gali, Varanasi, Uttar Pradesh",
    state: "Uttar Pradesh",
    rating: 4.9,
    reviews: 12400,
    about:
      "The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It stands on the western bank of the holy river Ganga and is one of the twelve Jyotirlingas — the holiest of Shiva temples. The temple has been mentioned in the Puranas including the Kashi Khanda of Skanda Purana. It is visited by hundreds of thousands of devotees every year.",
    openTime: "3:00 AM – 11:00 PM",
    phone: "+91 98765 43210",
    website: "shrikashivishwanath.org",
    mapUrl: "https://maps.google.com/?q=Kashi+Vishwanath+Temple+Varanasi",
    poojaIds: [101, 103, 106, 110, 112],
    chadhavaItems: [
      { id: 201, name: "Bel Patra", price: 51, emoji: "🌿" },
      { id: 202, name: "Dhatura", price: 51, emoji: "🌸" },
      { id: 203, name: "Flower Garland", price: 151, emoji: "💐" },
      { id: 204, name: "Prasad Thali", price: 251, emoji: "🍱" },
      { id: 205, name: "Panchamrit", price: 251, emoji: "🥛" },
      { id: 206, name: "Pure Ghee Diya", price: 251, emoji: "🪔" },
    ],
    ratings: [
      { stars: 5, percent: 83 },
      { stars: 4, percent: 12 },
      { stars: 3, percent: 3 },
      { stars: 2, percent: 1 },
      { stars: 1, percent: 1 },
    ],
    gallery: ["kashi-vishwanath", "somnath", "mahakaleshwar"],
  },
  "2": {
    id: 2,
    name: "Tirupati Balaji Temple",
    imageKey: "tirupati-balaji",
    deity: "Vishnu",
    location: "Tirumala Hills, Tirupati, Andhra Pradesh",
    state: "Andhra Pradesh",
    rating: 4.9,
    reviews: 23100,
    about:
      "The Tirumala Venkateswara Temple is a famous Hindu temple located on the Tirumala Hills in Tirupati, Andhra Pradesh. The main deity, Lord Venkateswara, is a form of Lord Vishnu believed to have appeared here to save mankind. It is the richest and most visited religious temple in the world, receiving an average of 50,000–100,000 pilgrims daily.",
    openTime: "2:30 AM – 1:00 AM",
    phone: "+91 877 226 5000",
    website: "tirumala.org",
    mapUrl: "https://maps.google.com/?q=Tirupati+Balaji+Temple",
    poojaIds: [102, 105, 108],
    chadhavaItems: [
      { id: 301, name: "Lotus Flower", price: 201, emoji: "🪷" },
      { id: 302, name: "Tulsi Leaves", price: 51, emoji: "🌱" },
      { id: 303, name: "Modak Offering", price: 251, emoji: "🥮" },
    ],
    ratings: [
      { stars: 5, percent: 87 },
      { stars: 4, percent: 9 },
      { stars: 3, percent: 2 },
      { stars: 2, percent: 1 },
      { stars: 1, percent: 1 },
    ],
    gallery: ["tirupati-balaji", "meenakshi", "badrinath"],
  },
};

// Fallback for temples 3–12
const DEFAULT_TEMPLE = TEMPLE_DATA["1"];

export default function TempleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const temple = TEMPLE_DATA[params.id] ?? {
    ...DEFAULT_TEMPLE,
    id: parseInt(params.id),
  };
  const templePoojas = ALL_POOJAS.filter((p) => temple.poojaIds.includes(p.id));

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#fdf6ee]">
        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b border-[#f0dcc8]">
          <div className="container-app py-3 flex items-center gap-2 text-xs text-[#6b5b45]">
            <Link href="/" className="hover:text-[#ff7f0a] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/temples"
              className="hover:text-[#ff7f0a] transition-colors"
            >
              Temples
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#1a1209] font-medium">{temple.name}</span>
          </div>
        </div>

        {/* ── Hero Image ── */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <TempleImage
            templeKey={temple.imageKey}
            className="w-full h-full"
            showOverlay
            overlayOpacity={0.35}
          />
          {/* Overlaid info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="container-app">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Badge variant="gold" className="mb-2">
                    {temple.deity}
                  </Badge>
                  <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
                    {temple.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <MapPin size={14} className="text-[#ffd9a8]" />
                    {temple.location}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/15 backdrop-blur border border-white/30 rounded-xl px-4 py-2 text-center">
                    <p className="text-xl font-bold text-[#ffd9a8]">
                      {temple.rating}
                    </p>
                    <StarRating
                      rating={temple.rating}
                      size={10}
                      className="justify-center"
                    />
                    <p className="text-white/70 text-[10px]">
                      {(temple.reviews / 1000).toFixed(1)}k reviews
                    </p>
                  </div>
                  <button className="bg-white/15 backdrop-blur border border-white/30 rounded-xl p-3 text-white hover:bg-white/25 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-app py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── LEFT / MAIN ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
                <h2 className="font-display font-semibold text-[#1a1209] mb-3">
                  About the Temple
                </h2>
                <p className="text-sm text-[#6b5b45] leading-relaxed mb-4">
                  {temple.about}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#6b5b45]">
                  <div className="flex items-center gap-2 bg-[#fff8f0] border border-[#f0dcc8] rounded-xl p-2.5">
                    <Clock size={14} className="text-[#ff7f0a] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a1209] text-[11px]">
                        Temple Hours
                      </p>
                      <p>{temple.openTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#fff8f0] border border-[#f0dcc8] rounded-xl p-2.5">
                    <Phone size={14} className="text-[#ff7f0a] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a1209] text-[11px]">
                        Contact
                      </p>
                      <p>{temple.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#fff8f0] border border-[#f0dcc8] rounded-xl p-2.5">
                    <Globe size={14} className="text-[#ff7f0a] flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a1209] text-[11px]">
                        Website
                      </p>
                      <p className="truncate">{temple.website}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Gallery */}
              <div>
                <h2 className="font-display font-semibold text-[#1a1209] mb-3">
                  Temple Gallery
                </h2>
                <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
                  {temple.gallery.map((key, i) => (
                    <div
                      key={key}
                      className={`relative overflow-hidden ${i === 0 ? "row-span-2 h-64" : "h-[7.75rem]"}`}
                    >
                      <TempleImage
                        templeKey={key}
                        className="w-full h-full hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Poojas */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-[#1a1209]">
                    Poojas at This Temple
                  </h2>
                  <Badge variant="saffron">
                    {templePoojas.length} Available
                  </Badge>
                </div>
                <div className="space-y-3">
                  {templePoojas.map((pooja) => (
                    <PoojaCard
                      key={pooja.id}
                      pooja={pooja}
                      variant="horizontal"
                    />
                  ))}
                </div>
              </div>

              {/* Chadhava - Price tag removed from offerings */}
              <div>
                <h2 className="font-display font-semibold text-[#1a1209] mb-4">
                  Chadhava Offerings
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {temple.chadhavaItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#f0dcc8] rounded-xl p-4 text-center hover:border-[#ffbd6e] hover:shadow-sm transition-all"
                    >
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <p className="text-xs font-semibold text-[#1a1209] mb-1">
                        {item.name}
                      </p>
                      {/* Price tag removed from here */}
                      <Link
                        href="/chadhava"
                        className="block bg-gradient-to-r from-[#ff7f0a] to-[#ff9b30] text-white text-[10px] font-bold py-1.5 rounded-full hover:shadow-sm transition-all"
                      >
                        Add Offering
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings Breakdown */}
              <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
                <h2 className="font-display font-semibold text-[#1a1209] mb-4">
                  Ratings & Reviews
                </h2>
                <div className="flex items-center gap-8 mb-4">
                  <div className="text-center">
                    <p className="text-5xl font-display font-bold text-[#ff7f0a]">
                      {temple.rating}
                    </p>
                    <StarRating
                      rating={temple.rating}
                      size={14}
                      className="justify-center my-1"
                    />
                    <p className="text-xs text-[#6b5b45]">
                      {(temple.reviews / 1000).toFixed(1)}k ratings
                    </p>
                  </div>
                  <div className="flex-1">
                    {temple.ratings.map(({ stars, percent }) => (
                      <div
                        key={stars}
                        className="flex items-center gap-2 mb-1.5"
                      >
                        <span className="text-xs text-[#6b5b45] w-4 text-right">
                          {stars}
                        </span>
                        <span className="text-[#f0bc00] text-xs">★</span>
                        <div className="flex-1 bg-[#f0dcc8] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#ff7f0a] h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#6b5b45] w-8">
                          {percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white border border-[#f0dcc8] rounded-2xl overflow-hidden shadow-card">
                <div className="h-48 bg-gradient-to-br from-[#e8f4e8] to-[#d4e8d4] flex flex-col items-center justify-center gap-3">
                  <p className="text-4xl">📍</p>
                  <div className="text-center">
                    <p className="font-semibold text-[#1a1209] text-sm">
                      {temple.name}
                    </p>
                    <p className="text-xs text-[#6b5b45]">{temple.location}</p>
                  </div>
                  <a
                    href={temple.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-to-r from-[#ff7f0a] to-[#ff9b30] text-white text-xs font-semibold px-5 py-2 rounded-full hover:shadow-sm transition-all"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="space-y-5">
              {/* Quick Book - Button text changed */}
              <div className="bg-white border border-[#f0dcc8] rounded-2xl p-5 shadow-card sticky top-24">
                <h3 className="font-display font-semibold text-[#1a1209] mb-4">
                  Participate in a Pooja
                </h3>
                <div className="space-y-2 mb-5">
                  {templePoojas.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/poojas/${p.id}`}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#fff8f0] border border-transparent hover:border-[#ffd9a8] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.emoji}</span>
                        <div>
                          <p className="text-xs font-semibold text-[#1a1209]">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-[#6b5b45]">
                            {p.duration}
                          </p>
                        </div>
                      </div>
                      {/* Price tag removed from here */}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/poojas/${temple.poojaIds[0]}`}
                  className="w-full block text-center bg-gradient-to-r from-[#ff7f0a] to-[#ff9b30] text-white font-semibold text-sm py-3 rounded-xl shadow-[0_4px_15px_rgba(255,127,10,0.3)] hover:shadow-[0_6px_25px_rgba(255,127,10,0.45)] transition-all mb-3"
                >
                  🙏 Participate in a Pooja
                </Link>
                <Link
                  href="/chadhava"
                  className="w-full block text-center border-2 border-[#ff7f0a] text-[#ff7f0a] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#fff8f0] transition-colors"
                >
                  🌸 Make a Chadhava
                </Link>
                <p className="text-center text-[10px] text-[#6b5b45] mt-3 flex items-center justify-center gap-1">
                  📹 Video proof on WhatsApp after pooja
                </p>
              </div>

              {/* Trust Box */}
              <div className="bg-[#fff8f0] border border-[#ffd9a8] rounded-2xl p-5">
                <h4 className="font-semibold text-[#1a1209] text-sm mb-3">
                  Why Participate with Mandirlok?
                </h4>
                {[
                  "✅ Verified, experienced pandits only",
                  "📹 HD video proof of pooja",
                  "🔒 100% secure Razorpay payment",
                  "💬 Real-time WhatsApp updates",
                  "🌿 Authentic Vedic rituals",
                  "↩️ Full refund if cancelled 24h before",
                ].map((t) => (
                  <p
                    key={t}
                    className="text-xs text-[#6b5b45] py-1.5 border-b border-[#f0dcc8] last:border-0"
                  >
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}