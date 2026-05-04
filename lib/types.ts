export type TaskType =
  | 'Makalah'
  | 'PPT'
  | 'Coding'
  | 'Desain'
  | 'Jurnal'
  | 'Proposal'
  | 'Lainnya'

export type UrgencyLevel = 'Normal' | 'Urgent' | 'Express'

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'

export interface Booking {
  id: string // BOOK-2026-XXX
  nama: string
  whatsapp: string
  jenistugas: TaskType
  detail: string
  deadline: string // ISO string
  urgensi: UrgencyLevel
  harga: number
  catatan: string
  status: BookingStatus
  createdAt: string
  updatedAt: string
  alasanBatal?: string
  waktuKonfirmasi?: string
}

export interface AdminCredentials {
  username: string
  password: string
}

export interface CatalogItem {
  id: string           // uuid-style unique key
  label: string        // display name, e.g. "Makalah"
  desc: string         // short description
  basePrice: number    // per unit price in IDR
  fixed: boolean       // true = per project, false = per page/slide
  unit: string         // e.g. "halaman", "slide", "proyek"
  active: boolean      // toggle visibility in booking form
}
