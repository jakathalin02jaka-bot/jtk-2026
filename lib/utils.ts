import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

export const URGENCY_MULTIPLIER = {
  Normal:  1,
  Urgent:  1.4,
  Express: 1.8,
} as const

export const URGENCY_INFO = {
  Normal:  { label: 'Normal',  desc: '> 3 hari',     color: 'cyan',   mult: 1   },
  Urgent:  { label: 'Urgent',  desc: '1-3 hari',     color: 'purple', mult: 1.4 },
  Express: { label: 'Express', desc: '< 24 jam',     color: 'pink',   mult: 1.8 },
} as const

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'baru saja'
  if (m < 60) return `${m} menit lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} hari lalu`
  return formatDateShort(iso)
}

/** Trigger short haptic on supported devices (Android Chrome) */
export function haptic(ms: number = 10): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(ms) } catch { /* ignore */ }
  }
}
