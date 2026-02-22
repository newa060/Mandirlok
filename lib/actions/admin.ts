"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../db";
import Temple from "../../models/Temple";
import Pooja from "../../models/Pooja";
import Chadhava from "../../models/Chadhava";
import Pandit from "../../models/Pandit";
import Order from "../../models/Order";
import User from "../../models/User";

// =======================
// DASHBOARD STATS
// =======================
export async function getDashboardStats() {
    await connectDB();

    try {
        const totalOrders = await Order.countDocuments();

        // Revenue is calculated only for completed or paid orders
        const result = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

        const totalUsers = await User.countDocuments();
        const totalPandits = await Pandit.countDocuments({ isActive: true });

        return { totalOrders, totalRevenue, totalUsers, totalPandits, success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// =======================
// TEMPLE CRUD
// =======================
export async function getTemplesAdmin() {
    await connectDB();
    const temples = await Temple.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(temples));
}

export async function createTemple(data: any) {
    try {
        await connectDB();
        const temple = await Temple.create(data);
        revalidatePath("/admin/temples");
        return { success: true, temple: JSON.parse(JSON.stringify(temple)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateTemple(id: string, data: any) {
    try {
        await connectDB();
        const temple = await Temple.findByIdAndUpdate(id, data, { new: true });
        if (!temple) return { success: false, error: "Temple not found" };
        revalidatePath("/admin/temples");
        revalidatePath("/temples");
        revalidatePath(`/temples/${id}`);
        if (temple.slug) revalidatePath(`/temples/${temple.slug}`);
        return { success: true, temple: JSON.parse(JSON.stringify(temple)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTemple(id: string) {
    try {
        await connectDB();
        const temple = await Temple.findByIdAndDelete(id);
        revalidatePath("/admin/temples");
        revalidatePath("/temples");
        revalidatePath(`/temples/${id}`);
        if (temple && "slug" in temple && temple.slug) {
            revalidatePath(`/temples/${temple.slug}`);
        }
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getTempleById(id: string) {
    await connectDB();
    const temple = await Temple.findById(id).lean();
    return temple ? JSON.parse(JSON.stringify(temple)) : null;
}

// =======================
// POOJA CRUD
// =======================
export async function getPoojasAdmin() {
    await connectDB();
    const poojas = await Pooja.find().populate("templeId", "name").sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(poojas));
}

export async function createPooja(data: any) {
    try {
        await connectDB();
        const pooja = await Pooja.create(data);
        revalidatePath("/admin/poojas");
        return { success: true, pooja: JSON.parse(JSON.stringify(pooja)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePooja(id: string, data: any) {
    try {
        await connectDB();
        const pooja = await Pooja.findByIdAndUpdate(id, data, { new: true });
        revalidatePath("/admin/poojas");
        revalidatePath("/poojas");
        return { success: true, pooja: JSON.parse(JSON.stringify(pooja)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePooja(id: string) {
    try {
        await connectDB();
        await Pooja.findByIdAndDelete(id);
        revalidatePath("/admin/poojas");
        revalidatePath("/poojas");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getPoojaById(id: string) {
    await connectDB();
    const pooja = await Pooja.findById(id).lean();
    return pooja ? JSON.parse(JSON.stringify(pooja)) : null;
}

// =======================
// CHADHAVA CRUD
// =======================
export async function getChadhavaAdmin() {
    await connectDB();
    const chadhava = await Chadhava.find().populate("templeId", "name").sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(chadhava));
}

export async function createChadhava(data: any) {
    try {
        await connectDB();
        const chadhava = await Chadhava.create(data);
        revalidatePath("/admin/chadhava");
        return { success: true, chadhava: JSON.parse(JSON.stringify(chadhava)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateChadhava(id: string, data: any) {
    try {
        await connectDB();
        const chadhava = await Chadhava.findByIdAndUpdate(id, data, { new: true });
        revalidatePath("/admin/chadhava");
        return { success: true, chadhava: JSON.parse(JSON.stringify(chadhava)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteChadhava(id: string) {
    try {
        await connectDB();
        await Chadhava.findByIdAndDelete(id);
        revalidatePath("/admin/chadhava");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getChadhavaById(id: string) {
    await connectDB();
    const item = await Chadhava.findById(id).lean();
    return item ? JSON.parse(JSON.stringify(item)) : null;
}

// =======================
// PANDIT CRUD
// =======================
export async function getPanditsAdmin() {
    await connectDB();
    const pandits = await Pandit.find().populate("assignedTemples", "name").sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(pandits));
}

export async function createPandit(data: any) {
    try {
        await connectDB();
        const pandit = await Pandit.create(data);
        revalidatePath("/admin/pandits");
        return { success: true, pandit: JSON.parse(JSON.stringify(pandit)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePandit(id: string, data: any) {
    try {
        await connectDB();
        const pandit = await Pandit.findByIdAndUpdate(id, data, { new: true });
        revalidatePath("/admin/pandits");
        return { success: true, pandit: JSON.parse(JSON.stringify(pandit)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePandit(id: string) {
    try {
        await connectDB();
        await Pandit.findByIdAndDelete(id);
        revalidatePath("/admin/pandits");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getPanditById(id: string) {
    await connectDB();
    const pandit = await Pandit.findById(id).lean();
    return pandit ? JSON.parse(JSON.stringify(pandit)) : null;
}

// =======================
// ORDER MANAGEMENT
// =======================
export async function getOrdersAdmin() {
    await connectDB();
    const orders = await Order.find()
        .populate("userId", "name email phone")
        .populate("templeId", "name")
        .populate("poojaId", "name")
        .populate("panditId", "name")
        .sort({ createdAt: -1 })
        .lean();
    return JSON.parse(JSON.stringify(orders));
}

export async function getOrderById(id: string) {
    await connectDB();
    const order = await Order.findById(id)
        .populate("userId", "name email phone")
        .populate("templeId", "name")
        .populate("poojaId", "name")
        .populate("panditId", "name")
        .lean();
    return order ? JSON.parse(JSON.stringify(order)) : null;
}

export async function updateOrderStatus(id: string, status: string) {
    try {
        await connectDB();
        const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
        revalidatePath("/admin/orders");
        revalidatePath("/admin");
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function assignPanditToOrder(orderId: string, panditId: string) {
    try {
        await connectDB();
        const order = await Order.findByIdAndUpdate(
            orderId,
            { panditId, orderStatus: "confirmed" },
            { new: true }
        );
        revalidatePath("/admin/orders");
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateOrderVideo(orderId: string, videoUrl: string) {
    try {
        await connectDB();
        const order = await Order.findByIdAndUpdate(
            orderId,
            { videoUrl, videoSentAt: new Date(), orderStatus: "completed" },
            { new: true }
        );
        revalidatePath("/admin/orders");
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
