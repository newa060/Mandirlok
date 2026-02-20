'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Shield, Loader2 } from 'lucide-react'

// ── Cart item (replace poojaId / templeId with real DB ids if needed) ──
const cartItem = {
  name: 'Rudrabhishek',
  temple: 'Kashi Vishwanath',
  date: '20 Feb 2026',
  qty: 1,
  price: 1100,
  emoji: '🪔',
  // Replace these with real MongoDB ObjectIds from your database
  poojaId: '6997d424b0b71df13de11a1c',
  templeId: '6997d424b0b71df13de11a14',
  bookingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  offerings: [
    { name: 'Flower Garland', price: 151 },
  ],
}

const total = cartItem.price + cartItem.offerings.reduce((s, o) => s + o.price, 0)

// ── Razorpay types ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: { name?: string; contact?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}
interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
interface RazorpayInstance {
  open(): void
}

// ── Load Razorpay SDK dynamically ─────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '', gotra: '', dob: '', phone: '',
    sankalp: '', whatsapp: '', address: '',
  })
  const [step, setStep] = useState<1 | 2>(1)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const isStep1Valid = form.name && form.phone && form.whatsapp

  // ── Razorpay payment flow ────────────────────────────────────────────────────
  const handlePay = async () => {
    setPayError('')
    setPaying(true)

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Could not load Razorpay SDK. Check your internet connection.')

      // 2. Create Razorpay order on the server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poojaId: cartItem.poojaId,
          chadhavaIds: [],            // add real chadhava ids if selected
        }),
      })
      const orderData = await orderRes.json()
      if (!orderData.success) throw new Error(orderData.message || 'Failed to create payment order')

      const { razorpayOrderId, amount, keyId } = orderData.data

      // 3. Open Razorpay checkout modal
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: amount * 100,      // paise
          currency: 'INR',
          name: 'MandirLok',
          description: `Booking: ${cartItem.name}`,
          order_id: razorpayOrderId,
          prefill: {
            name: form.name,
            contact: form.phone,
          },
          theme: { color: '#ff7f0a' },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
          handler: async (response: RazorpayPaymentResponse) => {
            try {
              // 4. Verify payment & save order to DB
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  poojaId: cartItem.poojaId,
                  templeId: cartItem.templeId,
                  bookingDate: cartItem.bookingDate,
                  chadhavaIds: [],
                  sankalpName: form.name,
                  gotra: form.gotra,
                  dob: form.dob,
                  phone: form.phone,
                  whatsapp: form.whatsapp,
                  sankalp: form.sankalp,
                  address: form.address,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyData.success) throw new Error(verifyData.message || 'Payment verification failed')

              // 5. Redirect to success page with real orderId
              router.push(`/booking-success?orderId=${verifyData.data.orderId}`)
              resolve()
            } catch (err) {
              reject(err)
            }
          },
        })
        rzp.open()
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      if (message !== 'Payment cancelled') setPayError(message)
    } finally {
      setPaying(false)
    }
  }

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
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1
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
                      <input name="name" value={form.name} onChange={handleChange}
                        placeholder="Enter your full name" className="input-divine" />
                    </div>

                    {/* Gotra */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">Gotra</label>
                      <input name="gotra" value={form.gotra} onChange={handleChange}
                        placeholder="e.g., Kashyap, Bharadwaj" className="input-divine" />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">Date of Birth</label>
                      <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-divine" />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5b45] text-sm">+91</span>
                        <input name="phone" value={form.phone} onChange={handleChange}
                          placeholder="10-digit mobile" className="input-divine pl-12" maxLength={10} />
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        WhatsApp Number * <span className="text-[#25D366]">(Video will be sent here)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5b45] text-sm">+91</span>
                        <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                          placeholder="WhatsApp number" className="input-divine pl-12" maxLength={10} />
                      </div>
                      <p className="text-[10px] text-[#25D366] mt-1">💬 Pooja video & updates will be sent to this WhatsApp</p>
                    </div>

                    {/* Sankalp */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Special Wish / Sankalp (Optional)
                      </label>
                      <textarea name="sankalp" value={form.sankalp} onChange={handleChange}
                        placeholder="Describe your wish, prayer, or purpose for this pooja…"
                        rows={3} className="input-divine resize-none" />
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#6b5b45] mb-1.5 uppercase tracking-wide">
                        Address (for prasad delivery – optional)
                      </label>
                      <input name="address" value={form.address} onChange={handleChange}
                        placeholder="Full address for prasad delivery" className="input-divine" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Link href="/poojas" className="text-sm text-[#6b5b45] hover:text-[#ff7f0a]">← Back</Link>
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
                  <p className="text-xs text-[#6b5b45] mb-6">Complete your booking with secure online payment via Razorpay</p>

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

                  {/* Error */}
                  {payError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
                      ⚠️ {payError}
                    </div>
                  )}

                  {/* Payment Methods info (visual only — Razorpay handles the actual selection) */}
                  <div className="bg-[#f9f9f9] border border-[#f0dcc8] rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-sm text-[#1a1209] mb-2">Payment via Razorpay 🔒</h4>
                    <p className="text-xs text-[#6b5b45]">
                      You can pay using UPI, Debit/Credit Card, or Net Banking through the secure Razorpay checkout.
                    </p>
                    <div className="flex gap-3 mt-3 text-xl">
                      <span title="UPI">📱</span>
                      <span title="Card">💳</span>
                      <span title="Net Banking">🏦</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button onClick={() => setStep(1)} className="text-sm text-[#6b5b45] hover:text-[#ff7f0a]">← Back</button>
                    <button
                      onClick={handlePay}
                      disabled={paying}
                      className="btn-saffron text-sm px-8 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {paying ? (
                        <><Loader2 size={14} className="animate-spin" /> Processing…</>
                      ) : (
                        <>Pay ₹{total.toLocaleString()} →</>
                      )}
                    </button>
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
