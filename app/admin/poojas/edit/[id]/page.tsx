"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Info, Plus, X, IndianRupee, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { getPoojaById, updatePooja, getTemplesAdmin } from "../../../../../lib/actions/admin";

export default function EditPoojaPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    const [newImageUrl, setNewImageUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [p, t] = await Promise.all([getPoojaById(id), getTemplesAdmin()]);
                setTemples(t);
                if (p) {
                    const { _id, createdAt, updatedAt, __v, ...cleanData } = p;
                    setFormData({
                        ...formData,
                        ...cleanData,
                        benefits: cleanData.benefits || [],
                        includes: cleanData.includes || [],
                        images: cleanData.images || []
                    });
                } else {
                    setError("Pooja not found");
                }
            } catch (err) {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));

        if (name === "name") {
            setFormData((prev) => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
            }));
        }
    };

    const addArrayItem = (type: "benefits" | "includes" | "images") => {
        const val = type === "benefits" ? newBenefit : type === "includes" ? newInclude : newImageUrl;
        if (val && !formData[type].includes(val)) {
            setFormData(prev => ({ ...prev, [type]: [...prev[type], val] }));
            if (type === "benefits") setNewBenefit("");
            else if (type === "includes") setNewInclude("");
            else setNewImageUrl("");
        }
    };

    const removeArrayItem = (type: "benefits" | "includes" | "images", item: string) => {
        setFormData(prev => ({ ...prev, [type]: prev[type].filter(i => i !== item) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            // Include any pending items
            let finalData = { ...formData };
            if (newBenefit && !finalData.benefits.includes(newBenefit)) finalData.benefits.push(newBenefit);
            if (newInclude && !finalData.includes.includes(newInclude)) finalData.includes.push(newInclude);
            if (newImageUrl && !finalData.images.includes(newImageUrl)) finalData.images.push(newImageUrl);

            const res = await updatePooja(id, finalData);
            if (res.success) {
                router.push("/admin/poojas");
            } else {
                setError(res.error || "Failed to update pooja");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Loading pooja data...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/poojas" className="p-2 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-[#ff7f0a] transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">Edit Pooja</h2>
                    <p className="text-sm text-gray-500">Update ritual for {formData.name}</p>
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
                        <label className="text-xs font-bold text-gray-500 uppercase">Pooja Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Temple Assignment</label>
                        <select name="templeId" value={formData.templeId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-white">
                            {temples.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Deity</label>
                        <input required name="deity" value={formData.deity} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><IndianRupee size={12} /> Price (₹)</label>
                        <input type="number" required name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Clock size={12} /> Duration</label>
                        <input required name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" />
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase">Benefits</label>
                        <div className="flex gap-2">
                            <input value={newBenefit} onChange={e => setNewBenefit(e.target.value)} placeholder="Add a benefit..." className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm" />
                            <button type="button" onClick={() => addArrayItem("benefits")} className="bg-gray-100 p-2 rounded-xl"><Plus size={20} /></button>
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
                        <label className="text-xs font-bold text-gray-500 uppercase">Short Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/admin/poojas" className="px-8 py-3 rounded-xl border border-gray-200 text-gray-500 font-semibold">Cancel</Link>
                    <button type="submit" disabled={saving} className="px-10 py-3 rounded-xl bg-[#ff7f0a] text-white font-bold shadow-lg shadow-[#ff7f0a]/30 hover:-translate-y-0.5 transition-all">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
