'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Shield, Phone } from 'lucide-react'

const cartItem = {
  name: 'Rudrabhishek',
  temple: 'Kashi Vishwanath',
  date: '20 Feb 2026',
  qty: 1,
  price: 1100,
  emoji: '🪔',
  offerings: [
    { name: 'Flower Garland', price: 151 },
  ],
}

const total = cartItem.price + cartItem.offerings.reduce((s, o) => s + o.price, 0)

export default function CartPage() {
  const [form, setForm] = useState({
    name: '',
    gotra: '',
    dob: '',
    phone: '',
    sankalp: '',
    whatsapp: '',
    address: '',
    state: '',
  })
  const [step, setStep] = useState<1 | 2>(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const isStep1Valid = form.name && form.phone && form.whatsapp

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

        <div className="container-app py-8">
          {/* ── Progress Steps ── */}
          <div className="flex items-center justify-center gap-0 mb-8 max-w-md mx-auto">
            {['Sankalp Details', 'Payment'].map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > i + 1
                        ? 'bg-green-500 text-white'
                        : step === i + 1
                        ? 'bg-[#ff7f0a] text-white'
                        : 'bg-[#f0dcc8] text-[#6b5b45]'
                    }`}
                  >
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <p className={`text-xs mt-1 ${step === i + 1 ? 'text-[#ff7f0a] font-semibold' : 'text-[#6b5b45]'}`}>
                    {label}
                  </p>
                </div>
                {i < 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > 1 ? 'bg-green-400' : 'bg-[#f0dcc8]'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── LEFT: Form ── */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
                  <h2 className="heading-md text-[#1a1209] mb-1">Sankalp Details</h2>
                  <p className="text-xs text-[#6b5b45] mb-6">
                    These details will be used for the personalized pooja sankalp. Please fill carefully.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Full Name (for Sankalp) *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="input-divine"
                      />
                    </div>

                    {/* Gotra */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Gotra
                      </label>
                      <input
                        name="gotra"
                        value={form.gotra}
                        onChange={handleChange}
                        placeholder="e.g., Kashyap, Bharadwaj"
                        className="input-divine"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="input-divine"
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5b45] text-sm">+91</span>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile"
                          className="input-divine pl-12"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        WhatsApp Number * <span className="text-[#25D366]">(Video will be sent here)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5b45] text-sm">+91</span>
                        <input
                          name="whatsapp"
                          value={form.whatsapp}
                          onChange={handleChange}
                          placeholder="WhatsApp number"
                          className="input-divine pl-12"
                          maxLength={10}
                        />
                      </div>
                      <p className="text-[10px] text-[#25D366] mt-1">
                        💬 Pooja video & updates will be sent to this WhatsApp
                      </p>
                    </div>

                    {/* Sankalp */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Special Wish / Sankalp (Optional)
                      </label>
                      <textarea
                        name="sankalp"
                        value={form.sankalp}
                        onChange={handleChange}
                        placeholder="Describe your wish, prayer, or purpose for this pooja…"
                        rows={3}
                        className="input-divine resize-none"
                      />
                    </div>

                    {/* Address (for prasad) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Address (for prasad delivery – optional)
                      </label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Full address for prasad delivery"
                        className="input-divine"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Link href="/poojas/101" className="text-sm text-[#6b5b45] hover:text-[#ff7f0a]">
                      ← Back
                    </Link>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className={`btn-saffron text-sm px-8 ${!isStep1Valid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Proceed to Payment →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white border border-[#f0dcc8] rounded-2xl p-6 shadow-card">
                  <h2 className="heading-md text-[#1a1209] mb-2">Payment</h2>
                  <p className="text-xs text-[#6b5b45] mb-6">Complete your booking with secure online payment</p>

                  {/* Sankalp Summary */}
                  <div className="bg-[#fff8f0] border border-[#ffd9a8] rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-sm text-[#1a1209] mb-2">Your Sankalp Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#6b5b45]">
                      <span>Name: <strong className="text-[#1a1209]">{form.name}</strong></span>
                      <span>Gotra: <strong className="text-[#1a1209]">{form.gotra || '—'}</strong></span>
                      <span>Mobile: <strong className="text-[#1a1209]">+91 {form.phone}</strong></span>
                      <span>WhatsApp: <strong className="text-[#1a1209]">+91 {form.whatsapp}</strong></span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-sm text-[#1a1209]">Select Payment Method</h4>
                    {[
                      { id: 'upi',   label: 'UPI',         icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                      { id: 'card',  label: 'Debit/Credit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                      { id: 'net',   label: 'Net Banking',  icon: '🏦', desc: 'All major banks' },
                    ].map(opt => (
                      <label key={opt.id} className="flex items-center gap-3 p-3 border border-[#f0dcc8] rounded-xl cursor-pointer hover:border-[#ffbd6e] has-[:checked]:border-[#ff7f0a] has-[:checked]:bg-[#fff8f0]">
                        <input type="radio" name="payment" value={opt.id} className="accent-[#ff7f0a]" />
                        <span className="text-xl">{opt.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1209]">{opt.label}</p>
                          <p className="text-xs text-[#6b5b45]">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button onClick={() => setStep(1)} className="text-sm text-[#6b5b45] hover:text-[#ff7f0a]">
                      ← Back
                    </button>
                    <Link
                      href="/booking-success"
                      className="btn-saffron text-sm px-8"
                    >
                      Pay ₹{total.toLocaleString()} via Razorpay 🔒
                    </Link>
                  </div>

                  <p className="text-center text-xs text-[#6b5b45] mt-4 flex items-center justify-center gap-1">
                    <Shield size={12} className="text-green-500" />
                    100% Secured by Razorpay Encryption
                  </p>
                </div>
              )}
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div>
              <div className="bg-white border border-[#f0dcc8] rounded-2xl p-5 shadow-card sticky top-24">
                <h3 className="font-display font-semibold text-[#1a1209] mb-4">Order Summary</h3>

                {/* Item */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#f0dcc8] mb-4">
                  <div className="w-12 h-12 bg-[#fff8f0] rounded-xl flex items-center justify-center text-2xl">
                    {cartItem.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1a1209] text-sm">{cartItem.name}</p>
                    <p className="text-xs text-[#ff7f0a]">🛕 {cartItem.temple}</p>
                    <p className="text-xs text-[#6b5b45]">📅 {cartItem.date}</p>
                  </div>
                  <p className="font-bold text-[#ff7f0a]">₹{cartItem.price.toLocaleString()}</p>
                </div>

                {/* Offerings */}
                {cartItem.offerings.map(o => (
                  <div key={o.name} className="flex justify-between text-xs text-[#6b5b45] mb-2">
                    <span>🌸 {o.name}</span>
                    <span>₹{o.price}</span>
                  </div>
                ))}

                <div className="border-t border-[#f0dcc8] mt-3 pt-3">
                  <div className="flex justify-between font-bold text-base text-[#1a1209]">
                    <span>Total Payable</span>
                    <span className="text-[#ff7f0a]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 bg-[#f0fdf4] border border-green-200 rounded-xl p-3 text-xs text-green-700">
                  🎉 You save ₹{cartItem.price > 1000 ? (cartItem.price - Math.floor(cartItem.price * 0.73)) : 100} on this booking!
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
      </main>
      <Footer />
    </>
  )
}
