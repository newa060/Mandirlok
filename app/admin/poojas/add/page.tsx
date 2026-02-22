"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Info, Plus, X, Tag, IndianRupee, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { createPooja, getTemplesAdmin } from "@/lib/actions/admin";

export default function AddPoojaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [temples, setTemples] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        templeId: "",
        deity: "",
        emoji: "🪔",
        description: "",
        about: "",
        price: 0,
        duration: "45-60 Minutes",
        benefits: [] as string[],
        includes: [] as string[],
        tag: "",
        tagColor: "bg-orange-500",
        isActive: true,
        isFeatured: false,
        availableDays: "Every Day",
        images: [] as string[],
    });

    const [newBenefit, setNewBenefit] = useState("");
    const [newInclude, setNewInclude] = useState("");

    useEffect(() => {
        async function fetchTemples() {
            const data = await getTemplesAdmin();
            setTemples(data);
            if (data.length > 0) setFormData(prev => ({ ...prev, templeId: data[0]._id }));
        }
        fetchTemples();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "name") {
            setFormData((prev) => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
            }));
        }
    };

    const addArrayItem = (type: "benefits" | "includes") => {
        const val = type === "benefits" ? newBenefit : newInclude;
        if (val) {
            setFormData(prev => ({ ...prev, [type]: [...prev[type], val] }));
            if (type === "benefits") setNewBenefit(""); else setNewInclude("");
        }
    };

    const removeArrayItem = (type: "benefits" | "includes", item: string) => {
        setFormData(prev => ({ ...prev, [type]: prev[type].filter(i => i !== item) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.templeId) { setError("Please select a temple"); return; }
        setLoading(true);
        try {
            const res = await createPooja(formData);
            if (res.success) router.push("/admin/poojas");
            else setError(res.error || "Failed to create pooja");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/poojas" className="p-2 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-[#ff7f0a] transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">Add New Pooja</h2>
                    <p className="text-sm text-gray-500">Define a ritual, set pricing, and assign to a temple.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <Info size={16} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pooja Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Maha Shivratri Rudrabhishek" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#ff7f0a]/20 focus:border-[#ff7f0a] outline-none" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Temple Assignment</label>
                        <select name="templeId" value={formData.templeId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-white">
                            {temples.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deity</label>
                        <input required name="deity" value={formData.deity} onChange={handleChange} placeholder="e.g. Lord Shiva" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><IndianRupee size={12} /> Price (₹)</label>
                        <input type="number" required name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Clock size={12} /> Duration</label>
                        <input required name="duration" value={formData.duration} onChange={handleChange} placeholder="45-60 Minutes" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                    {/* Benefits */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Benefits</label>
                        <div className="flex gap-2">
                            <input value={newBenefit} onChange={e => setNewBenefit(e.target.value)} placeholder="Add a benefit..." className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm" />
                            <button type="button" onClick={() => addArrayItem("benefits")} className="bg-gray-100 p-2 rounded-xl hover:bg-[#ff7f0a] hover:text-white transition-all"><Plus size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.benefits.map(b => (
                                <span key={b} className="bg-orange-50 text-[#ff7f0a] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                    {b} <X size={12} className="cursor-pointer" onClick={() => removeArrayItem("benefits", b)} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/admin/poojas" className="px-8 py-3 rounded-xl border border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-colors">Cancel</Link>
                    <button type="submit" disabled={loading} className="px-10 py-3 rounded-xl bg-[#ff7f0a] text-white font-bold shadow-lg shadow-[#ff7f0a]/30 hover:-translate-y-0.5 transition-all">
                        {loading ? "Saving..." : "Create Pooja"}
                    </button>
                </div>
            </form>
        </div>
    );
}
