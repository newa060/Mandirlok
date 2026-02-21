const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderChadhavaSchema = new Schema(
    {
        chadhavaId: { type: Schema.Types.ObjectId, ref: "Chadhava" },
        name: String,
        price: Number,
        emoji: String,
    },
    { _id: false }
);

const OrderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        poojaId: { type: Schema.Types.ObjectId, ref: "Pooja", required: true },
        templeId: { type: Schema.Types.ObjectId, ref: "Temple", required: true },
        panditId: { type: Schema.Types.ObjectId, ref: "Pandit", default: null },

        bookingDate: { type: Date, required: true },
        bookingId: { type: String, unique: true },

        sankalpName: { type: String, required: true },
        gotra: { type: String, default: "" },
        dob: { type: String, default: "" },
        phone: { type: String, required: true },
        whatsapp: { type: String, required: true },
        sankalp: { type: String, default: "" },
        address: { type: String, default: "" },
        qty: { type: Number, default: 1 },

        chadhavaItems: [OrderChadhavaSchema],

        poojaAmount: { type: Number, required: true },
        chadhavaAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        razorpayOrderId: { type: String, default: "" },
        razorpayPaymentId: { type: String, default: "" },
        razorpaySignature: { type: String, default: "" },

        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
            default: "pending",
        },

        videoUrl: { type: String, default: "" },
        videoSentAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

const testOrder = new Order({
    userId: new mongoose.Types.ObjectId(),
    poojaId: new mongoose.Types.ObjectId(),
    templeId: new mongoose.Types.ObjectId(),
    bookingDate: new Date('2026-02-21T00:00:00.000Z'),
    sankalpName: "Test",
    gotra: "",
    dob: "",
    phone: "1234567890",
    whatsapp: "1234567890",
    sankalp: "",
    address: "",
    qty: 1,
    chadhavaItems: [],
    poojaAmount: 0,
    chadhavaAmount: 0,
    totalAmount: 0,
    paymentStatus: "paid",
    razorpayOrderId: "1",
    razorpayPaymentId: "1",
    razorpaySignature: "1",
    orderStatus: "pending"
});

const error = testOrder.validateSync();
console.log(error ? error.errors : "Valid!");
