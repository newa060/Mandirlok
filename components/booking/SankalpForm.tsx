'use client'

import { useState, type FormEvent } from 'react'
import { isValidMobile } from '@/lib/utils'

export interface SankalpDetails {
  name: string
  gotra: string
  dob: string
  phone: string
  whatsapp: string
  sameAsPhone: boolean
  sankalp: string
  address: string
  city: string
  pincode: string
}

interface SankalpFormProps {
  onSubmit: (data: SankalpDetails) => void
  submitLabel?: string
}

const INITIAL: SankalpDetails = {
  name: '', gotra: '', dob: '', phone: '', whatsapp: '',
  sameAsPhone: true, sankalp: '', address: '', city: '', pincode: '',
}

export default function SankalpForm({ onSubmit, submitLabel = 'Continue to Payment' }: SankalpFormProps) {
  const [form, setForm] = useState<SankalpDetails>(INITIAL)
  const [countryCode, setCountryCode] = useState('91')
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('91')
  const [errors, setErrors] = useState<Partial<SankalpDetails>>({})

  const set = (key: keyof SankalpDetails, value: string | boolean) =>
    setForm(f => {
      const next = { ...f, [key]: value }
      if (key === 'phone' && next.sameAsPhone) next.whatsapp = value as string
      if (key === 'sameAsPhone' && value === true) next.whatsapp = next.phone
      return next
    })

  const validate = (): boolean => {
    const e: Partial<SankalpDetails> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!isValidMobile(form.phone)) e.phone = 'Enter a valid 10-digit mobile'
    if (!form.sameAsPhone && !isValidMobile(form.whatsapp)) e.whatsapp = 'Enter a valid WhatsApp number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...form,
        phone: `${countryCode}${form.phone}`,
        whatsapp: `${form.sameAsPhone ? countryCode : whatsappCountryCode}${form.whatsapp}`
      })
    }
  }

  const field = (key: keyof SankalpDetails, label: string, extra?: React.InputHTMLAttributes<HTMLInputElement>, required = false) => (
    <div>
      <label className="block text-[10px] font-bold text-[#6b5b45] uppercase tracking-widest mb-1.5">
        {label} {required && <span className="text-[#ff7f0a]">*</span>}
      </label>
      <input
        name={key}
        value={form[key] as string}
        onChange={e => set(key, e.target.value)}
        {...extra}
        className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all bg-white
          ${errors[key]
            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
            : 'border-[#f0dcc8] focus:border-[#ff7f0a] focus:ring-2 focus:ring-[#ff7f0a]/10'}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── Section: Devotee Info ── */}
      <div>
        <h4 className="font-display font-semibold text-[#1a1209] mb-3 flex items-center gap-2 text-sm">
          <span className="w-5 h-5 rounded-full bg-[#ff7f0a] text-white text-[10px] flex items-center justify-center font-bold">1</span>
          Devotee Details (for Sankalp)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('name', 'Full Name', { placeholder: 'As to be chanted in sankalp' }, true)}
          {field('gotra', 'Gotra', { placeholder: 'e.g., Kashyap, Bharadwaj (optional)' })}
          {field('dob', 'Date of Birth', { type: 'date' })}
        </div>
      </div>

      {/* ── Section: Contact ── */}
      <div>
        <h4 className="font-display font-semibold text-[#1a1209] mb-3 flex items-center gap-2 text-sm">
          <span className="w-5 h-5 rounded-full bg-[#ff7f0a] text-white text-[10px] flex items-center justify-center font-bold">2</span>
          Contact Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#6b5b45] uppercase tracking-widest mb-1.5">
              Mobile Number <span className="text-[#ff7f0a]">*</span>
            </label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={e => {
                  setCountryCode(e.target.value)
                  if (form.sameAsPhone) setWhatsappCountryCode(e.target.value)
                }}
                className="px-2 border border-r-0 border-[#f0dcc8] rounded-l-xl text-xs text-[#6b5b45] bg-[#fdf6ee] outline-none"
              >
                <option value="91">+91 (IN)</option>
                <option value="977">+977 (NP)</option>
              </select>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                className={`flex-1 border rounded-r-xl px-3 py-2.5 text-sm outline-none transition-all bg-white
                  ${errors.phone ? 'border-red-400' : 'border-[#f0dcc8] focus:border-[#ff7f0a] focus:ring-2 focus:ring-[#ff7f0a]/10'}`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#6b5b45] uppercase tracking-widest mb-1.5">
              WhatsApp Number <span className="text-[#25D366] font-normal normal-case">(video sent here)</span> <span className="text-[#ff7f0a]">*</span>
            </label>
            <div className="flex">
              <select
                value={form.sameAsPhone ? countryCode : whatsappCountryCode}
                disabled={form.sameAsPhone}
                onChange={e => setWhatsappCountryCode(e.target.value)}
                className="px-2 border border-r-0 border-[#f0dcc8] rounded-l-xl text-xs text-[#6b5b45] bg-[#fdf6ee] outline-none disabled:opacity-70"
              >
                <option value="91">+91</option>
                <option value="977">+977</option>
              </select>
              <input
                type="tel"
                value={form.whatsapp}
                disabled={form.sameAsPhone}
                onChange={e => set('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="WhatsApp number"
                className="flex-1 border border-[#f0dcc8] rounded-r-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-[#ff7f0a] focus:ring-2 focus:ring-[#ff7f0a]/10 disabled:bg-[#fdf6ee] disabled:text-[#6b5b45] transition-all"
              />
            </div>
            <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sameAsPhone}
                onChange={e => set('sameAsPhone', e.target.checked)}
                className="accent-[#ff7f0a] w-3.5 h-3.5"
              />
              <span className="text-xs text-[#6b5b45]">Same as mobile number</span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Section: Sankalp ── */}
      <div>
        <h4 className="font-display font-semibold text-[#1a1209] mb-3 flex items-center gap-2 text-sm">
          <span className="w-5 h-5 rounded-full bg-[#ff7f0a] text-white text-[10px] flex items-center justify-center font-bold">3</span>
          Your Prayer / Sankalp
        </h4>
        <div>
          <label className="block text-[10px] font-bold text-[#6b5b45] uppercase tracking-widest mb-1.5">
            Special Wish or Purpose <span className="text-[#b89b7a] font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={form.sankalp}
            onChange={e => set('sankalp', e.target.value)}
            placeholder="Describe your wish, prayer, or reason for this pooja. The pandit will incorporate it in the sankalp…"
            rows={3}
            className="w-full border border-[#f0dcc8] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#ff7f0a] focus:ring-2 focus:ring-[#ff7f0a]/10 resize-none bg-white transition-all"
          />
        </div>
      </div>

      {/* ── Section: Prasad Address ── */}
      <div>
        <h4 className="font-display font-semibold text-[#1a1209] mb-1 flex items-center gap-2 text-sm">
          <span className="w-5 h-5 rounded-full bg-[#ff7f0a] text-white text-[10px] flex items-center justify-center font-bold">4</span>
          Prasad Delivery Address
          <span className="text-[#b89b7a] text-xs font-normal">(Optional)</span>
        </h4>
        <p className="text-xs text-[#6b5b45] mb-3">Fill this if you'd like temple prasad shipped to your home</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-3">
            {field('address', 'Full Address', { placeholder: 'House/Flat number, Street, Area' })}
          </div>
          {field('city', 'City', { placeholder: 'City' })}
          {field('pincode', 'PIN Code', { placeholder: '6-digit PIN', maxLength: 6 })}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#ff7f0a] to-[#ff9b30] text-white font-semibold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,127,10,0.3)] hover:shadow-[0_6px_25px_rgba(255,127,10,0.45)] hover:-translate-y-0.5 transition-all text-base"
      >
        {submitLabel} →
      </button>
    </form>
  )
}