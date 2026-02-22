"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, MapPin } from "lucide-react";
import Link from "next/link";
import { createPandit, getTemplesAdmin } from "@/lib/actions/admin";

export default function AddPanditPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [temples, setTemples] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        whatsapp: "",
        email: "",
        photo: "",
        assignedTemples: [] as string[],
        experienceYears: 0,
        languages: [] as string[],
        bio: "",
        commissionPercentage: 80,
    });

    useEffect(() => {
        async function fetch() {
            const data = await getTemplesAdmin();
            setTemples(data);
        }
        fetch();
    }, []);

    const toggleTemple = (id: string) => {
        setFormData(prev => ({
            ...prev,
            assignedTemples: prev.assignedTemples.includes(id)
                ? prev.assignedTemples.filter(i => i !== id)
                : [...prev.assignedTemples, id]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await createPandit(formData);
        setLoading(false);
        router.push("/admin/pandits");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/pandits" className="p-2 rounded-xl bg-white border border-gray-100 text-gray-500"><ChevronLeft size={20} /></Link>
                <h2 className="text-2xl font-display font-bold text-gray-900">Add New Pandit</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Pt. Ramesh Sharma" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                        <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
                        <input required value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Experience (Years)</label>
                        <input type="number" value={formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Commission (%)</label>
                        <input type="number" value={formData.commissionPercentage} onChange={e => setFormData({ ...formData, commissionPercentage: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assign Temples</label>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-100 rounded-xl">
                            {temples.map((t: any) => (
                                <label key={t._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <input type="checkbox" checked={formData.assignedTemples.includes(t._id)} onChange={() => toggleTemple(t._id)} className="w-4 h-4 text-[#ff7f0a] rounded" />
                                    <span className="text-sm text-gray-700">{t.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <button disabled={loading} className="w-full py-4 rounded-xl bg-[#ff7f0a] text-white font-bold shadow-lg shadow-[#ff7f0a]/30">
                    {loading ? "Registering..." : "Add Pandit"}
                </button>
            </form>
        </div>
    );
}
