"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  {
    value: "1M+",
    label: "Devotees Served",
    icon: "🙏",
    desc: "have trusted us in their devotional journey",
  },
  {
    value: "4.8★",
    label: "App Rating",
    icon: "⭐",
    desc: "Over 10,000 devotees express their love for us on Play Store",
  },
  {
    value: "30+",
    label: "Countries Served",
    icon: "🌍",
    desc: "We help devotees globally reconnect with their devotional heritage",
  },
  {
    value: "50K+",
    label: "Services Completed",
    icon: "🛕",
    desc: "Millions of devotees have begun Puja and Chadhava at famous temples",
  },
];

const TEAM = [
  {
    name: "Arjun Mehta",
    role: "Co-Founder & CEO",
    desc: "Spiritual technologist with 10+ years building devotional platforms. IIT alumnus.",
    initials: "AM",
    color: "bg-orange-500",
  },
  {
    name: "Priya Sharma",
    role: "Co-Founder & CTO",
    desc: "Engineering lead with deep passion for bridging tradition and technology.",
    initials: "PS",
    color: "bg-rose-500",
  },
  {
    name: "Pandit Ramesh Shastri",
    role: "Head of Rituals",
    desc: "Vedic scholar with 25+ years of experience performing authentic Vedic rituals.",
    initials: "RS",
    color: "bg-amber-500",
  },
  {
    name: "Kavya Iyer",
    role: "Head of Temple Relations",
    desc: "Manages partnerships with 500+ temples across India and ensures service quality.",
    initials: "KI",
    color: "bg-teal-500",
  },
];

const VALUES = [
  {
    icon: "🕉️",
    title: "Authentic Rituals",
    desc: "Every puja follows the traditional Vedic procedure. We never compromise on authenticity.",
  },
  {
    icon: "🔒",
    title: "Trust & Transparency",
    desc: "Video proof of every ritual, real-time tracking and honest communication always.",
  },
  {
    icon: "🌏",
    title: "Accessibility",
    desc: "Making sacred temple rituals accessible to every devotee, regardless of location.",
  },
  {
    icon: "💎",
    title: "Devotee First",
    desc: "We exist to serve the devotional needs of our community — not for profit at their expense.",
  },
];

const MEDIA_LOGOS = [
  "Hindustan Times",
  "Times of India",
  "India Today",
  "NDTV",
  "Economic Times",
  "YourStory",
];

// ── Image Placeholder ──────────────────────────────────────────────────────────
function ImagePlaceholder({
  className = "",
  label = "",
  gradient = "from-orange-800/50 to-red-900/60",
}: {
  className?: string;
  label?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`relative bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="flex flex-col items-center text-white/40 gap-2 z-10 p-4">
        <span className="text-4xl">🛕</span>
        {label && <p className="text-xs text-center opacity-60">{label}</p>}
        <p className="text-xs opacity-40">Upload Image</p>
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white font-sans">
        {/* Hero Banner */}
        <section className="relative h-72 md:h-96 overflow-hidden">
          <ImagePlaceholder
            className="absolute inset-0 w-full h-full"
            gradient="from-[#2d0a00] to-[#1a0500]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0500]/95 via-[#2d0a00]/80 to-transparent" />
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <p className="text-orange-300 text-xs font-semibold tracking-widest uppercase mb-3">
                Our Story
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                About Mandirlok
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed">
                India's growing platform for authentic temple rituals.
                Connecting millions of devotees with sacred temples across
                India.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <ImagePlaceholder
                  label="Mandirlok Team"
                  className="w-full h-72 md:h-96"
                  gradient="from-orange-700/60 to-red-900/70"
                />
              </div>

              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-orange-100">
                  🌸 Our Mission
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Committed to Building the Most Trusted Devotional Platform
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  Mandirlok was founded with a single vision — to make authentic
                  temple rituals accessible to every Hindu devotee in the world,
                  regardless of their location. We believe that geography should
                  never be a barrier to divine blessings.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  We partner with India's most revered temples — Jyotirlingas,
                  Shaktipeeths, Divya Desams — and trained Vedic pandits to
                  perform authentic rituals on your behalf, with full video
                  documentation.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Founded", value: "2020" },
                    { label: "Temples Partner", value: "500+" },
                    { label: "Expert Pandits", value: "1,200+" },
                    { label: "Devotees Served", value: "1M+" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-orange-50 rounded-xl p-4 border border-orange-100"
                    >
                      <div className="text-2xl font-extrabold text-orange-600">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/poojas"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-orange-200 text-sm"
                >
                  Book a Puja Today
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
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-14 bg-gradient-to-r from-orange-600 to-rose-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                India's Largest Devotional Platform
              </h2>
              <p className="text-white/80 text-sm">
                Trusted by devotees in 30+ countries
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                    {s.value}
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">
                    {s.label}
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-orange-100">
                🌸 Our Values
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                What We Stand For
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                Our core values guide every decision, every partnership and
                every ritual we facilitate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group hover:border-orange-200"
                >
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center text-3xl mb-4 transition-colors duration-200">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border border-orange-100">
                🌸 Our Team
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                The People Behind Mandirlok
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                A passionate team of technologists, Vedic scholars and temple
                relations experts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  {/* Photo Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-24 h-24 rounded-full ${member.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
                      >
                        {member.initials}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-100/80 to-transparent" />
                    {/* Upload hint */}
                    <div className="absolute top-2 right-2 bg-white/80 text-xs text-gray-500 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      📷 Upload Photo
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-orange-500 text-xs font-semibold mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {member.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Section */}
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm font-semibold tracking-widest uppercase mb-8">
              As Featured In
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
              {MEDIA_LOGOS.map((logo) => (
                <div
                  key={logo}
                  className="h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors text-center px-2">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#1a0500] to-[#3d1500] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Begin Your Devotional Journey Today
            </h2>
            <p className="text-white/70 text-sm mb-8 leading-relaxed">
              Join over 1 million devotees who trust Mandirlok to connect them
              with India's most sacred temples. Book your first puja in minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/poojas"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:scale-105"
              >
                Book a Puja
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
                href="/chadhava"
                className="inline-flex items-center gap-2 border border-white/50 text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                Explore Chadhava
              </Link>
            </div>
          </div>
        </section>

        {/* Address Section */}
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-orange-500">📍</span> Our Address
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Mandirlok Technologies Pvt. Ltd.
                  <br />
                  2nd Floor, Sunrise Tower, Sector 62,
                  <br />
                  Noida, Uttar Pradesh - 201301
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-orange-500">📞</span> Contact
                </h4>
                <p className="text-gray-500 text-sm">Phone: +91 98765 43210</p>
                <p className="text-gray-500 text-sm">
                  Email: help@mandirlok.com
                </p>
                <p className="text-gray-500 text-sm">
                  WhatsApp: +91 87654 32109
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-orange-500">⏰</span> Support Hours
                </h4>
                <p className="text-gray-500 text-sm">
                  Monday – Saturday: 9 AM – 9 PM
                </p>
                <p className="text-gray-500 text-sm">Sunday: 10 AM – 6 PM</p>
                <p className="text-gray-500 text-sm">
                  Festivals: Special hours apply
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
