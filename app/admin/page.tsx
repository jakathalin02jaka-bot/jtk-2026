'use client'

import { useState, useMemo, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { GlassCard } from '@/components/layout/GlassCard'
import { ButtonGlow } from '@/components/ui/ButtonGlow'
import { InputFloat } from '@/components/ui/InputFloat'
import { BadgeStatus } from '@/components/ui/BadgeStatus'
import { SheetBottom } from '@/components/ui/SheetBottom'
import { CountUp } from '@/components/effects/CountUp'
import {
  getAllBookings,
  updateBookingStatus,
  exportToCSV,
  getCatalog,
  saveCatalog,
  resetCatalog,
} from '@/lib/storage'
import {
  buildConfirmationMessage,
  buildCompletionMessage,
  buildCancellationMessage,
  getWaLink,
} from '@/lib/whatsapp'
import {
  cn,
  haptic,
  formatDate,
  formatRupiah,
  timeAgo,
} from '@/lib/utils'
import type { Booking, BookingStatus, CatalogItem } from '@/lib/types'
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  LogOut,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  XCircle,
  RefreshCw,
  Settings,
  Wallet,
  Clock,
  Trophy,
  Trash2,
  Save,
  type LucideIcon,
} from 'lucide-react'

const ADMIN_PASSWORD = 'admin2026' // hardcoded as spec doesn't require backend

type Tab = 'dashboard' | 'bookings' | 'catalog'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [authError, setAuthError] = useState('')

  const [tab, setTab] = useState<Tab>('dashboard')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<BookingStatus | 'All'>('All')
  const [filterOpen, setFilterOpen] = useState(false)
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const [catalog, setCatalog] = useState<CatalogItem[]>([])

  const refresh = () => {
    setBookings(
      getAllBookings().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    )
    setCatalog(getCatalog())
  }

  useEffect(() => {
    if (authed) refresh()
  }, [authed])

  const tryLogin = () => {
    haptic(10)
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true)
      setAuthError('')
      setPass('')
    } else {
      setAuthError('Password salah')
      haptic(30)
    }
  }

  const filtered = useMemo(() => {
    if (filter === 'All') return bookings
    return bookings.filter((b) => b.status === filter)
  }, [bookings, filter])

  const stats = useMemo(() => {
    const total   = bookings.length
    const pending = bookings.filter((b) => b.status === 'Pending').length
    const aktif   = bookings.filter((b) => b.status === 'Confirmed').length
    const selesai = bookings.filter((b) => b.status === 'Completed').length
    const revenue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.harga, 0)
    return { total, pending, aktif, selesai, revenue }
  }, [bookings])

  const updateStatus = (id: string, status: BookingStatus, extra?: { alasanBatal?: string }) => {
    haptic(10)
    const ok = updateBookingStatus(id, status, {
      ...extra,
      ...(status === 'Confirmed' ? { waktuKonfirmasi: new Date().toISOString() } : {}),
    })
    if (ok) {
      refresh()
      if (detailBooking) {
        const updated = getAllBookings().find((b) => b.id === id) ?? null
        setDetailBooking(updated)
      }
    }
  }

  const downloadCSV = () => {
    haptic(10)
    const csv = exportToCSV(bookings)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updateCatalogItem = (id: string, patch: Partial<CatalogItem>) => {
    setCatalog((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  const saveCatalogChanges = () => {
    haptic(15)
    saveCatalog(catalog)
  }

  const resetCatalogChanges = () => {
    if (!confirm('Reset katalog ke default?')) return
    haptic(15)
    resetCatalog()
    refresh()
  }

  /* ─── LOGIN ─────────────────────────────────────────────── */
  if (!authed) {
    return (
      <>
        <Navbar />
        <div className="min-h-dvh flex items-center justify-center px-5 pt-24 pb-32">
          <GlassCard variant="strong" glow="purple" className="w-full max-w-sm animate-scale-in">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple to-cyan flex items-center justify-center glow-purple mb-3">
                <Shield size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
              <p className="text-sm text-white/60 mt-1">
                Masukkan password untuk akses
              </p>
            </div>

            <div className="space-y-4">
              <InputFloat
                label="Password"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="text-white/60 press"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && tryLogin()}
                error={authError}
                autoComplete="current-password"
              />

              <ButtonGlow size="lg" fullWidth onClick={tryLogin} disabled={!pass}>
                Masuk
              </ButtonGlow>

              <p className="text-[11px] text-white/40 text-center pt-1">
                Hint default: <span className="font-mono text-white/60">admin2026</span>
              </p>
            </div>
          </GlassCard>
        </div>
      </>
    )
  }

  /* ─── DASHBOARD ─────────────────────────────────────────── */
  return (
    <>
      <Navbar />
      <div className="px-5 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">
              <span className="gradient-text">Admin</span>
            </h1>
            <p className="text-sm text-white/60 mt-1">Kelola pesanan & katalog</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { haptic(6); refresh() }}
              className="w-11 h-11 rounded-2xl glass flex items-center justify-center press border border-white/10"
              aria-label="Refresh"
            >
              <RefreshCw size={18} className="text-white/80" />
            </button>
            <button
              onClick={() => { haptic(6); setAuthed(false) }}
              className="w-11 h-11 rounded-2xl glass flex items-center justify-center press border border-white/10 text-red-400"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 -mx-5 px-5 overflow-x-auto no-scrollbar">
          {[
            { key: 'dashboard', label: 'Dashboard', Icon: Trophy },
            { key: 'bookings',  label: 'Pesanan',   Icon: Clock },
            { key: 'catalog',   label: 'Katalog',   Icon: Settings },
          ].map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => { haptic(6); setTab(t.key as Tab) }}
                className={cn(
                  'shrink-0 px-4 h-10 rounded-full text-sm font-semibold flex items-center gap-2 border transition-all press',
                  active
                    ? 'bg-gradient-to-r from-purple to-cyan text-white border-transparent glow-purple'
                    : 'glass text-white/70 border-white/10'
                )}
              >
                <t.Icon size={14} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Dashboard tab */}
        {tab === 'dashboard' && (
          <div className="space-y-4 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                Icon={Clock}
                label="Pending"
                value={stats.pending}
                color="amber"
              />
              <StatCard
                Icon={Sparkles}
                label="Aktif"
                value={stats.aktif}
                color="cyan"
              />
              <StatCard
                Icon={CheckCircle2}
                label="Selesai"
                value={stats.selesai}
                color="green"
              />
              <StatCard
                Icon={Trophy}
                label="Total Pesanan"
                value={stats.total}
                color="purple"
              />
            </div>

            <GlassCard variant="strong" glow="cyan">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-cyan" />
                  <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                    Total Revenue
                  </span>
                </div>
              </div>
              <CountUp
                value={stats.revenue}
                className="text-3xl font-extrabold gradient-text block"
              />
              <p className="text-[11px] text-white/50 mt-1">
                Excluding cancelled bookings
              </p>
            </GlassCard>

            <ButtonGlow
              variant="secondary"
              size="md"
              fullWidth
              onClick={downloadCSV}
              leftIcon={<Download size={16} />}
              disabled={bookings.length === 0}
            >
              Export ke CSV
            </ButtonGlow>
          </div>
        )}

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div className="space-y-3 animate-fade-up">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { haptic(6); setFilterOpen(true) }}
                className="flex-1 h-12 rounded-2xl glass border border-white/10 px-4 flex items-center gap-2 press"
              >
                <Filter size={16} className="text-white/60" />
                <span className="text-sm text-white">
                  {filter === 'All' ? 'Semua status' : filter}
                </span>
                <span className="ml-auto text-xs text-white/50">
                  {filtered.length} hasil
                </span>
              </button>
              <button
                onClick={downloadCSV}
                disabled={bookings.length === 0}
                className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center press disabled:opacity-50"
                aria-label="Download CSV"
              >
                <Download size={18} className="text-white/80" />
              </button>
            </div>

            {filtered.length === 0 ? (
              <GlassCard className="text-center py-10">
                <Clock size={32} className="text-white/30 mx-auto mb-2" />
                <p className="text-sm text-white/60">Belum ada pesanan</p>
              </GlassCard>
            ) : (
              filtered.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { haptic(8); setDetailBooking(b) }}
                  className="block w-full text-left press"
                >
                  <GlassCard className="!p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="font-mono text-xs font-bold text-white">{b.id}</div>
                        <div className="text-base font-bold text-white mt-0.5 truncate">
                          {b.nama}
                        </div>
                      </div>
                      <BadgeStatus status={b.status} size="sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <Mini label="Tugas" value={b.jenistugas} />
                      <Mini label="Urgensi" value={b.urgensi} />
                      <Mini label="Harga" value={formatRupiah(b.harga)} highlight />
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-white/50">
                      {timeAgo(b.createdAt)}
                    </div>
                  </GlassCard>
                </button>
              ))
            )}
          </div>
        )}

        {/* Catalog tab */}
        {tab === 'catalog' && (
          <div className="space-y-3 animate-fade-up">
            {catalog.map((c) => (
              <GlassCard key={c.id} variant="strong" className="!p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-white">{c.label}</div>
                    <div className="text-[11px] text-white/50">{c.desc}</div>
                  </div>
                  <button
                    onClick={() => { haptic(6); updateCatalogItem(c.id, { active: !c.active }) }}
                    className={cn(
                      'relative w-12 h-7 rounded-full transition-colors press',
                      c.active ? 'bg-emerald-500' : 'bg-white/10'
                    )}
                    aria-label="Toggle active"
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all',
                        c.active ? 'left-[22px]' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold whitespace-nowrap">
                    {c.fixed ? 'Per' : 'Per ' + c.unit}
                  </span>
                  <input
                    type="number"
                    value={c.basePrice}
                    onChange={(e) => updateCatalogItem(c.id, { basePrice: Number(e.target.value) })}
                    className="flex-1 h-10 rounded-xl glass border border-white/10 px-3 text-white text-sm outline-none focus:border-purple/60"
                  />
                  <span className="text-xs text-white/50">IDR</span>
                </div>
              </GlassCard>
            ))}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <ButtonGlow variant="ghost" size="md" onClick={resetCatalogChanges} leftIcon={<Trash2 size={16} />}>
                Reset
              </ButtonGlow>
              <ButtonGlow size="md" onClick={saveCatalogChanges} shimmer leftIcon={<Save size={16} />}>
                Simpan
              </ButtonGlow>
            </div>
          </div>
        )}
      </div>

      {/* Filter sheet */}
      <SheetBottom open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Status">
        <div className="space-y-2 pb-2">
          {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((s) => {
            const active = filter === s
            return (
              <button
                key={s}
                onClick={() => { haptic(6); setFilter(s); setFilterOpen(false) }}
                className={cn(
                  'w-full h-14 rounded-2xl border flex items-center px-4 text-left press',
                  active
                    ? 'bg-gradient-to-r from-purple/20 to-cyan/10 border-purple/40 glow-purple'
                    : 'glass border-white/10'
                )}
              >
                <span className="font-semibold text-white">
                  {s === 'All' ? 'Semua status' : s}
                </span>
                <span className="ml-auto text-xs text-white/50">
                  {s === 'All' ? bookings.length : bookings.filter((b) => b.status === s).length}
                </span>
              </button>
            )
          })}
        </div>
      </SheetBottom>

      {/* Detail sheet */}
      <SheetBottom
        open={!!detailBooking}
        onClose={() => { setDetailBooking(null); setCancelReason('') }}
        title={detailBooking?.id}
      >
        {detailBooking && (
          <div className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  Status
                </div>
                <BadgeStatus status={detailBooking.status} size="md" className="mt-1" />
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-white/50">Total</div>
                <div className="text-2xl font-extrabold gradient-text">
                  {formatRupiah(detailBooking.harga)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm border-t border-white/10 pt-4">
              <Mini label="Nama" value={detailBooking.nama} />
              <Mini label="WhatsApp" value={detailBooking.whatsapp} />
              <Mini label="Tugas" value={detailBooking.jenistugas} />
              <Mini label="Urgensi" value={detailBooking.urgensi} />
              <Mini label="Deadline" value={formatDate(detailBooking.deadline)} fullCol />
              <Mini label="Dibuat" value={formatDate(detailBooking.createdAt)} fullCol />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">
                Detail
              </div>
              <p className="text-sm text-white/85 leading-relaxed">{detailBooking.detail}</p>
            </div>
            {detailBooking.catatan && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">
                  Catatan
                </div>
                <p className="text-sm text-white/75 leading-relaxed">{detailBooking.catatan}</p>
              </div>
            )}

            {/* Actions */}
            {detailBooking.status === 'Pending' && (
              <div className="grid grid-cols-2 gap-3">
                <ButtonGlow
                  variant="success"
                  size="md"
                  onClick={() => updateStatus(detailBooking.id, 'Confirmed')}
                  leftIcon={<Sparkles size={16} />}
                >
                  Konfirmasi
                </ButtonGlow>
                <a
                  href={getWaLink(
                    detailBooking.whatsapp,
                    buildConfirmationMessage({ ...detailBooking, status: 'Confirmed', waktuKonfirmasi: new Date().toISOString() })
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ButtonGlow variant="secondary" size="md" fullWidth>
                    Kirim WA
                  </ButtonGlow>
                </a>
              </div>
            )}

            {detailBooking.status === 'Confirmed' && (
              <div className="grid grid-cols-2 gap-3">
                <ButtonGlow
                  size="md"
                  onClick={() => updateStatus(detailBooking.id, 'Completed')}
                  leftIcon={<CheckCircle2 size={16} />}
                >
                  Selesaikan
                </ButtonGlow>
                <a
                  href={getWaLink(
                    detailBooking.whatsapp,
                    buildCompletionMessage(detailBooking)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ButtonGlow variant="secondary" size="md" fullWidth>
                    Kirim WA
                  </ButtonGlow>
                </a>
              </div>
            )}

            {(detailBooking.status === 'Pending' || detailBooking.status === 'Confirmed') && (
              <div className="pt-2 border-t border-white/10 space-y-3">
                <input
                  type="text"
                  placeholder="Alasan pembatalan (opsional)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-12 rounded-xl glass border border-white/10 px-4 text-white text-sm outline-none focus:border-red-500/40"
                />
                <ButtonGlow
                  variant="danger"
                  size="md"
                  fullWidth
                  onClick={() => {
                    updateStatus(detailBooking.id, 'Cancelled', { alasanBatal: cancelReason || 'Tidak disebutkan' })
                    setCancelReason('')
                  }}
                  leftIcon={<XCircle size={16} />}
                >
                  Batalkan Pesanan
                </ButtonGlow>
                {detailBooking.alasanBatal === undefined && (
                  <a
                    href={getWaLink(
                      detailBooking.whatsapp,
                      buildCancellationMessage({ ...detailBooking, status: 'Cancelled', alasanBatal: cancelReason })
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ButtonGlow variant="ghost" size="sm" fullWidth>
                      Kirim WA Pembatalan
                    </ButtonGlow>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </SheetBottom>
    </>
  )
}

function StatCard({
  Icon,
  label,
  value,
  color,
}: {
  Icon: LucideIcon
  label: string
  value: number
  color: 'amber' | 'cyan' | 'green' | 'purple'
}) {
  const colorMap = {
    amber:  { bg: 'from-amber-500/20 to-orange-500/10',  text: 'text-amber-300',   glow: 'glow-amber'  },
    cyan:   { bg: 'from-cyan-500/20 to-blue-500/10',     text: 'text-cyan-300',    glow: 'glow-cyan'   },
    green:  { bg: 'from-emerald-500/20 to-teal-500/10',  text: 'text-emerald-300', glow: 'glow-green'  },
    purple: { bg: 'from-purple/20 to-violet-500/10',     text: 'text-purple',      glow: 'glow-purple' },
  }[color]

  return (
    <div
      className={cn(
        'relative rounded-3xl p-4 border border-white/10 bg-gradient-to-br',
        colorMap.bg
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl glass flex items-center justify-center mb-3', colorMap.text)}>
        <Icon size={20} />
      </div>
      <CountUp value={value} format="number" className="text-3xl font-extrabold text-white block leading-none" />
      <div className="text-[11px] uppercase tracking-wider text-white/50 font-semibold mt-1.5">
        {label}
      </div>
    </div>
  )
}

function Mini({
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
      <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-0.5">
        {label}
      </div>
      <div className={cn('text-sm font-semibold truncate', highlight ? 'text-cyan' : 'text-white')}>
        {value}
      </div>
    </div>
  )
}
