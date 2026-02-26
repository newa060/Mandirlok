"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronRight, Shield, Loader2 } from "lucide-react";

// ── Razorpay types ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: any; // Simplified for this rewrite
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const poojaId = searchParams.get("poojaId");
  const templeId = searchParams.get("templeId");
  const dateStr = searchParams.get("date");
  const qtyStr = searchParams.get("qty");
  const offeringsStr = searchParams.get("offerings"); // comma-separated ids

  const qty = qtyStr ? parseInt(qtyStr, 10) : 1;
  const selectedOfferingIds = offeringsStr ? offeringsStr.split(",") : [];

  const [pooja, setPooja] = useState<any>(null);
  const [selectedOfferings, setSelectedOfferings] = useState<any[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState("");

  const [form, setForm] = useState({
    name: "",
    gotra: "",
    dob: "",
    phone: "",
    sankalp: "",
    whatsapp: "",
    address: "",
  });
  const [countryCode, setCountryCode] = useState("91");
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("91");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (!poojaId) {
      setConfigError("Invalid booking link (Missing Pooja ID).");
      setLoadingConfig(false);
      return;
    }

    fetch(`/api/poojas/${poojaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPooja(data.data.pooja);
          const allOfferings = data.data.chadhavaItems || [];
          setSelectedOfferings(allOfferings.filter((o: any) => selectedOfferingIds.includes(o._id)));
        } else {
          setConfigError("Pooja details could not be loaded.");
        }
      })
      .catch(() => setConfigError("Network error while loading pooja details."))
      .finally(() => setLoadingConfig(false));
  }, [poojaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isStep1Valid = form.name && form.phone && form.whatsapp;

  let totalObj = { base: 0, offerings: 0, sum: 0 };
  if (pooja) {
    totalObj.base = pooja.price * qty;
    totalObj.offerings = selectedOfferings.reduce((sum, o) => sum + o.price, 0);
    totalObj.sum = totalObj.base + totalObj.offerings;
  }

  const handlePay = async () => {
    setPayError("");
    setPaying(true);

    try {
      if (!dateStr || !templeId) {
        throw new Error("Missing date or temple information for booking.");
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load Razorpay SDK. Check your internet connection.");

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poojaId,
          qty,
          chadhavaIds: selectedOfferingIds,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message || "Failed to create payment order");

      const { razorpayOrderId, amount, keyId } = orderData.data;

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: amount * 100,
          currency: "INR",
          name: "MandirLok",
          description: `Booking: ${pooja.name}`,
          order_id: razorpayOrderId,
          prefill: {
            name: form.name,
            contact: form.phone,
          },
          theme: { color: "#ff7f0a" },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  poojaId,
                  templeId,
                  bookingDate: new Date(dateStr as string).toISOString(), // Parse standard YYYY-MM-DD
                  qty,
                  chadhavaIds: selectedOfferingIds,
                  sankalpName: form.name,
                  gotra: form.gotra,
                  dob: form.dob,
                  phone: `${countryCode}${form.phone}`,
                  whatsapp: `${sameAsPhone ? countryCode : whatsappCountryCode}${form.whatsapp}`,
                  sankalp: form.sankalp,
                  address: form.address,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyData.success) throw new Error(verifyData.message || "Payment verification failed");

              router.push(`/booking-success?orderId=${verifyData.data.orderId}`);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err.message !== "Payment cancelled") setPayError(err.message || "Something went wrong");
    } finally {
      setPaying(false);
    }
  };

  if (loadingConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={40} className="animate-spin text-[#ff7f0a] mb-4" />
        <p className="text-[#6b5b45]">Setting up your cart...</p>
      </div>
    );
  }

  if (configError || !pooja) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-red-600 mb-4">{configError || "Pooja not found."}</p>
        <Link href="/poojas" className="btn-saffron px-6 text-sm">
          Return to Poojas
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container-app py-8">
        <div className="flex items-center justify-center gap-0 mb-8 max-w-md mx-auto">
          {["Sankalp Details", "Payment"].map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1
                    ? "bg-green-500 text-white"
                    : step === i + 1
                      ? "bg-[#ff7f0a] text-white"
                      : "bg-[#f0dcc8] text-[#6b5b45]"
                    }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <p className={`text-xs mt-1 ${step === i + 1 ? "text-[#ff7f0a] font-semibold" : "text-[#6b5b45]"}`}>
                  {label}
                </p>
              </div>
              {i < 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > 1 ? "bg-green-400" : "bg-[#f0dcc8]"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
                <h2 className="heading-md text-[#1a1209] mb-1">Sankalp Details</h2>
                <p className="text-xs text-[#6b5b45] mb-6">
                  These details will be used for the personalized pooja sankalp. Please fill carefully.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                      Full Name (for Sankalp) *
                    </label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" className="input-divine" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">Gotra</label>
                    <input name="gotra" value={form.gotra} onChange={handleChange} placeholder="e.g., Kashyap, Bharadwaj" className="input-divine" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">Date of Birth</label>
                    <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-divine" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">Mobile Number *</label>
                    <div className="flex">
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value);
                          if (sameAsPhone) setWhatsappCountryCode(e.target.value);
                        }}
                        className="px-2 border border-r-0 border-[#f0dcc8] rounded-l-xl text-xs text-[#6b5b45] bg-[#fdf6ee] outline-none"
                      >
                        <option value="91">+91 (IN)</option>
                        <option value="977">+977 (NP)</option>
                      </select>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setForm(f => ({ ...f, phone: val, whatsapp: sameAsPhone ? val : f.whatsapp }));
                        }}
                        placeholder="10-digit mobile"
                        className="flex-1 border border-[#f0dcc8] rounded-r-xl px-3 py-2 text-sm outline-none focus:border-[#ff7f0a]"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                      WhatsApp Number * <span className="text-[#25D366]">(Video will be sent here)</span>
                    </label>
                    <div className="flex">
                      <select
                        value={sameAsPhone ? countryCode : whatsappCountryCode}
                        disabled={sameAsPhone}
                        onChange={(e) => setWhatsappCountryCode(e.target.value)}
                        className="px-2 border border-r-0 border-[#f0dcc8] rounded-l-xl text-xs text-[#6b5b45] bg-[#fdf6ee] outline-none disabled:opacity-70"
                      >
                        <option value="91">+91</option>
                        <option value="977">+977</option>
                      </select>
                      <input
                        name="whatsapp"
                        value={form.whatsapp}
                        disabled={sameAsPhone}
                        onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        placeholder="WhatsApp number"
                        className="flex-1 border border-[#f0dcc8] rounded-r-xl px-3 py-2 text-sm outline-none focus:border-[#ff7f0a] disabled:bg-[#fdf6ee]"
                        maxLength={10}
                      />
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) {
                            setForm(f => ({ ...f, whatsapp: f.phone }));
                            setWhatsappCountryCode(countryCode);
                          }
                        }}
                        className="accent-[#ff7f0a]"
                      />
                      <span className="text-[10px] text-[#6b5b45]">Same as mobile number</span>
                    </label>
                    <p className="text-[10px] text-[#25D366] mt-1">💬 Pooja video & updates will be sent to this WhatsApp</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">Special Wish / Sankalp (Optional)</label>
                    <textarea name="sankalp" value={form.sankalp} onChange={handleChange} placeholder="Describe your wish, prayer, or purpose for this pooja…" rows={3} className="input-divine resize-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">Address (for prasad delivery – optional)</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Full address for prasad delivery" className="input-divine" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {/* back logic */}
                  <button onClick={() => router.back()} className="text-sm text-[#6b5b45] hover:text-[#ff7f0a]">← Back</button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className={`btn-saffron text-sm px-8 ${!isStep1Valid ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Proceed to Payment →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
                <h2 className="heading-md text-[#1a1209] mb-2">Payment</h2>
                <p className="text-xs text-[#6b5b45] mb-6">Complete your booking with secure online payment via Razorpay</p>
                <div className="bg-[#fff8f0] border border-[#ffd9a8] rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-sm text-[#1a1209] mb-2">Your Sankalp Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6b5b45]">
                    <span>Name: <strong className="text-[#1a1209]">{form.name}</strong></span>
                    <span>Gotra: <strong className="text-[#1a1209]">{form.gotra || "—"}</strong></span>
                    <span>Mobile: <strong className="text-[#1a1209]">+{countryCode} {form.phone}</strong></span>
                    <span>WhatsApp: <strong className="text-[#1a1209]">+{sameAsPhone ? countryCode : whatsappCountryCode} {form.whatsapp}</strong></span>
                  </div>
                </div>
                {payError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
                    ⚠️ {payError}
                  </div>
                )}
                <div className="bg-[#f9f9f9] border border-[#f0dcc8] rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-sm text-[#1a1209] mb-2">Payment via Razorpay 🔒</h4>
                  <p className="text-xs text-[#6b5b45]">You can pay using UPI, Debit/Credit Card, or Net Banking through the secure Razorpay checkout.</p>
                  <div className="flex gap-3 mt-3 text-xl">
                    <span title="UPI">📱</span><span title="Card">💳</span><span title="Net Banking">🏦</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => setStep(1)} className="text-sm text-[#6b5b45] hover:text-[#ff7f0a]">← Back</button>
                  <button onClick={handlePay} disabled={paying} className="btn-saffron text-sm px-8 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {paying ? <><Loader2 size={14} className="animate-spin" /> Processing…</> : <>Pay ₹{totalObj.sum.toLocaleString()} →</>}
                  </button>
                </div>
                <p className="text-center text-xs text-[#6b5b45] mt-4 flex items-center justify-center gap-1">
                  <Shield size={12} className="text-green-500" /> 100% Secured by Razorpay Encryption
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white border border-[#f0dcc8] rounded-2xl p-5 shadow-card sticky top-24">
              <h3 className="font-display font-semibold text-[#1a1209] mb-4">Order Summary</h3>
              <div className="flex items-center gap-3 pb-4 border-b border-[#f0dcc8] mb-4">
                <div className="w-12 h-12 bg-[#fff8f0] rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  {pooja.images && pooja.images.length > 0 ? (
                    <img src={pooja.images[0]} alt={pooja.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1a1209] text-sm">{pooja.name}</p>
                  <p className="text-xs text-[#ff7f0a]">🛕 {pooja.templeId?.name}</p>
                  <p className="text-xs text-[#6b5b45]">📅 {dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                  <p className="text-xs text-[#6b5b45]">👥 {qty} Devotee{qty > 1 ? "s" : ""}</p>
                </div>
                <p className="font-bold text-[#ff7f0a]">₹{totalObj.base.toLocaleString()}</p>
              </div>
              {selectedOfferings.map((o) => (
                <div key={o._id} className="flex justify-between items-center text-xs text-[#6b5b45] mb-2">
                  <div className="flex items-center gap-2">
                    {o.image ? (
                      <img src={o.image} alt={o.name} className="w-4 h-4 rounded-sm object-cover" />
                    ) : (
                      <svg className="w-3 h-3 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {o.name}
                  </div>
                  <span>₹{o.price}</span>
                </div>
              ))}
              <div className="border-t border-[#f0dcc8] mt-3 pt-3">
                <div className="flex justify-between font-bold text-base text-[#1a1209]">
                  <span>Total Payable</span>
                  <span className="text-[#ff7f0a]">₹{totalObj.sum.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-[#6b5b45]">
                <p>📹 Video on WhatsApp after pooja</p>
                <p>🙏 Personalized sankalp by pandit</p>
                <p>↩️ 100% refund if cancelled 24hrs before</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fdf6ee]">
        <div className="bg-white border-b border-[#f0dcc8]">
          <div className="container-app py-3 flex items-center gap-2 text-xs text-[#6b5b45]">
            <Link href="/" className="hover:text-[#ff7f0a]">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#1a1209] font-medium">Booking Checkout</span>
          </div>
        </div>
        <Suspense fallback={
          <div className="flex justify-center items-center py-20 text-[#ff7f0a]">
            <Loader2 size={40} className="animate-spin" />
            <p className="ml-4 text-sm text-[#1a1209]">Loading...</p>
          </div>
        }>
          <CartContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}