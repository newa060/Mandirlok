"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, Star, IndianRupee, MapPin, CheckCircle, Edit2, Trash2, Info, Search } from "lucide-react";
import { getPanditsAdmin, deletePandit } from "../../../lib/actions/admin";

export default function PanditsAdminPage() {
    const [pandits, setPandits] = useState<any[]>([]);
    const [filteredPandits, setFilteredPandits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetch() {
            const data = await getPanditsAdmin();
            setPandits(data);
            setFilteredPandits(data);
            setLoading(false);
        }
        fetch();
    }, []);

    useEffect(() => {
        const res = pandits.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search)
        );
        setFilteredPandits(res);
    }, [search, pandits]);

    const handleDelete = async (id: string) => {
        if (confirm("Remove this pandit profile?")) {
            const res = await deletePandit(id);
            if (res.success) setPandits(prev => prev.filter(p => p._id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">Pandit Management</h2>
                    <p className="text-sm text-gray-500">Manage pandit profiles, assignments, and earnings.</p>
                </div>
                <Link
                    href="/admin/pandits/add"
                    className="bg-[#ff7f0a] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-orange-100"
                >
                    <Plus size={18} /> Add Pandit
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#ff7f0a]/20"
                    />
                </div>
            </div>

            {loading ? <div className="text-center py-20 opacity-50">Loading pandits...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPandits.map((pandit) => (
                        <div key={pandit._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#ff7f0a] font-bold text-xl overflow-hidden border border-orange-100">
                                        {pandit.photo ? <img src={pandit.photo} className="w-full h-full object-cover" /> : pandit.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 flex items-center gap-1.5 focus:outline-none">
                                            {pandit.name}
                                            {pandit.isVerified && <CheckCircle size={14} className="text-blue-500" />}
                                        </h3>
                                        <p className="text-xs text-gray-500">{pandit.experienceYears} Years Exp.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${pandit.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                        {pandit.isActive ? "ACTIVE" : "OFFLINE"}
                                    </span>
                                    <button onClick={() => handleDelete(pandit._id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-50 text-sm">
                                <div className="flex items-center justify-between text-xs">
                                    <p className="text-gray-500">Commission</p>
                                    <p className="font-bold text-gray-900">{pandit.commissionPercentage || 80}%</p>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <p className="text-gray-500">Total Earnings</p>
                                    <p className="font-bold text-[#ff7f0a] flex items-center gap-0.5"><IndianRupee size={12} />{pandit.totalEarnings || 0}</p>
                                </div>
                                <div className="pt-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assigned Temples</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pandit.assignedTemples?.slice(0, 3).map((t: any) => (
                                            <span key={t._id} className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-lg text-[9px] border border-gray-100">
                                                {t.name}
                                            </span>
                                        ))}
                                        {pandit.assignedTemples?.length > 3 && <span className="text-[9px] text-gray-400">+{pandit.assignedTemples.length - 3} more</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2">
                                <Link href={`/admin/pandits/edit/${pandit._id}`} className="flex-1 text-center py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                    View & Edit
                                </Link>
                                <Link href={`/admin/pandits/edit/${pandit._id}`} className="flex-1 text-center py-2 rounded-xl bg-orange-50 text-[#ff7f0a] text-xs font-bold hover:bg-[#ff7f0a] hover:text-white transition-all">
                                    Settings
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && filteredPandits.length === 0 && <div className="text-center py-20 opacity-50 italic">No pandits found.</div>}
        </div>
    );
}
