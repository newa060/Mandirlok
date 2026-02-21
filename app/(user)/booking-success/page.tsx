'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Download, Share2, Loader2 } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface OrderData {
  bookingId: string
  poojaId: { name: string; emoji: string }
  templeId: { name: string; location: string }
  bookingDate: string
  sankalpName: string
  totalAmount: number
  whatsapp: string
  qty: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ── Loading skeleton rows ─────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full" />
      ))}
    </div>
  )
}

// ── Inner component that reads search params ──────────────────────────────────
function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) {
      setError('No booking ID found.')
      setLoading(false)
      return
    }

    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.data)
        } else {
          setError(data.message || 'Could not load booking details.')
        }
      })
      .catch(() => setError('Failed to load booking details. Please try again.'))
      .finally(() => setLoading(false))
  }, [orderId])

  return (
    <div className="max-w-lg w-full">

      {/* ── Success Card ── */}
      <div className="bg-white border border-[#f0dcc8] rounded-3xl p-8 text-center shadow-temple mb-4">

        {/* Animated Checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        <div className="text-3xl mb-3">🙏</div>
        <h1 className="heading-md text-[#1a1209] mb-2">Booking Confirmed!</h1>
        <p className="text-[#6b5b45] text-sm mb-1">Your pooja has been booked successfully.</p>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-[#6b5b45] text-sm mb-6">
            <Loader2 size={16} className="animate-spin text-[#ff7f0a]" />
            Loading your booking details…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Booking ID */}
        {!loading && order && (
          <p className="text-[#6b5b45] text-sm mb-6">
            Booking ID:{' '}
            <strong className="text-[#ff7f0a]">{order.bookingId}</strong>
          </p>
        )}

        {/* Booking Summary */}
        <div className="bg-[#fff8f0] border border-[#ffd9a8] rounded-2xl p-5 text-left mb-6 space-y-2">
          {loading ? (
            <Skeleton />
          ) : order ? (
            <>
              {[
                { label: 'Pooja', value: `${order.poojaId?.emoji ?? ''} ${order.poojaId?.name ?? '—'}` },
                { label: 'Temple', value: `${order.templeId?.name ?? '—'}, ${order.templeId?.location ?? ''}` },
                { label: 'Date', value: formatDate(order.bookingDate) },
                { label: 'Devotees', value: String(order.qty || 1) },
                { label: 'Sankalp Name', value: order.sankalpName },
                { label: 'Amount Paid', value: `₹${order.totalAmount?.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#6b5b45]">{label}</span>
                  <span className="font-semibold text-[#1a1209]">{value}</span>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-center text-[#6b5b45]">Booking details unavailable.</p>
          )}
        </div>

        {/* WhatsApp Notice */}
        {order && (
          <div className="bg-[#f0fdf4] border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-700">
            <p className="font-semibold mb-1">📱 WhatsApp Confirmation Sent!</p>
            <p className="text-xs leading-relaxed">
              A confirmation has been sent to your WhatsApp (+91 {order.whatsapp}).
              You will receive another message when the pandit is assigned and when the pooja is completed with the video.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="btn-saffron text-sm text-center">
            View My Bookings →
          </Link>
          <div className="flex gap-3">
            <button className="flex-1 btn-outline-saffron text-sm flex items-center justify-center gap-2">
              <Download size={15} /> Download Receipt
            </button>
            <button className="flex-1 btn-outline-saffron text-sm flex items-center justify-center gap-2">
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* ── Next Steps ── */}
      <div className="bg-white border border-[#f0dcc8] rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-semibold text-[#1a1209] mb-3 text-sm">What Happens Next?</h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Pandit is assigned within 2 hours' },
            { step: '2', text: 'You get pandit details on WhatsApp' },
            { step: '3', text: 'Pooja performed on your chosen date' },
            { step: '4', text: 'Pooja video sent to your WhatsApp' },
          ].map(s => (
            <div key={s.step} className="flex items-center gap-3 text-xs text-[#6b5b45]">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-[#fff8f0] border border-[#ffd9a8] text-[#ff7f0a]">
                {s.step}
              </div>
              {s.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Continue ── */}
      <div className="text-center mt-5">
        <Link href="/temples" className="text-sm text-[#ff7f0a] hover:underline">
          ← Book Another Pooja
        </Link>
      </div>
    </div>
  )
}

// ── Page export — wraps content in Suspense for useSearchParams ───────────────
export default function BookingSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fdf6ee] flex items-center justify-center px-4 py-16">
        <Suspense
          fallback={
            <div className="flex items-center gap-2 text-[#6b5b45]">
              <Loader2 size={20} className="animate-spin text-[#ff7f0a]" />
              Loading your booking…
            </div>
          }
        >
          <BookingSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
