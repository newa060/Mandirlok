"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Mail, Phone, MapPin, Hash, Loader2 } from "lucide-react";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const resData = await res.json();

                if (resData.success && resData.data) {
                    setProfile(resData.data);
                } else {
                    setError("Session expired. Please log in again.");
                }
            } catch (err) {
                setError("Failed to fetch profile details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
    };

    return (
        <>
            <Navbar />
            <main className="pt-20 min-h-screen bg-[#fdf6ee]">
                <div className="container-app py-8">
                    <div className="grid lg:grid-cols-4 gap-8">

                        {/* ── Sidebar ── */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#f0dcc8] rounded-2xl p-5 shadow-card">
                                <div className="text-center mb-5 pb-5 border-b border-[#f0dcc8]">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff7f0a] to-[#8b0000] text-white font-display font-bold text-2xl flex items-center justify-center mx-auto mb-3">
                                        {profile?.name ? profile.name.charAt(0).toUpperCase() : "🙏"}
                                    </div>
                                    <h2 className="font-display font-semibold text-[#1a1209]">
                                        {loading ? "Loading..." : profile?.name || "Devotee"}
                                    </h2>
                                    <p className="text-xs text-[#6b5b45]">{profile?.email || ""}</p>
                                </div>

                                <nav className="space-y-1">
                                    {[
                                        { label: "My Bookings", href: "/dashboard" },
                                        { label: "Profile", href: "/dashboard/profile", active: true },
                                        { label: "Saved Temples", href: "/dashboard/saved" },
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
                                        onClick={handleLogout}
                                        className="flex w-full text-left items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#6b5b45] hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* ── Main Content ── */}
                        <div className="lg:col-span-3">
                            <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 md:p-8 shadow-card">
                                <h1 className="heading-md text-[#1a1209] mb-6 flex items-center gap-2">
                                    <User className="text-[#ff7f0a]" /> My Profile
                                </h1>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 size={32} className="animate-spin text-[#ff7f0a] mb-3" />
                                        <p className="text-sm text-[#6b5b45]">Loading profile details...</p>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm text-center">
                                        {error}
                                    </div>
                                ) : (
                                    <div className="space-y-6 max-w-xl">
                                        <div className="grid sm:grid-cols-2 gap-6">

                                            {/* Name */}
                                            <div className="bg-[#fcf8f4] border border-[#f0dcc8] p-4 rounded-xl">
                                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6b5b45] mb-1">
                                                    <User size={14} /> Full Name
                                                </label>
                                                <p className="text-base font-medium text-[#1a1209]">{profile?.name || "Not provided"}</p>
                                            </div>

                                            {/* Email */}
                                            <div className="bg-[#fcf8f4] border border-[#f0dcc8] p-4 rounded-xl">
                                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6b5b45] mb-1">
                                                    <Mail size={14} /> Email Address
                                                </label>
                                                <p className="text-base font-medium text-[#1a1209]">{profile?.email || "Not provided"}</p>
                                            </div>

                                            {/* Phone */}
                                            <div className="bg-[#fcf8f4] border border-[#f0dcc8] p-4 rounded-xl">
                                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6b5b45] mb-1">
                                                    <Phone size={14} /> Phone Number
                                                </label>
                                                <p className="text-base font-medium text-[#1a1209]">{profile?.phone || "Not provided"}</p>
                                            </div>

                                            {/* ID */}
                                            <div className="bg-[#fcf8f4] border border-[#f0dcc8] p-4 rounded-xl">
                                                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6b5b45] mb-1">
                                                    <Hash size={14} /> Account ID
                                                </label>
                                                <p className="text-xs font-mono text-[#1a1209] break-all">{profile?._id}</p>
                                            </div>

                                        </div>

                                        {/* Address spanning full width */}
                                        <div className="bg-[#fcf8f4] border border-[#f0dcc8] p-4 rounded-xl">
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6b5b45] mb-1">
                                                <MapPin size={14} /> Default Address
                                            </label>
                                            <p className="text-base font-medium text-[#1a1209]">{profile?.address || "No default address provided"}</p>
                                        </div>

                                        <div className="pt-6 border-t border-[#f0dcc8]">
                                            <p className="text-xs text-[#6b5b45] mb-4">
                                                To update your profile information, please contact our support team.
                                            </p>
                                            <button className="btn-saffron text-sm px-6">
                                                Contact Support
                                            </button>
                                        </div>
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
