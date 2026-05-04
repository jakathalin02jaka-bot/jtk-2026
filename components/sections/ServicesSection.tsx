'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/effects/Reveal'
import { getCatalog } from '@/lib/storage'
import { formatRupiah, haptic } from '@/lib/utils'
import type { CatalogItem } from '@/lib/types'
import {
  FileText,
  PresentationIcon,
  Code2,
  Palette,
  BookOpen,
  GraduationCap,
  MoreHorizontal,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  makalah:  FileText,
  ppt:      PresentationIcon,
  coding:   Code2,
  desain:   Palette,
  jurnal:   BookOpen,
  proposal: GraduationCap,
  lainnya:  MoreHorizontal,
}

const COLOR_MAP: Record<string, string> = {
  makalah:  'from-purple to-violet-400',
  ppt:      'from-orange-500 to-pink-500',
  coding:   'from-cyan to-blue-500',
  desain:   'from-pink to-rose-400',
  jurnal:   'from-emerald-500 to-teal-400',
  proposal: 'from-amber-500 to-orange-400',
  lainnya:  'from-slate-500 to-zinc-400',
}

export function ServicesSection() {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [flippedId, setFlippedId] = useState<string | null>(null)

  useEffect(() => {
    setItems(getCatalog().filter((i) => i.active))
  }, [])

  return (
    <section className="relative py-12">
      <Reveal className="px-5 mb-6">
        <div className="text-xs font-bold tracking-[0.2em] text-cyan uppercase mb-2">
          ✦ Layanan Kami
        </div>
        <h2 className="text-3xl font-extrabold leading-tight">
          Pilih jenis tugas, <span className="gradient-text">harga transparan</span>
        </h2>
        <p className="text-sm text-white/60 mt-2">
          Tap kartu untuk lihat detail. Geser kanan untuk lebih banyak.
        </p>
      </Reveal>

      <div className="relative">
        <div
          className="snap-x-mandatory no-scrollbar flex gap-4 px-5 overflow-x-auto pb-3"
          style={{ scrollPaddingLeft: '20px' }}
        >
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.id] ?? MoreHorizontal
            const grad = COLOR_MAP[item.id] ?? 'from-purple to-cyan'
            const flipped = flippedId === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  haptic(8)
                  setFlippedId(flipped ? null : item.id)
                }}
                className="snap-start shrink-0 w-[72%] max-w-[260px] [perspective:1200px] press"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="relative h-[200px] transition-transform duration-700 [transform-style:preserve-3d]"
                  style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-3xl glass border border-white/10 p-5 flex flex-col justify-between [backface-visibility:hidden]"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg`}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/50 mb-1">
                        Mulai dari
                      </div>
                      <div className="text-2xl font-extrabold text-white">
                        {formatRupiah(item.basePrice)}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">
                        / {item.unit}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-white">{item.label}</span>
                      <ArrowRight size={16} className="text-white/40" />
                    </div>
                  </div>
                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-3xl glass-strong border border-white/15 p-5 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  >
                    <div>
                      <div
                        className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${grad} bg-clip-text text-transparent`}
                      >
                        {item.label}
                      </div>
                      <p className="text-sm text-white/80 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <Link href="/booking" onClick={(e) => e.stopPropagation()}>
                      <div className={`w-full h-11 rounded-xl bg-gradient-to-r ${grad} flex items-center justify-center text-white font-semibold text-sm`}>
                        Pesan {item.label}
                      </div>
                    </Link>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
