'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { GlassCard } from '@/components/layout/GlassCard'
import { ButtonGlow } from '@/components/ui/ButtonGlow'
import { InputFloat } from '@/components/ui/InputFloat'
import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { getBookingsByWhatsApp } from '@/lib/storage'
import {
  haptic,
  formatDate,
  timeAgo,
  formatRupiah,
  cn,
} from '@/lib/utils'
import type { Booking, BookingStatus } from '@/lib/types'
import {
  Search as SearchIcon,
  Phone,
  ListChecks,
  ArrowRight,
  Inbox,
} from 'lucide-react'

const FILTERS: { key: BookingStatus | 'All'; label: string }[] = [
  { key: 'All',       label: 'Semua' },
  { key: 'Pending',   label: 'Pending' },
  { key: 'Confirmed', label: 'Aktif' },
  { key: 'Completed', label: 'Selesai' },
  { key: 'Cancelled', label: 'Batal' },
]

export default function MyBookingsPage() {
  const [wa, setWa] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searched, setSearched] = useState(false)
  const [filter, setFilter] = useState<BookingStatus | 'All'>('All')

  const search = () => {
    if (!wa.trim()) return
    haptic(10)
    const result = getBookingsByWhatsApp(wa.trim()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setBookings(result)
    setSearched(true)
  }

  const filtered = useMemo(() => {
    if (filter === 'All') return bookings
    return bookings.filter((b) => b.status === filter)
  }, [bookings, filter])

  const counts = useMemo(() => {
    return {
      All:       bookings.length,
      Pending:   bookings.filter((b) => b.status === 'Pending').length,
      Confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
      Completed: bookings.filter((b) => b.status === 'Completed').length,
      Cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
    }
  }, [bookings])

  return (
    <>
      <Navbar />
      <div className="px-5 pt-24 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold leading-tight">
            Pesanan <span className="gradient-text">Saya</span>
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Cari semua pesanan dengan nomor WhatsApp.
          </p>
        </div>

        <GlassCard variant="strong" className="mb-5">
          <InputFloat
            label="Nomor WhatsApp"
            leftIcon={<Phone size={18} />}
            inputMode="numeric"
            placeholder="08xxxxxxxxxx"
            value={wa}
            onChange={(e) => setWa(e.target.value.replace(/[^\d]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <ButtonGlow
            size="lg"
            fullWidth
            onClick={search}
            disabled={!wa.trim()}
            leftIcon={<SearchIcon size={18} />}
            className="mt-4"
          >
            Cari Pesanan
          </ButtonGlow>
        </GlassCard>

        {/* Filter pills */}
        {searched && bookings.length > 0 && (
          <div className="snap-x-mandatory flex gap-2 mb-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            {FILTERS.map((f) => {
              const active = filter === f.key
              const count = counts[f.key]
              return (
                <button
                  key={f.key}
                  onClick={() => { haptic(6); setFilter(f.key) }}
                  className={cn(
                    'snap-start shrink-0 px-4 h-10 rounded-full text-sm font-semibold flex items-center gap-2 border transition-all press',
                    active
                      ? 'bg-gradient-to-r from-purple to-cyan text-white border-transparent glow-purple'
                      : 'glass text-white/70 border-white/10'
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      'inline-flex items-center justify-center min-w-5 h-5 rounded-full px-1.5 text-[10px] font-bold',
                      active ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {searched && bookings.length === 0 && (
          <GlassCard className="text-center py-10 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Inbox size={32} className="text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Belum ada pesanan</h3>
            <p className="text-sm text-white/60 mb-5 max-w-xs mx-auto">
              Tidak ada pesanan yang ditemukan untuk nomor WhatsApp ini.
            </p>
            <Link href="/booking">
              <ButtonGlow size="md" fullWidth rightIcon={<ArrowRight size={18} />}>
                Buat Pesanan Baru
              </ButtonGlow>
            </Link>
          </GlassCard>
        )}

        {/* List */}
        {searched && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((b, i) => (
              <BookingCard key={b.id} booking={b} index={i} />
            ))}
          </div>
        )}

        {/* Initial state */}
        {!searched && (
          <div className="text-center py-12 animate-fade-up">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-4 glow-purple">
              <ListChecks size={40} className="text-white/80" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Cari pesanan dengan nomor WA
            </h3>
            <p className="text-sm text-white/60 max-w-xs mx-auto">
              Masukkan nomor WhatsApp yang kamu pakai saat booking untuk lihat
              semua riwayat pesanan.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  const statusGlow = {
    Pending:   'amber',
    Confirmed: 'cyan',
    Completed: 'green',
    Cancelled: 'red',
  }[booking.status] as 'amber' | 'cyan' | 'green' | 'red'

  return (
    <Link
      href={`/track?code=${booking.id}`}
      onClick={() => haptic(6)}
      className="block press"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <GlassCard
        variant="strong"
        glow={statusGlow}
        className="!p-4 animate-fade-up"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-sm font-bold text-white truncate">
              {booking.id}
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">
              {timeAgo(booking.createdAt)}
            </div>
          </div>
          <BadgeStatus status={booking.status} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
              Tugas
            </div>
            <div className="font-semibold text-white truncate">{booking.jenistugas}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
              Harga
            </div>
            <div className="font-bold gradient-text">{formatRupiah(booking.harga)}</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-white/50">
            Deadline: {formatDate(booking.deadline)}
          </span>
          <ArrowRight size={14} className="text-white/40" />
        </div>
      </GlassCard>
    </Link>
  )
}
