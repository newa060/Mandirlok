"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/actions/admin";

// ── Temple Images (real Wikimedia Commons photos) ────────────────────────────
const SLIDE_IMAGES = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kashi_Vishwanath_Temple.jpg/1200px-Kashi_Vishwanath_Temple.jpg",
    title: "Perform Your Puja with Mandirlok",
    subtitle:
      "Let your prayers reach the Divine through authentic Vedic rituals performed on your behalf at India's holiest temples.",
    cta: "Participate in a Puja",
    ctaLink: "/poojas",
    secondary: "Explore Temples",
    secondaryLink: "/temples",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Tirumala_temple_shoot.jpg/1200px-Tirumala_temple_shoot.jpg",
    title: "Sacred Chadhava Offerings",
    subtitle:
      "Offer sacred items at renowned temples across India — from the comfort of your home.",
    cta: "Participate in Chadhava",
    ctaLink: "/chadhava",
    secondary: "View All Temples",
    secondaryLink: "/temples",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mahakaleshwar_Jyotirlinga.jpg/1200px-Mahakaleshwar_Jyotirlinga.jpg",
    title: "Seek Divine Blessings Today",
    subtitle:
      "Connect with 500+ temples. Participate in pujas, chadhava and receive videos of completed rituals delivered on WhatsApp.",
    cta: "Get Started",
    ctaLink: "/poojas",
    secondary: "How It Works",
    secondaryLink: "#how-it-works",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Vaishno-devi-bhavan.jpg/1200px-Vaishno-devi-bhavan.jpg",
    title: "Experience Mata's Blessings",
    subtitle:
      "Can't travel to Mata Vaishno Devi? Let us carry your prayers to the divine abode in the Trikuta Mountains.",
    cta: "Participate in Aarti Seva",
    ctaLink: "/poojas",
    secondary: "Explore Devi Temples",
    secondaryLink: "/temples",
  },
];

const TRUST_BADGES = [
  { icon: "🙏", label: "Trusted by 1 Million+ Devotees" },
  { icon: "🔒", label: "100% Secure Payments" },
  { icon: "🕌", label: "500+ Sacred Temples" },
  { icon: "📹", label: "Video Proof of Every Puja" },
];

const FEATURED_POOJAS = [
  {
    title: "Mahakaleshwar Special Abhishek",
    temple: "Shri Mahakaleshwar Jyotirlinga, Ujjain",
    date: "Every Monday",
    description:
      "For peace, prosperity and removal of all obstacles. Rudrabhishek performed in your name.",
    tag: "MOST POPULAR",
    tagColor: "bg-orange-500",
    deity: "Shiva",
    emoji: "🪔",
    benefit: "Health & Prosperity",
  },
  {
    title: "Tirupati Balaji Archana",
    temple: "Sri Venkateswara Temple, Tirupati",
    date: "Every Day",
    description:
      "Seek blessings for wealth, health and fulfilment of all wishes. Archana on your name.",
    tag: "SPECIAL OFFER",
    tagColor: "bg-rose-500",
    deity: "Vishnu",
    emoji: "🌺",
    benefit: "Wealth & Fortune",
  },
  {
    title: "Kashi Vishwanath Rudrabhishek",
    temple: "Shri Kashi Vishwanath Temple, Varanasi",
    date: "Every Monday & Pradosh",
    description:
      "Receive the divine blessings of Lord Shiva through this powerful Rudrabhishek.",
    tag: "TRENDING",
    tagColor: "bg-amber-500",
    deity: "Shiva",
    emoji: "🪔",
    benefit: "Remove Obstacles",
  },
  {
    title: "Siddhivinayak Maha Puja",
    temple: "Shree Siddhivinayak Temple, Mumbai",
    date: "Every Wednesday",
    description:
      "Remove obstacles and bring success. Maha Puja performed by experienced pandits.",
    tag: "",
    tagColor: "",
    deity: "Ganesha",
    emoji: "🐘",
    benefit: "New Beginnings",
  },
  {
    title: "Vaishno Devi Aarti Seva",
    temple: "Shri Mata Vaishno Devi, Katra",
    date: "Every Friday",
    description:
      "Special Aarti and Chadhava offering at the divine abode of Mata Vaishno Devi.",
    tag: "NEW",
    tagColor: "bg-teal-500",
    deity: "Devi",
    emoji: "🔱",
    benefit: "Divine Protection",
  },
  {
    title: "Shirdi Sai Baba Seva",
    temple: "Shri Sai Baba Mandir, Shirdi",
    date: "Every Thursday",
    description:
      "Offer your prayers and receive Sai Baba's divine grace and blessings.",
    tag: "",
    tagColor: "",
    deity: "Sai",
    emoji: "🙏",
    benefit: "Peace & Grace",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Puja",
    desc: "Browse 500+ puja services across India's most sacred temples and select the one that resonates.",
    icon: "🙏",
  },
  {
    step: "02",
    title: "Enter Your Name",
    desc: "Provide your name and gotra for the Sankalp. Our pandits will chant it during the puja.",
    icon: "✍️",
  },
  {
    step: "03",
    title: "Secure Payment",
    desc: "Pay securely using UPI, credit/debit card, or net banking through our Razorpay gateway.",
    icon: "🔐",
  },
  {
    step: "04",
    title: "Receive Puja Video",
    desc: "Get a complete video of your puja performed at the temple, delivered within 24–48 hours.",
    icon: "📹",
  },
];

const STATS = [
  { value: "1M+", label: "Devotees Served" },
  { value: "500+", label: "Sacred Temples" },
  { value: "50K+", label: "Pujas Completed" },
  { value: "25+", label: "States Covered" },
];

const FEATURES = [
  {
    icon: "🛕",
    title: "Sacred Temple Network",
    desc: "Access 500+ renowned temples across India — Jyotirlingas, Shaktipeeths, Divya Desams and more.",
  },
  {
    icon: "📿",
    title: "Authentic Vedic Rituals",
    desc: "All rituals performed by trained, experienced pandits following traditional Vedic procedures.",
  },
  {
    icon: "📱",
    title: "Real-Time Updates",
    desc: "Track your puja participation status and receive instant WhatsApp updates on ritual completion.",
  },
  {
    icon: "🎥",
    title: "Video Proof",
    desc: "Receive a high-quality video of your puja so you can witness the divine ritual personally.",
  },
  {
    icon: "💬",
    title: "WhatsApp Support",
    desc: "Dedicated support via WhatsApp for all participation queries, customization and post-puja questions.",
  },
  {
    icon: "🌍",
    title: "Participate from Anywhere",
    desc: "Devotees across 30+ countries trust Mandirlok to connect them with India's sacred temples.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    city: "Delhi",
    text: "I participated in a Rudrabhishek at Mahakaleshwar for my father's health. The video was so moving. Our family felt truly connected to the divine.",
    stars: 5,
    initials: "PS",
    color: "bg-orange-500",
  },
  {
    name: "Ramesh Nair",
    city: "Bangalore",
    text: "The entire experience was seamless. From participation to receiving the video, everything was professional. Will definitely participate again!",
    stars: 5,
    initials: "RN",
    color: "bg-rose-500",
  },
  {
    name: "Meena Gupta",
    city: "Mumbai",
    text: "My son lives abroad and participated in a puja at Tirupati for me. I received the video and felt Swami's blessings directly. Wonderful service.",
    stars: 5,
    initials: "MG",
    color: "bg-amber-500",
  },
  {
    name: "Suresh Rao",
    city: "Chennai",
    text: "Very authentic and transparent. I could see the pandit take my name in the sankalp. This is exactly what I needed.",
    stars: 5,
    initials: "SR",
    color: "bg-teal-500",
  },
];

// ── Star Rating ──────────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({
  tag,
  title,
  subtitle,
}: {
  tag?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-10">
      {tag && (
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3 border border-orange-100">
          🌸 {tag}
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Puja Card (no price) ──────────────────────────────────────────────────────
function PujaCard({ puja }: { puja: (typeof FEATURED_POOJAS)[0] }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Image placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-800/70 to-rose-900/70 flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <span className="text-6xl group-hover:scale-110 transition-transform duration-500 relative z-10">
          {puja.emoji}
        </span>
        {puja.tag && (
          <span
            className={`absolute top-3 left-3 ${puja.tagColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}
          >
            {puja.tag}
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {puja.deity}
        </span>
      </div>
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-snug">
          {puja.title}
        </h3>
        <div className="flex items-center gap-1.5 mb-1">
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
          <p className="text-xs text-gray-500 line-clamp-1">{puja.temple}</p>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-gray-500 font-medium">{puja.date}</p>
        </div>
        <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {puja.description}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-100">
            ✓ {puja.benefit}
          </span>
          <span className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-100">
            📹 Video Proof
          </span>
        </div>
        <Link
          href="/poojas"
          className="w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-orange-200"
        >
          Participate Now
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
        </Link>
      </div>
    </div>
  );
}

// ── Animated Sliding Hero ─────────────────────────────────────────────────────
function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [nextIndex, setNextIndex] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number, dir: "left" | "right" = "left") => {
    if (animating || idx === current) return;
    setDirection(dir);
    setNextIndex(idx);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 800);
  };

  const [heroSlides, setHeroSlides] = useState(SLIDE_IMAGES);

  useEffect(() => {
    async function fetchSlides() {
      const res = await getSettings("landing_page_slides");
      if (res && res.value && res.value.length > 0) {
        setHeroSlides(res.value);
      }
    }
    fetchSlides();
  }, []);

  const next = () => goTo((current + 1) % heroSlides.length, "left");
  const prev = () =>
    goTo((current - 1 + heroSlides.length) % heroSlides.length, "right");

  useEffect(() => {
    timeoutRef.current = setTimeout(next, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, animating, heroSlides]);

  const slide = heroSlides[current];
  const nextSlide = heroSlides[nextIndex];

  return (
    <section className="relative w-full h-[560px] md:h-[640px] overflow-hidden bg-[#1a0500]">
      <style>{`
        @keyframes slideOutLeft  { from { transform: translateX(0); }    to { transform: translateX(-100%); } }
        @keyframes slideOutRight { from { transform: translateX(0); }    to { transform: translateX(100%); } }
        @keyframes slideInRight  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideInLeft   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-slide-out-left  { animation: slideOutLeft  800ms cubic-bezier(.77,0,.18,1) forwards; }
        .hero-slide-out-right { animation: slideOutRight 800ms cubic-bezier(.77,0,.18,1) forwards; }
        .hero-slide-in-right  { animation: slideInRight  800ms cubic-bezier(.77,0,.18,1) forwards; }
        .hero-slide-in-left   { animation: slideInLeft   800ms cubic-bezier(.77,0,.18,1) forwards; }
      `}</style>

      {/* ── Current slide (slides OUT) ── */}
      <div
        key={`cur-${current}`}
        className={`absolute inset-0 ${animating ? (direction === "left" ? "hero-slide-out-left" : "hero-slide-out-right") : ""}`}
        style={{ zIndex: 2 }}
      >
        <img
          src={slide.src}
          alt={slide.title}
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay — stronger on left, lighter on right so image shows through */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(20,4,0,0.88) 0%, rgba(20,4,0,0.65) 40%, rgba(20,4,0,0.25) 70%, rgba(20,4,0,0.08) 100%)",
          }}
        />
      </div>

      {/* ── Next slide (slides IN) ── */}
      {animating && (
        <div
          key={`next-${nextIndex}`}
          className={
            direction === "left" ? "hero-slide-in-right" : "hero-slide-in-left"
          }
          style={{ position: "absolute", inset: 0, zIndex: 3 }}
        >
          <img
            src={nextSlide.src}
            alt={nextSlide.title}
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(20,4,0,0.88) 0%, rgba(20,4,0,0.65) 40%, rgba(20,4,0,0.25) 70%, rgba(20,4,0,0.08) 100%)",
            }}
          />
        </div>
      )}

      {/* ── Text Content ── */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-xl">
            <p
              key={`tag-${current}`}
              className="text-orange-300 text-xs font-bold tracking-widest uppercase mb-4"
              style={{ animation: "fadeSlideUp 0.55s ease-out 0.05s both" }}
            >
              🙏 Mandirlok Sacred Services
            </p>
            <h1
              key={`h-${current}`}
              className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5"
              style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}
            >
              {slide.title}
            </h1>
            <p
              key={`sub-${current}`}
              className="text-white/80 text-base md:text-lg mb-8 leading-relaxed"
              style={{ animation: "fadeSlideUp 0.6s ease-out 0.2s both" }}
            >
              {slide.subtitle}
            </p>
            <div
              key={`cta-${current}`}
              className="flex flex-wrap gap-4"
              style={{ animation: "fadeSlideUp 0.6s ease-out 0.3s both" }}
            >
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-xl hover:shadow-orange-500/40 hover:scale-105 text-sm"
              >
                {slide.cta}
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href={slide.secondaryLink}
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-200 text-sm backdrop-blur-sm"
              >
                {slide.secondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Dots ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
        style={{ zIndex: 20 }}
      >
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "left" : "right")}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2.5 bg-orange-400" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>

      {/* ── Prev / Next Arrows ── */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-orange-500 transition-all duration-200 border border-white/10"
        style={{ zIndex: 20 }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-orange-500 transition-all duration-200 border border-white/10"
        style={{ zIndex: 20 }}
      >
        <svg
          className="w-5 h-5"
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
      </button>
    </section>
  );
}

// ── Trust Bar — infinite scrolling marquee ──────────────────────────────────
const MARQUEE_ITEMS = [
  { icon: "🙏", label: "Trusted by 1 Million+ Devotees" },
  { icon: "🔒", label: "100% Secure Payments" },
  { icon: "🛕", label: "500+ Sacred Temples" },
  { icon: "📹", label: "Video Proof of Every Puja" },
  { icon: "⚡", label: "Participation in Under 2 Minutes" },
  { icon: "📿", label: "Authentic Vedic Rituals" },
  { icon: "🌍", label: "Devotees in 30+ Countries" },
  { icon: "💬", label: "WhatsApp Support 24/7" },
  { icon: "🎁", label: "Prasad Delivered to Door" },
  { icon: "✅", label: "100% Money-Back Guarantee" },
];

function TrustBar() {
  return (
    <div className="bg-white border-b border-orange-100 shadow-sm overflow-hidden py-3.5 relative">
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #fff 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, #fff 0%, transparent 100%)",
        }}
      />
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 32s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="marquee-track">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-7 whitespace-nowrap"
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-sm font-semibold text-gray-700">
              {item.label}
            </span>
            <span className="text-orange-200 text-lg ml-4">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 bg-gradient-to-br from-orange-50 to-amber-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Simple Process"
          title="How Mandirlok Works"
          subtitle="A seamless 4-step process to get authentic puja performed at India's sacred temples on your behalf."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="relative text-center group">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+3rem)] w-full h-px border-t-2 border-dashed border-orange-200 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 border border-orange-100">
                  {step.icon}
                </div>
                <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  Step {step.step}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/poojas"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-orange-300/50 transition-all duration-200 hover:scale-105 text-base"
          >
            Participate in Your First Puja
            <svg
              className="w-5 h-5"
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
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section className="bg-gradient-to-r from-orange-600 to-rose-700 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            India's Growing Devotional Platform
          </h2>
          <p className="text-white/80 text-sm">
            Connecting devotees with sacred temples since 2020
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-1">
                {s.value}
              </div>
              <div className="text-white/80 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Why Choose Us"
          title="One Platform for All Devotional Needs"
          subtitle="Mandirlok brings together the most sacred temples, trained pandits, and modern technology to serve your spiritual journey."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-2xl hover:bg-orange-50 transition-colors duration-200 group border border-transparent hover:border-orange-100"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center text-3xl shrink-0 transition-colors duration-200">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Reviews"
          title="What Our Devotees Say"
          subtitle="Thousands of devotees trust Mandirlok to connect them with divine blessings from India's sacred temples."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 cursor-pointer ${active === i ? "border-orange-300 shadow-orange-100" : "border-transparent"}`}
              onClick={() => setActive(i)}
            >
              <Stars count={t.stars} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 line-clamp-4">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen font-sans bg-white">
        <HeroSection />
        <TrustBar />

        {/* Featured Poojas Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              tag="Mandirlok Special Pujas"
              title="Upcoming Sacred Pujas & Rituals"
              subtitle="Participate in authentic pujas performed at India's most powerful temples. Receive a video within 24–48 hours."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {FEATURED_POOJAS.map((puja, i) => (
                <PujaCard key={i} puja={puja} />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/poojas"
                className="inline-flex items-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold px-8 py-3 rounded-full transition-all duration-200"
              >
                View All Pujas
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <HowItWorksSection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
