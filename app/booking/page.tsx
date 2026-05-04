'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { GlassCard } from '@/components/layout/GlassCard'
import { ButtonGlow } from '@/components/ui/ButtonGlow'
import { InputFloat, TextareaFloat } from '@/components/ui/InputFloat'
import { ConfettiLite } from '@/components/effects/ConfettiLite'
import { CountUp } from '@/components/effects/CountUp'
import {
  cn,
  haptic,
  formatRupiah,
  URGENCY_INFO,
  formatDate,
} from '@/lib/utils'
import { getCatalog, generateBookingId, saveBooking } from '@/lib/storage'
import { buildBookingMessage, getAdminWaLink } from '@/lib/whatsapp'
import type { Booking, CatalogItem, TaskType, UrgencyLevel } from '@/lib/types'
import {
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Calendar,
  FileText,
  Send,
  Copy,
  Search as SearchIcon,
} from 'lucide-react'

type Step = 1 | 2 | 3 | 4

export default function BookingPage() {
  const [step, setStep] = useState<Step>(1)
  const [items, setItems] = useState<CatalogItem[]>([])

  // Form state
  const [nama, setNama] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [taskId, setTaskId] = useState<string>('')
  const [qty, setQty] = useState(10)

  const [detail, setDetail] = useState('')
  const [deadline, setDeadline] = useState('')
  const [urgency, setUrgency] = useState<UrgencyLevel>('Normal')
  const [catatan, setCatatan] = useState('')

  // Submitted booking
  const [submitted, setSubmitted] = useState<Booking | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const cat = getCatalog().filter((i) => i.active)
    setItems(cat)
    if (cat.length && !taskId) setTaskId(cat[0]!.id)
  }, [taskId])

  const item = useMemo(() => items.find((i) => i.id === taskId), [items, taskId])
  const hargaBase = item ? (item.fixed ? item.basePrice : item.basePrice * qty) : 0
  const harga = Math.round(hargaBase * URGENCY_INFO[urgency].mult)

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!nama.trim() || nama.trim().length < 2) e.nama = 'Nama minimal 2 karakter'
    const wa = whatsapp.replace(/\D/g, '')
    if (wa.length < 10 || wa.length > 14) e.whatsapp = 'Nomor WA tidak valid'
    if (!taskId) e.taskId = 'Pilih jenis tugas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!detail.trim() || detail.trim().length < 10) {
      e.detail = 'Detail minimal 10 karakter'
    }
    if (!deadline) e.deadline = 'Pilih deadline'
    else if (new Date(deadline).getTime() < Date.now()) {
      e.deadline = 'Deadline harus di masa depan'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    haptic(10)
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((s) => Math.min(4, s + 1) as Step)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    haptic(6)
    setStep((s) => Math.max(1, s - 1) as Step)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = () => {
    if (!item) return
    haptic(20)
    const now = new Date().toISOString()
    const booking: Booking = {
      id: generateBookingId(),
      nama: nama.trim(),
      whatsapp: whatsapp.trim(),
      jenistugas: item.label as TaskType,
      detail: detail.trim() + (item.fixed ? '' : ` (${qty} ${item.unit})`),
      deadline: new Date(deadline).toISOString(),
      urgensi: urgency,
      harga,
      catatan: catatan.trim(),
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    }
    saveBooking(booking)
    setSubmitted(booking)
    setStep(4)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const waUrl = submitted ? getAdminWaLink(buildBookingMessage(submitted)) : '#'

  const copyId = async () => {
    if (!submitted) return
    try {
      await navigator.clipboard.writeText(submitted.id)
      setCopied(true)
      haptic(6)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  return (
    <>
      <Navbar />
      <ConfettiLite trigger={step === 4} />

      <div className="px-5 pt-24 pb-8">
        {step !== 4 && (
          <div className="mb-7">
            <h1 className="text-3xl font-extrabold leading-tight">
              <span className="gradient-text">Pesan Tugas</span>
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Isi 3 langkah singkat. Sekitar 90 detik selesai.
            </p>
          </div>
        )}

        {/* Progress orbs */}
        {step !== 4 && (
          <div className="relative mb-8">
            <div className="absolute top-5 left-[16%] right-[16%] h-1 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple to-cyan transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
            <div className="relative flex justify-between">
              {[1, 2, 3].map((s) => {
                const active = step >= s
                const labels = ['Identitas', 'Detail', 'Konfirmasi']
                return (
                  <div key={s} className="flex flex-col items-center gap-2 w-1/3">
                    <div
                      className={cn(
                        'relative w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all',
                        active
                          ? 'bg-gradient-to-br from-purple to-cyan text-white glow-purple'
                          : 'bg-white/5 text-white/40 border border-white/10'
                      )}
                    >
                      {step > s ? <Check size={18} /> : s}
                    </div>
                    <span
                      className={cn(
                        'text-[11px] font-semibold',
                        active ? 'text-white' : 'text-white/40'
                      )}
                    >
                      {labels[s - 1]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-up">
            <GlassCard variant="strong" className="space-y-4">
              <InputFloat
                label="Nama Lengkap"
                leftIcon={<User size={18} />}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                error={errors.nama}
              />
              <InputFloat
                label="Nomor WhatsApp"
                leftIcon={<Phone size={18} />}
                inputMode="numeric"
                placeholder="08xxxxxxxxxx"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/[^\d]/g, ''))}
                error={errors.whatsapp}
              />
            </GlassCard>

            <div>
              <label className="text-xs uppercase tracking-wider text-white/50 mb-2.5 block font-semibold px-1">
                Jenis Tugas
              </label>
              <div className="grid grid-cols-2 gap-3">
                {items.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => { haptic(6); setTaskId(i.id) }}
                    className={cn(
                      'relative h-24 rounded-2xl border text-left p-4 transition-all press',
                      taskId === i.id
                        ? 'glass-strong border-purple/50 glow-purple'
                        : 'glass border-white/10'
                    )}
                  >
                    {taskId === i.id && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                    <div className="font-bold text-white text-sm mb-1">{i.label}</div>
                    <div className="text-[11px] text-white/60 leading-snug">{i.desc}</div>
                    <div className="text-[10px] text-cyan font-semibold mt-1">
                      Mulai {formatRupiah(i.basePrice)}
                    </div>
                  </button>
                ))}
              </div>
              {errors.taskId && (
                <p className="mt-2 ml-1 text-xs text-red-400">{errors.taskId}</p>
              )}
            </div>

            {item && !item.fixed && (
              <GlassCard>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Jumlah {item.unit}
                  </span>
                  <span className="text-2xl font-extrabold gradient-text">{qty}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #7C3AED 0%, #06B6D4 ${qty}%, rgba(255,255,255,0.1) ${qty}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </GlassCard>
            )}

            <ButtonGlow size="lg" fullWidth onClick={next} rightIcon={<ArrowRight size={20} />}>
              Lanjut
            </ButtonGlow>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <GlassCard variant="strong" className="space-y-4">
              <TextareaFloat
                label="Detail Tugas"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                error={errors.detail}
              />
              <p className="text-[11px] text-white/40 -mt-2 px-1">
                Contoh: topik, format, jumlah halaman, sumber referensi, dll.
              </p>

              <div>
                <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block font-semibold flex items-center gap-2">
                  <Calendar size={12} /> Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={cn(
                    'w-full h-14 rounded-2xl glass border px-4 text-white outline-none transition-all',
                    errors.deadline ? 'border-red-500/60' : 'border-white/10 focus:border-purple/60 focus:glow-purple'
                  )}
                />
                {errors.deadline && (
                  <p className="mt-2 ml-1 text-xs text-red-400">{errors.deadline}</p>
                )}
              </div>

              <TextareaFloat
                label="Catatan tambahan (opsional)"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </GlassCard>

            <div>
              <label className="text-xs uppercase tracking-wider text-white/50 mb-2.5 block font-semibold px-1">
                Tingkat Urgensi
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(URGENCY_INFO) as UrgencyLevel[]).map((u) => {
                  const info = URGENCY_INFO[u]
                  const active = urgency === u
                  const colorClass =
                    info.color === 'cyan'   ? 'from-cyan to-blue-500 glow-cyan' :
                    info.color === 'purple' ? 'from-purple to-violet-400 glow-purple' :
                                              'from-pink to-rose-500 glow-pink'
                  return (
                    <button
                      key={u}
                      onClick={() => { haptic(10); setUrgency(u) }}
                      className={cn(
                        'relative h-24 rounded-2xl border transition-all press',
                        active
                          ? `bg-gradient-to-br ${colorClass} text-white border-transparent`
                          : 'glass text-white/70 border-white/10'
                      )}
                    >
                      <div className="text-base font-bold">{info.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{info.desc}</div>
                      <div className="text-[10px] font-semibold mt-1">×{info.mult}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ButtonGlow variant="secondary" size="lg" onClick={back} leftIcon={<ArrowLeft size={20} />}>
                Kembali
              </ButtonGlow>
              <ButtonGlow size="lg" onClick={next} rightIcon={<ArrowRight size={20} />}>
                Lanjut
              </ButtonGlow>
            </div>
          </div>
        )}

        {/* Step 3 — Summary */}
        {step === 3 && item && (
          <div className="space-y-4 animate-fade-up">
            <GlassCard variant="strong" className="space-y-4 inner-glow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Ringkasan Pesanan
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{item.label}</h3>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-white/50">Total</div>
                  <CountUp value={harga} className="text-3xl font-extrabold gradient-text block" />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
                <Row label="Nama" value={nama} />
                <Row label="WhatsApp" value={whatsapp} />
                <Row label="Jenis" value={item.label} />
                {!item.fixed && <Row label="Jumlah" value={`${qty} ${item.unit}`} />}
                <Row
                  label="Deadline"
                  value={deadline ? formatDate(new Date(deadline).toISOString()) : '-'}
                />
                <Row label="Urgensi" value={`${urgency} (×${URGENCY_INFO[urgency].mult})`} />
                {catatan && <Row label="Catatan" value={catatan} />}
                <Row label="Detail" value={detail} multiline />
              </div>

              <div className="rounded-2xl bg-purple/10 border border-purple/20 p-4 text-xs text-white/70 leading-relaxed">
                <Sparkles size={14} className="inline text-purple mr-1.5 -mt-0.5" />
                Setelah konfirmasi, kamu akan diarahkan ke WhatsApp admin untuk
                konfirmasi final & pembayaran.
              </div>
            </GlassCard>

            <div className="grid grid-cols-2 gap-3">
              <ButtonGlow variant="secondary" size="lg" onClick={back} leftIcon={<ArrowLeft size={20} />}>
                Kembali
              </ButtonGlow>
              <ButtonGlow size="lg" onClick={submit} shimmer rightIcon={<Send size={18} />}>
                Konfirmasi
              </ButtonGlow>
            </div>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && submitted && (
          <div className="animate-scale-in">
            <div className="text-center mb-6 mt-4">
              <div className="relative inline-flex w-24 h-24 rounded-full items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan glow-green mx-auto">
                <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-[pulse-ring_2s_ease-out_infinite]" />
                <Check size={48} className="text-white relative" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mt-5">
                Pesanan <span className="gradient-text">terkirim!</span>
              </h2>
              <p className="text-sm text-white/60 mt-2 max-w-xs mx-auto">
                Lanjutkan ke WhatsApp untuk konfirmasi dengan admin.
              </p>
            </div>

            <GlassCard variant="strong" glow="purple" className="text-center mb-4">
              <div className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-1">
                Nomor Booking
              </div>
              <div className="text-3xl font-extrabold font-mono text-white tracking-wide">
                {submitted.id}
              </div>
              <button
                onClick={copyId}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan press"
              >
                <Copy size={12} />
                {copied ? 'Tersalin!' : 'Salin nomor'}
              </button>
            </GlassCard>

            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block">
              <ButtonGlow
                variant="success"
                size="lg"
                fullWidth
                shimmer
                rightIcon={<ArrowRight size={20} />}
              >
                Lanjut ke WhatsApp
              </ButtonGlow>
            </a>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <Link href="/track">
                <ButtonGlow variant="secondary" size="md" fullWidth leftIcon={<SearchIcon size={16} />}>
                  Lacak Status
                </ButtonGlow>
              </Link>
              <Link href="/">
                <ButtonGlow variant="ghost" size="md" fullWidth>
                  Ke Beranda
                </ButtonGlow>
              </Link>
            </div>

            <p className="text-[11px] text-white/40 text-center mt-6 leading-relaxed">
              Simpan nomor booking untuk lacak status pesanan kapanpun.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #7C3AED;
          box-shadow: 0 0 16px rgba(124, 58, 237, 0.6);
          cursor: pointer;
        }
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #7C3AED;
          box-shadow: 0 0 16px rgba(124, 58, 237, 0.6);
          cursor: pointer;
        }
        input[type="datetime-local"] {
          color-scheme: dark;
        }
      `}</style>
    </>
  )
}

function Row({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={cn('flex gap-3', multiline ? 'flex-col' : 'items-baseline justify-between')}>
      <span className="text-xs uppercase tracking-wider text-white/50 font-semibold shrink-0">{label}</span>
      <span className={cn('text-white text-sm', multiline ? '' : 'text-right max-w-[60%]')}>
        {value}
      </span>
    </div>
  )
}
