'use client'

import { useState } from 'react'
import { Reveal } from '@/components/effects/Reveal'
import { ChevronDown } from 'lucide-react'
import { cn, haptic } from '@/lib/utils'

const FAQS = [
  {
    q: 'Berapa lama tugas saya selesai?',
    a: 'Tergantung urgensi yang dipilih: Express (< 24 jam), Urgent (1-3 hari), Normal (> 3 hari). Estimasi pasti dikonfirmasi admin via WhatsApp.',
  },
  {
    q: 'Bagaimana cara pembayarannya?',
    a: 'Setelah booking dikonfirmasi admin, kamu akan diarahkan ke transfer manual (BCA/BRI/DANA/OVO/GoPay). Cash on Delivery untuk area tertentu juga bisa.',
  },
  {
    q: 'Apakah ada garansi revisi?',
    a: 'Ya. Kamu dapat 2x revisi gratis dalam 7 hari setelah tugas selesai dikirim. Revisi ke-3 dst akan dikenakan biaya tambahan kecil.',
  },
  {
    q: 'Apakah hasilnya bebas plagiarisme?',
    a: 'Iya. Kami menggunakan tools cek plagiat sebelum dikirim. Standar kami < 15%. Kalau perlu di bawah 5%, bisa request khusus dengan biaya plus.',
  },
  {
    q: 'Bagaimana kalau tugasnya gagal/kena revisi besar dari dosen?',
    a: 'Selama masih dalam scope yang disepakati di awal, revisi gratis. Kalau dosen minta perubahan total, kita diskusi ulang via WhatsApp.',
  },
  {
    q: 'Data saya aman?',
    a: 'Aman 100%. Data tugas hanya disimpan selama proses pengerjaan, dihapus setelah selesai. Kami tidak share ke pihak ketiga.',
  },
]

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="relative py-12 px-5">
      <Reveal className="mb-6">
        <div className="text-xs font-bold tracking-[0.2em] text-cyan uppercase mb-2">
          ✦ FAQ
        </div>
        <h2 className="text-3xl font-extrabold leading-tight">
          Pertanyaan yang <span className="gradient-text">sering ditanya</span>
        </h2>
      </Reveal>

      <Reveal stagger className="space-y-3">
        {FAQS.map((f, i) => {
          const open = openIdx === i
          return (
            <div
              key={i}
              className={cn(
                'glass rounded-2xl border border-white/10 overflow-hidden transition-all',
                open && 'glow-purple border-purple/30'
              )}
            >
              <button
                onClick={() => { haptic(6); setOpenIdx(open ? null : i) }}
                className="w-full flex items-start justify-between gap-4 p-5 text-left press"
              >
                <span className="font-semibold text-white text-sm leading-snug pr-2">
                  {f.q}
                </span>
                <span
                  className={cn(
                    'shrink-0 w-8 h-8 rounded-full glass flex items-center justify-center transition-transform duration-300',
                    open && 'rotate-180 bg-purple/20'
                  )}
                >
                  <ChevronDown size={16} className="text-white" />
                </span>
              </button>
              <div
                className="grid transition-all duration-400 ease-out"
                style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-white/70 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </Reveal>
    </section>
  )
}
