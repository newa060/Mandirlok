"use client";

import { useState, useEffect } from "react";
import { Settings, Bell, Shield, Database, Globe, Save, Layout, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/actions/admin";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // Landing Page Slides State
    const [slides, setSlides] = useState<any[]>([]);
    const [dashboardSettings, setDashboardSettings] = useState({
        bannerUrl: "",
        welcomeMessage: "Welcome to your Divine Journey"
    });

    const tabs = [
        { id: "general", label: "General", icon: <Globe size={18} /> },
        { id: "landing", label: "Landing Page", icon: <Layout size={18} /> },
        { id: "user_dashboard", label: "User Dashboard", icon: <Layout size={18} /> },
        { id: "security", label: "Security", icon: <Shield size={18} /> },
        { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
        { id: "database", label: "System & DB", icon: <Database size={18} /> },
    ];

    useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const [slideRes, dashRes] = await Promise.all([
                getSettings("landing_page_slides"),
                getSettings("dashboard_settings")
            ]);
            
            if (slideRes && slideRes.value) setSlides(slideRes.value);
            if (dashRes && dashRes.value) setDashboardSettings(dashRes.value);
            
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const handleAddSlide = () => {
        setSlides([...slides, {
            src: "",
            title: "New Slide Title",
            subtitle: "New slide subtitle goes here.",
            cta: "Call to Action",
            ctaLink: "/poojas",
            secondary: "Secondary Action",
            secondaryLink: "/temples"
        }]);
    };

    const handleRemoveSlide = (index: number) => {
        setSlides(slides.filter((_, i) => i !== index));
    };

    const handleUpdateSlide = (index: number, field: string, value: string) => {
        const next = [...slides];
        next[index] = { ...next[index], [field]: value };
        setSlides(next);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (activeTab === "landing") {
                await updateSettings("landing_page_slides", slides, "Banner slides for the landing page");
            } else if (activeTab === "user_dashboard") {
                await updateSettings("dashboard_settings", dashboardSettings, "Banner and welcome info for user dashboard");
            }
            alert("Settings saved successfully!");
        } catch (err) {
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl space-y-6">
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
                {/* Side Tabs */}
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
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
                    {loading ? (
                        <div className="text-center py-20 opacity-50">Loading configurations...</div>
                    ) : (
                        <>
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

                            {activeTab === "landing" && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">Landing Page Hero Slides</h3>
                                            <p className="text-xs text-gray-500">Manage the images and text on your homepage banner.</p>
                                        </div>
                                        <button 
                                            onClick={handleAddSlide}
                                            className="p-2 bg-orange-50 text-[#ff7f0a] rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {slides.map((slide, index) => (
                                            <div key={index} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-4 relative group">
                                                <button 
                                                    onClick={() => handleRemoveSlide(index)}
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Image URL</label>
                                                        <div className="relative">
                                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                            <input 
                                                                value={slide.src} 
                                                                onChange={(e) => handleUpdateSlide(index, "src", e.target.value)}
                                                                placeholder="https://..." 
                                                                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Slide Title</label>
                                                        <input 
                                                            value={slide.title} 
                                                            onChange={(e) => handleUpdateSlide(index, "title", e.target.value)}
                                                            className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200" 
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subtitle Text</label>
                                                    <textarea 
                                                        value={slide.subtitle} 
                                                        onChange={(e) => handleUpdateSlide(index, "subtitle", e.target.value)}
                                                        rows={2} 
                                                        className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200" 
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Button</label>
                                                        <input 
                                                            value={slide.cta} 
                                                            onChange={(e) => handleUpdateSlide(index, "cta", e.target.value)}
                                                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600" 
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Link</label>
                                                        <input 
                                                            value={slide.ctaLink} 
                                                            onChange={(e) => handleUpdateSlide(index, "ctaLink", e.target.value)}
                                                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-400" 
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secondary Button</label>
                                                        <input 
                                                            value={slide.secondary} 
                                                            onChange={(e) => handleUpdateSlide(index, "secondary", e.target.value)}
                                                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600" 
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secondary Link</label>
                                                        <input 
                                                            value={slide.secondaryLink} 
                                                            onChange={(e) => handleUpdateSlide(index, "secondaryLink", e.target.value)}
                                                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-400" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {slides.length === 0 && (
                                            <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 flex flex-col items-center gap-2">
                                                <Layout size={32} />
                                                <p className="text-sm">No slides added. Home page will use default content.</p>
                                                <button onClick={handleAddSlide} className="text-[#ff7f0a] font-bold text-xs hover:underline">Add First Slide</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "user_dashboard" && (
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900">User Dashboard Visuals</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-400">Banner Image URL</label>
                                            <input 
                                                value={dashboardSettings.bannerUrl} 
                                                onChange={e => setDashboardSettings({...dashboardSettings, bannerUrl: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200" 
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-400">Welcome Message</label>
                                            <input 
                                                value={dashboardSettings.welcomeMessage} 
                                                onChange={e => setDashboardSettings({...dashboardSettings, welcomeMessage: e.target.value})}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200" 
                                            />
                                        </div>
                                        {dashboardSettings.bannerUrl && (
                                            <div className="mt-4 rounded-2xl overflow-hidden aspect-[4/1] border border-gray-100">
                                                <img src={dashboardSettings.bannerUrl} className="w-full h-full object-cover" alt="Banner Preview" />
                                            </div>
                                        )}
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
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-3 bg-[#ff7f0a] text-white rounded-xl font-bold shadow-lg shadow-orange-100 hover:-translate-y-0.5 transition-all text-sm font-display disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : <><Save size={18} /> Save Preferences</>}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
