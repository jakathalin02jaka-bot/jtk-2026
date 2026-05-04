import type { Booking } from './types'

export const ADMIN_WA = '081295991378'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function buildBookingMessage(booking: Booking): string {
  const lines = [
    '📋 *BOOKING TUGAS BARU*',
    '━━━━━━━━━━━━━━━━━━━━',
    `🔢 Nomor: ${booking.id}`,
    `👤 Nama: ${booking.nama}`,
    `📱 WA: ${booking.whatsapp}`,
    `📚 Tugas: ${booking.jenistugas}`,
    `📝 Detail: ${booking.detail}`,
    `⏰ Deadline: ${formatDate(booking.deadline)}`,
    `⚡ Urgensi: ${booking.urgensi}`,
    `💰 Harga: ${formatRupiah(booking.harga)}`,
    booking.catatan ? `📌 Catatan: ${booking.catatan}` : '📌 Catatan: -',
    '━━━━━━━━━━━━━━━━━━━━',
    '⏳ Status: MENUNGGU KONFIRMASI',
    `🕐 Waktu: ${formatDate(booking.createdAt)}`,
  ]
  return lines.join('\n')
}

export function buildConfirmationMessage(booking: Booking): string {
  const lines = [
    '✅ *BOOKING DIKONFIRMASI*',
    '━━━━━━━━━━━━━━━━━━━━',
    `🔢 Nomor: ${booking.id}`,
    `📚 Tugas: ${booking.jenistugas}`,
    `⏰ Deadline: ${formatDate(booking.deadline)}`,
    `💰 Harga Final: ${formatRupiah(booking.harga)}`,
    '━━━━━━━━━━━━━━━━━━━━',
    '✅ Status: DIKONFIRMASI ADMIN',
    `🕐 Waktu Konfirmasi: ${formatDate(booking.waktuKonfirmasi ?? new Date().toISOString())}`,
    '',
    'Tim kami akan segera mengerjakan tugas Anda. Terima kasih! 🙏',
  ]
  return lines.join('\n')
}

export function buildCompletionMessage(booking: Booking): string {
  const lines = [
    '🎉 *TUGAS SELESAI DIKERJAKAN!*',
    '━━━━━━━━━━━━━━━━━━━━',
    `🔢 Nomor: ${booking.id}`,
    `👤 Nama: ${booking.nama}`,
    `📚 Tugas: ${booking.jenistugas}`,
    `💰 Harga: ${formatRupiah(booking.harga)}`,
    '━━━━━━━━━━━━━━━━━━━━',
    '✅ Status: SELESAI',
    `🕐 Selesai: ${formatDate(new Date().toISOString())}`,
    '',
    'Tugas Anda telah selesai dikerjakan! Silakan cek dan konfirmasi hasilnya.',
    'Jika ada revisi, hubungi kami segera. Terima kasih sudah mempercayakan tugas Anda kepada kami! 🙏',
  ]
  return lines.join('\n')
}

export function buildCancellationMessage(booking: Booking): string {
  const lines = [
    '❌ *BOOKING DITOLAK*',
    '━━━━━━━━━━━━━━━━━━━━',
    `🔢 Nomor: ${booking.id}`,
    `📚 Tugas: ${booking.jenistugas}`,
    booking.alasanBatal ? `📌 Alasan: ${booking.alasanBatal}` : '',
    '━━━━━━━━━━━━━━━━━━━━',
    'Silakan hubungi admin untuk informasi lebih lanjut.',
  ]
    .filter((l) => l !== '')
    .join('\n')
  return lines
}

export function getWaLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '')
  const normalized = clean.startsWith('0') ? '62' + clean.slice(1) : clean
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function getAdminWaLink(message: string): string {
  return getWaLink(ADMIN_WA, message)
}
