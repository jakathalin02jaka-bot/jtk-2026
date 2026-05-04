'use client'

import { Reveal } from '@/components/effects/Reveal'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Andi P.',
    role: 'Mahasiswa Teknik',
    rating: 5,
    text: 'Dikejar deadline besok pagi, eh selesai jam 2 malam. Hasil rapi, kena revisi 1x langsung beres. Worth banget.',
    color: 'from-purple to-cyan',
  },
  {
    name: 'Mira S.',
    role: 'Mahasiswi Manajemen',
    rating: 5,
    text: 'PPT-ku diubah jadi keren banget. Dosen sampe nanya saya pake jasa siapa hahaha. Recommended!',
    color: 'from-pink to-rose-400',
  },
  {
    name: 'Bagas R.',
    role: 'Mahasiswa IT',
    rating: 5,
    text: 'Coding tugas akhir aman. Code clean, ada komentar penjelasan, dan dijelasin via WA kalau ada yang ga ngerti.',
    color: 'from-cyan to-emerald-400',
  },
  {
    name: 'Sasa W.',
    role: 'Mahasiswi Sastra',
    rating: 5,
    text: 'Makalah 15 halaman selesai dalam 6 jam. Plagiarisme di bawah 10%. Mantap pokoknya.',
    color: 'from-amber-400 to-pink',
  },
  {
    name: 'Reza M.',
    role: 'Mahasiswa Hukum',
    rating: 5,
    text: 'Admin fast respon, harga jelas dari awal, ga ada biaya hidden. Nilai akhirnya A. Top!',
    color: 'from-emerald-400 to-cyan',
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative py-12">
      <Reveal className="px-5 mb-6">
        <div className="text-xs font-bold tracking-[0.2em] text-purple uppercase mb-2">
          ✦ Kata Mereka
        </div>
        <h2 className="text-3xl font-extrabold leading-tight">
          Sudah dipercaya <span className="gradient-text">500+ mahasiswa</span>
        </h2>
      </Reveal>

      <div
        className="snap-x-mandatory no-scrollbar flex gap-4 px-5 overflow-x-auto pb-3"
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[80%] max-w-[300px]"
            style={{
              transform: `perspective(1000px) rotateY(${(i - 2) * 3}deg)`,
            }}
          >
            <div className="relative h-full glass-strong rounded-3xl p-5 border border-white/10 overflow-hidden">
              <Quote
                className="absolute -top-2 -right-2 text-white/5"
                size={80}
                strokeWidth={1.5}
              />
              <div className="relative">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/85 leading-relaxed mb-5 min-h-[100px]">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-[11px] text-white/50">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
