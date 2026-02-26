"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MapPin,
    Star,
    Users,
    IndianRupee,
    ShoppingBag,
    BarChart3,
    Settings,
    LogOut,
    Flower,
    Menu,
    X,
    MessageCircle,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18} /> },
    { label: "Temples", href: "/admin/temples", icon: <MapPin size={18} /> },
    { label: "Poojas", href: "/admin/poojas", icon: <Star size={18} /> },
    { label: "Chadhava", href: "/admin/chadhava", icon: <Flower size={18} /> },
    { label: "Pandits", href: "/admin/pandits", icon: <Users size={18} /> },
    { label: "Payments", href: "/admin/payments", icon: <IndianRupee size={18} /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
    { label: "Reviews", href: "/admin/reviews", icon: <MessageCircle size={18} /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [sideOpen, setSideOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle & Top Bar */}
            <header className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSideOpen(!sideOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff7f0a] to-[#8b0000] flex items-center justify-center font-bold text-lg text-white">
                        म
                    </div>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {sideOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSideOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#1a0a00] text-white flex flex-col transition-transform duration-300 ${sideOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:static lg:flex`}
            >
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff7f0a] to-[#8b0000] flex items-center justify-center font-bold text-lg">
                        म
                    </div>
                    <div>
                        <span className="font-display font-bold text-sm">Mandirlok</span>
                        <span className="block text-[10px] text-[#ff9b30] tracking-widest uppercase">
                            Admin Panel
                        </span>
                    </div>
                    <button
                        onClick={() => setSideOpen(false)}
                        className="ml-auto lg:hidden text-[#b89b7a] hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setSideOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm transition-colors ${isActive
                                    ? "bg-[#ff7f0a] text-white font-medium"
                                    : "text-[#b89b7a] hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-white/10">
                    <button
                        onClick={async () => {
                            try {
                                await fetch("/api/auth/logout", { method: "POST" });
                                window.location.href = "/admin/login";
                            } catch {
                                window.location.href = "/admin/login";
                            }
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#b89b7a] hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
