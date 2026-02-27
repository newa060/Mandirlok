"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, MapPin, Loader2, ChevronRight, Search } from "lucide-react";
import { getSavedTemples, toggleTempleFavorite } from "@/lib/actions/user";

interface Temple {
    _id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    images: string[];
    deity: string;
    rating: number;
}

export default function SavedTemplesPage() {
    const [temples, setTemples] = useState<Temple[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [templeRes, profileRes] = await Promise.all([
                    getSavedTemples(),
                    fetch("/api/auth/me").then(r => r.json())
                ]);

                if (templeRes.success) {
                    setTemples(templeRes.data);
                }
                if (profileRes.success) {
                    setProfile(profileRes.data);
                }
            } catch (err) {
                console.error("Error fetching saved temples:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleRemove = async (id: string) => {
        try {
            const res = await toggleTempleFavorite(id);
            if (res.success) {
                setTemples(prev => prev.filter(t => t._id !== id));
            }
        } catch (err) {
            console.error("Error removing temple:", err);
        }
    };

    return (
        <>
            <Navbar />
            <main className="pt-20 min-h-screen bg-[#fdf6ee]">
                <div className="container-app py-8">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#f0dcc8] rounded-2xl p-5 shadow-card">
                                <div className="text-center mb-5 pb-5 border-b border-[#f0dcc8]">
                                    {profile?.photo ? (
                                        <img
                                            src={profile.photo}
                                            alt={profile.name}
                                            className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-[#ff7f0a]"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff7f0a] to-[#8b0000] text-white font-display font-bold text-2xl flex items-center justify-center mx-auto mb-3">
                                            {profile?.name ? profile.name.charAt(0).toUpperCase() : "🙏"}
                                        </div>
                                    )}
                                    <h2 className="font-display font-semibold text-[#1a1209]">
                                        {profile?.name || "Devotee"}
                                    </h2>
                                    <p className="text-xs text-[#6b5b45]">{profile?.email || ""}</p>
                                </div>

                                <nav className="space-y-1">
                                    {[
                                        { label: "My Bookings", href: "/dashboard" },
                                        { label: "Profile", href: "/dashboard/profile" },
                                        { label: "Saved Temples", href: "/dashboard/saved", active: true },
                                        { label: "Notifications", href: "/dashboard/notifications" },
                                    ].map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${item.active
                                                ? "bg-[#fff8f0] text-[#ff7f0a] font-semibold border border-[#ffd9a8]"
                                                : "text-[#6b5b45] hover:bg-[#fdf6ee] hover:text-[#ff7f0a]"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/auth/logout", { method: "POST" });
                                            window.location.href = "/";
                                        }}
                                        className="flex w-full text-left items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#6b5b45] hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 md:p-8 shadow-card min-h-[500px]">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="heading-md text-[#1a1209] flex items-center gap-2">
                                        <Heart className="text-rose-500 fill-rose-500" size={24} />
                                        Saved Temples
                                    </h1>
                                    <span className="badge-saffron">{temples.length} Saved</span>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-24">
                                        <Loader2 size={40} className="animate-spin text-[#ff7f0a] mb-4" />
                                        <p className="text-[#6b5b45]">Loading your spiritual bookmarks...</p>
                                    </div>
                                ) : temples.length === 0 ? (
                                    <div className="text-center py-24 bg-[#fffcf8] border border-dashed border-[#fbd38d] rounded-2xl">
                                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="text-[#ff7f0a]" size={32} />
                                        </div>
                                        <h3 className="text-xl font-display font-semibold text-[#1a1209] mb-2">No temples saved yet</h3>
                                        <p className="text-[#6b5b45] text-sm mb-8 max-w-xs mx-auto">
                                            Explore our sacred collection and heart the ones you wish to visit or offer pooja in!
                                        </p>
                                        <Link href="/temples" className="btn-saffron px-8 py-3">
                                            Browse Temples
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {temples.map((temple) => (
                                            <div
                                                key={temple._id}
                                                className="group bg-white border border-[#f0dcc8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#ffbd6e] transition-all"
                                            >
                                                <div className="relative h-40">
                                                    {temple.images?.[0] ? (
                                                        <img
                                                            src={temple.images[0]}
                                                            alt={temple.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#fdf6ee] flex items-center justify-center">
                                                            <span className="text-4xl text-orange-200">🛕</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemove(temple._id)}
                                                        className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
                                                        title="Remove from saved"
                                                    >
                                                        <Heart size={18} fill="currentColor" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start gap-2 mb-1">
                                                        <h3 className="font-display font-bold text-[#1a1209] group-hover:text-[#ff7f0a] transition-colors truncate">
                                                            {temple.name}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                                                            ⭐ {temple.rating || 4.5}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-[#6b5b45] mb-4">
                                                        <MapPin size={12} className="text-[#ff7f0a]" />
                                                        {temple.city}, {temple.state}
                                                    </div>
                                                    <Link
                                                        href={`/temples/${temple._id}`}
                                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#fdf6ee] text-[#ff7f0a] text-xs font-bold rounded-xl border border-[#ffd9a8] hover:bg-orange-50 transition-colors"
                                                    >
                                                        Go to Temple <ChevronRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
