'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { GlassCard } from '@/components/layout/GlassCard'
import { ButtonGlow } from '@/components/ui/ButtonGlow'
import { InputFloat } from '@/components/ui/InputFloat'
import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { ProgressOrb } from '@/components/ui/ProgressOrb'
import { CountUp } from '@/components/effects/CountUp'
import { getBookingById } from '@/lib/storage'
import { ADMIN_WA, getWaLink } from '@/lib/whatsapp'
import {
  cn,
  haptic,
  formatDate,
  timeAgo,
  URGENCY_INFO,
} from '@/lib/utils'
import type { Booking } from '@/lib/types'
import {
  Search as SearchIcon,
  Hash,
  AlertCircle,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'

export default function TrackPage() {
  const [code, setCode] = useState('')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const search = () => {
    if (!code.trim()) return
    haptic(10)
    setLoading(true)
    setSearched(false)

    // Simulate small delay for UX
    setTimeout(() => {
      const b = getBookingById(code.trim().toUpperCase())
      setBooking(b)
      setSearched(true)
      setLoading(false)
    }, 400)
  }

  const stepFromStatus = (s: Booking['status']): number => {
    if (s === 'Cancelled') return -1
    if (s === 'Pending')   return 0
    if (s === 'Confirmed') return 1
    return 2 // Completed
  }

  const progressPct = (s: Booking['status']) => {
    if (s === 'Cancelled') return 100
    if (s === 'Pending')   return 33
    if (s === 'Confirmed') return 66
    return 100
  }

  return (
    <>
      <Navbar />
      <div className="px-5 pt-24 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold leading-tight">
            <span className="gradient-text">Lacak Pesanan</span>
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Masukkan nomor booking untuk cek status real-time.
          </p>
        </div>

        <GlassCard variant="strong" className="mb-5">
          <InputFloat
            label="Nomor Booking"
            leftIcon={<Hash size={18} />}
            placeholder="BOOK-2026-001"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            autoCapitalize="characters"
          />
          <ButtonGlow
            size="lg"
            fullWidth
            onClick={search}
            disabled={loading || !code.trim()}
            shimmer={!loading}
            leftIcon={<SearchIcon size={18} />}
            className="mt-4"
          >
            {loading ? 'Mencari...' : 'Cek Status'}
          </ButtonGlow>
        </GlassCard>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            <div className="h-32 rounded-3xl glass shimmer" />
            <div className="h-48 rounded-3xl glass shimmer" />
          </div>
        )}

        {/* Not found */}
        {searched && !loading && !booking && (
          <GlassCard glow="red" className="text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Pesanan tidak ditemukan</h3>
            <p className="text-sm text-white/60 mb-5">
              Cek kembali nomor booking. Pastikan formatnya BOOK-2026-XXX.
            </p>
            <a
              href={getWaLink(ADMIN_WA, `Halo admin, saya tidak menemukan pesanan dengan nomor ${code}. Bisa dibantu?`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ButtonGlow variant="success" size="md" fullWidth leftIcon={<MessageCircle size={18} />}>
                Tanya Admin
              </ButtonGlow>
            </a>
          </GlassCard>
        )}

        {/* Found */}
        {searched && !loading && booking && (
          <div className="space-y-4 animate-fade-up">
            {/* Status pipeline */}
            <GlassCard variant="strong">
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Booking
                  </div>
                  <div className="font-mono text-xl font-extrabold text-white">{booking.id}</div>
                </div>
                <BadgeStatus status={booking.status} size="md" />
              </div>

              <div className="my-6">
                <ProgressOrb
                  step={stepFromStatus(booking.status)}
                  labels={['Diterima', 'Dikerjakan', 'Selesai']}
                />
              </div>

              {/* 3D progress cylinder */}
              <div className="mt-2">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                    Progress
                  </span>
                  <CountUp
                    value={progressPct(booking.status)}
                    format="number"
                    className="text-lg font-extrabold gradient-text"
                  />
                </div>
                <div className="relative h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full transition-all duration-1000',
                      booking.status === 'Cancelled'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 glow-red'
                        : 'bg-gradient-to-r from-purple via-cyan to-emerald-400 glow-cyan'
                    )}
                    style={{ width: `${progressPct(booking.status)}%` }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Detail card */}
            <GlassCard variant="strong">
              <h3 className="text-base font-bold text-white mb-4">Detail Pesanan</h3>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Nama" value={booking.nama} />
                <Stat label="WhatsApp" value={booking.whatsapp} />
                <Stat label="Jenis Tugas" value={booking.jenistugas} />
                <Stat
                  label="Urgensi"
                  value={`${booking.urgensi} (×${URGENCY_INFO[booking.urgensi].mult})`}
                />
                <Stat label="Deadline" value={formatDate(booking.deadline)} fullCol />
                <Stat
                  label="Harga"
                  value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(booking.harga)}
                  fullCol
                  highlight
                />
              </div>
              {booking.detail && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-1.5">
                    Detail
                  </div>
                  <p className="text-sm text-white/85 leading-relaxed">{booking.detail}</p>
                </div>
              )}
              {booking.catatan && (
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-1.5">
                    Catatan
                  </div>
                  <p className="text-sm text-white/75 leading-relaxed">{booking.catatan}</p>
                </div>
              )}
              {booking.alasanBatal && (
                <div className="mt-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-3">
                  <div className="text-xs uppercase tracking-wider text-red-300 font-semibold mb-1">
                    Alasan Pembatalan
                  </div>
                  <p className="text-sm text-white/85">{booking.alasanBatal}</p>
                </div>
              )}
            </GlassCard>

            {/* Timeline */}
            <GlassCard variant="strong">
              <h3 className="text-base font-bold text-white mb-4">Riwayat</h3>
              <div className="space-y-4">
                <TimelineRow
                  Icon={Clock}
                  color="amber"
                  title="Pesanan dibuat"
                  time={booking.createdAt}
                  done
                />
                {booking.status !== 'Pending' && booking.waktuKonfirmasi && (
                  <TimelineRow
                    Icon={Sparkles}
                    color="cyan"
                    title="Dikonfirmasi admin"
                    time={booking.waktuKonfirmasi}
                    done
                  />
                )}
                {booking.status === 'Completed' && (
                  <TimelineRow
                    Icon={CheckCircle2}
                    color="green"
                    title="Tugas selesai"
                    time={booking.updatedAt}
                    done
                  />
                )}
                {booking.status === 'Cancelled' && (
                  <TimelineRow
                    Icon={AlertCircle}
                    color="red"
                    title="Pesanan dibatalkan"
                    time={booking.updatedAt}
                    done
                  />
                )}
                {booking.status === 'Pending' && (
                  <TimelineRow
                    Icon={Sparkles}
                    color="cyan"
                    title="Menunggu konfirmasi admin"
                    time={null}
                  />
                )}
              </div>
            </GlassCard>

            {/* CTA */}
            <a
              href={getWaLink(
                ADMIN_WA,
                `Halo admin, saya mau tanya tentang pesanan ${booking.id}. Mohon bantuannya 🙏`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <ButtonGlow
                variant="success"
                size="lg"
                fullWidth
                shimmer
                leftIcon={<MessageCircle size={18} />}
              >
                Chat Admin
              </ButtonGlow>
            </a>
          </div>
        )}
      </div>
    </>
  )
}

function Stat({
  label,
  value,
  fullCol = false,
  highlight = false,
}: {
  label: string
  value: string
  fullCol?: boolean
  highlight?: boolean
}) {
  return (
    <div className={cn(fullCol && 'col-span-2')}>
      <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">
        {label}
      </div>
      <div
        className={cn(
          'text-sm font-semibold',
          highlight ? 'text-cyan text-base' : 'text-white'
        )}
      >
        {value}
      </div>
    </div>
  )
}

function TimelineRow({
  Icon,
  color,
  title,
  time,
  done = false,
}: {
  Icon: LucideIcon
  color: 'amber' | 'cyan' | 'green' | 'red'
  title: string
  time: string | null
  done?: boolean
}) {
  const bg = {
    amber: 'bg-amber-500/20 text-amber-300',
    cyan:  'bg-cyan-500/20 text-cyan-300',
    green: 'bg-emerald-500/20 text-emerald-300',
    red:   'bg-red-500/20 text-red-300',
  }[color]

  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
          bg,
          !done && 'opacity-50'
        )}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-semibold', done ? 'text-white' : 'text-white/50')}>
          {title}
        </div>
        {time && (
          <div className="text-[11px] text-white/50 mt-0.5">
            {timeAgo(time)} · {formatDate(time)}
          </div>
        )}
      </div>
    </div>
  )
}
