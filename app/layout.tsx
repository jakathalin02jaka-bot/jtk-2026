import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/layout/BottomNav'
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Joki Tugas Kilat — Deadline Besok? Tenang.',
  description:
    'Joki tugas online cepat & terpercaya. Booking via WhatsApp, dikerjakan kilat. Makalah, PPT, Coding, Desain, Jurnal, Proposal.',
  keywords: ['joki tugas', 'jasa tugas', 'makalah', 'ppt', 'coding', 'skripsi'],
  authors: [{ name: 'Joki Tugas Kilat' }],
  openGraph: {
    title: 'Joki Tugas Kilat — Solusi Deadline Mepet',
    description: 'Booking online, dikerjakan tim profesional. Garansi revisi.',
    type: 'website',
    locale: 'id_ID',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`dark ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <main className="relative min-h-dvh pb-24">{children}</main>
        <BottomNav />
        <WhatsAppFAB />
      </body>
    </html>
  )
}
