"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Database, Globe, Save } from "lucide-react";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "security", label: "Security", icon: <Shield size={18} /> },
        { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
        { id: "database", label: "System & DB", icon: <Database size={18} /> },
    ];

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-[#ff7f0a] rounded-xl">
                    <Settings size={22} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">Admin Settings</h2>
                    <p className="text-sm text-gray-500">Global configurations for Mandirlok platform.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Simple Side Tabs */}
                <div className="w-full md:w-64 space-y-1">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === t.id ? "bg-[#ff7f0a] text-white shadow-lg shadow-orange-100" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                                }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* Settings Form */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Name</label>
                                <input defaultValue="Mandirlok" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Support Email</label>
                                <input defaultValue="support@mandirlok.com" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Default Commission (%)</label>
                                <input type="number" defaultValue="20" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-500 italic">Manage your admin password and 2FA settings.</p>
                            <button className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all">Change Password</button>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                        <button
                            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000) }}
                            className="flex items-center gap-2 px-8 py-3 bg-[#ff7f0a] text-white rounded-xl font-bold shadow-lg shadow-orange-100 hover:-translate-y-0.5 transition-all"
                        >
                            {loading ? "Saving..." : <><Save size={18} /> Save Preferences</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
