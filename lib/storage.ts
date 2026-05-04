import type { Booking, BookingStatus, CatalogItem } from './types'

const BOOKINGS_KEY = 'jtk_bookings'
const COUNTER_KEY  = 'jtk_counter'
const CATALOG_KEY  = 'jtk_catalog'

/* ─── Default catalog (matches booking form defaults) ─────── */
export const DEFAULT_CATALOG: CatalogItem[] = [
  { id: 'makalah',  label: 'Makalah',  desc: 'Makalah & essay akademik',   basePrice: 6000,  fixed: false, unit: 'halaman', active: true },
  { id: 'ppt',      label: 'PPT',      desc: 'Presentasi PowerPoint',       basePrice: 5000,  fixed: false, unit: 'slide',   active: true },
  { id: 'coding',   label: 'Coding',   desc: 'Web, mobile & algoritma',     basePrice: 50000, fixed: true,  unit: 'proyek',  active: true },
  { id: 'desain',   label: 'Desain',   desc: 'Desain grafis & UI/UX',       basePrice: 25000, fixed: true,  unit: 'desain',  active: true },
  { id: 'jurnal',   label: 'Jurnal',   desc: 'Jurnal & artikel ilmiah',     basePrice: 8000,  fixed: false, unit: 'halaman', active: true },
  { id: 'proposal', label: 'Proposal', desc: 'Skripsi, tesis & proposal',   basePrice: 7000,  fixed: false, unit: 'halaman', active: true },
  { id: 'lainnya',  label: 'Lainnya',  desc: 'Tugas lain (nego langsung)',  basePrice: 5000,  fixed: false, unit: 'halaman', active: true },
]

export function getCatalog(): CatalogItem[] {
  if (typeof window === 'undefined') return DEFAULT_CATALOG
  try {
    const raw = localStorage.getItem(CATALOG_KEY)
    if (!raw) return DEFAULT_CATALOG
    const parsed: CatalogItem[] = JSON.parse(raw)
    return parsed.length ? parsed : DEFAULT_CATALOG
  } catch {
    return DEFAULT_CATALOG
  }
}

export function saveCatalog(items: CatalogItem[]): void {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(items))
}

export function resetCatalog(): void {
  localStorage.removeItem(CATALOG_KEY)
}

function getCounter(): number {
  if (typeof window === 'undefined') return 1
  const val = localStorage.getItem(COUNTER_KEY)
  return val ? parseInt(val, 10) : 1
}

function incrementCounter(): number {
  const next = getCounter() + 1
  localStorage.setItem(COUNTER_KEY, String(next))
  return next
}

export function generateBookingId(): string {
  const year = new Date().getFullYear()
  const counter = getCounter()
  const padded = String(counter).padStart(3, '0')
  return `BOOK-${year}-${padded}`
}

export function getAllBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveBooking(booking: Booking): void {
  const all = getAllBookings()
  all.push(booking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all))
  incrementCounter()
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  extra?: { alasanBatal?: string; waktuKonfirmasi?: string }
): boolean {
  const all = getAllBookings()
  const idx = all.findIndex((b) => b.id === id)
  if (idx === -1) return false
  all[idx] = {
    ...all[idx],
    status,
    updatedAt: new Date().toISOString(),
    ...extra,
  }
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all))
  return true
}

export function getBookingById(id: string): Booking | null {
  return getAllBookings().find((b) => b.id === id) ?? null
}

export function getBookingsByWhatsApp(wa: string): Booking[] {
  const clean = wa.replace(/\D/g, '')
  return getAllBookings().filter((b) => b.whatsapp.replace(/\D/g, '').includes(clean))
}

export function deleteBooking(id: string): boolean {
  const all = getAllBookings()
  const filtered = all.filter((b) => b.id !== id)
  if (filtered.length === all.length) return false
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered))
  return true
}

export function exportToCSV(bookings: Booking[]): string {
  const headers = [
    'Nomor Booking',
    'Nama',
    'WhatsApp',
    'Jenis Tugas',
    'Detail',
    'Deadline',
    'Urgensi',
    'Harga',
    'Status',
    'Catatan',
    'Dibuat',
    'Diupdate',
  ]

  const rows = bookings.map((b) =>
    [
      b.id,
      b.nama,
      b.whatsapp,
      b.jenistugas,
      `"${b.detail.replace(/"/g, '""')}"`,
      new Date(b.deadline).toLocaleString('id-ID'),
      b.urgensi,
      b.harga,
      b.status,
      `"${(b.catatan ?? '').replace(/"/g, '""')}"`,
      new Date(b.createdAt).toLocaleString('id-ID'),
      new Date(b.updatedAt).toLocaleString('id-ID'),
    ].join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}
