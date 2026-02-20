'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Download, Share2 } from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fdf6ee] flex items-center justify-center px-4 py-16">
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
            <p className="text-[#6b5b45] text-sm mb-6">
              Booking ID: <strong className="text-[#ff7f0a]">BK-1045</strong>
            </p>

            {/* Booking Summary */}
            <div className="bg-[#fff8f0] border border-[#ffd9a8] rounded-2xl p-5 text-left mb-6 space-y-2">
              {[
                { label: 'Pooja',          value: 'Rudrabhishek'             },
                { label: 'Temple',         value: 'Kashi Vishwanath, Varanasi' },
                { label: 'Date',           value: '20 February 2026'         },
                { label: 'Time',           value: '7:00 AM'                  },
                { label: 'Sankalp Name',   value: 'Priya Sharma'             },
                { label: 'Amount Paid',    value: '₹1,251'                   },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#6b5b45]">{label}</span>
                  <span className="font-semibold text-[#1a1209]">{value}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp Notice */}
            <div className="bg-[#f0fdf4] border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-700">
              <p className="font-semibold mb-1">📱 WhatsApp Confirmation Sent!</p>
              <p className="text-xs leading-relaxed">
                A confirmation has been sent to your WhatsApp (+91 98765 43210).
                You will receive another message when the pandit is assigned and when the pooja is completed with the video.
              </p>
            </div>

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
                { step: '1', text: 'Pandit is assigned within 2 hours',       done: false },
                { step: '2', text: 'You get pandit details on WhatsApp',       done: false },
                { step: '3', text: 'Pooja performed on your chosen date',      done: false },
                { step: '4', text: 'Pooja video sent to your WhatsApp',        done: false },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3 text-xs text-[#6b5b45]">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    s.done ? 'bg-green-500 text-white' : 'bg-[#fff8f0] border border-[#ffd9a8] text-[#ff7f0a]'
                  }`}>
                    {s.done ? '✓' : s.step}
                  </div>
                  {s.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Continue Shopping ── */}
          <div className="text-center mt-5">
            <Link href="/temples" className="text-sm text-[#ff7f0a] hover:underline">
              ← Book Another Pooja
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
