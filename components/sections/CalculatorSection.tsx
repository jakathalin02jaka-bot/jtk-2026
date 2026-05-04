'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/effects/Reveal'
import { GlassCard } from '@/components/layout/GlassCard'
import { ButtonGlow } from '@/components/ui/ButtonGlow'
import { CountUp } from '@/components/effects/CountUp'
import { getCatalog } from '@/lib/storage'
import { URGENCY_INFO, cn, haptic } from '@/lib/utils'
import type { CatalogItem, UrgencyLevel } from '@/lib/types'
import { Calculator, ArrowRight } from 'lucide-react'

export function CalculatorSection() {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [taskId, setTaskId] = useState<string>('makalah')
  const [qty, setQty] = useState(10)
  const [urgency, setUrgency] = useState<UrgencyLevel>('Normal')

  useEffect(() => {
    const cat = getCatalog().filter((i) => i.active)
    setItems(cat)
    if (cat.length > 0 && !cat.find((c) => c.id === taskId)) {
      setTaskId(cat[0]!.id)
    }
  }, [taskId])

  const item = items.find((i) => i.id === taskId)
  const base = item ? (item.fixed ? item.basePrice : item.basePrice * qty) : 0
  const total = Math.round(base * URGENCY_INFO[urgency].mult)

  // Speedometer angle: -45deg (Normal) → 0deg (Urgent) → 45deg (Express)
  const angle = urgency === 'Normal' ? -45 : urgency === 'Urgent' ? 0 : 45

  return (
    <section className="relative py-12 px-5">
      <Reveal>
        <div className="text-xs font-bold tracking-[0.2em] text-pink uppercase mb-2">
          ✦ Kalkulator Harga
        </div>
        <h2 className="text-3xl font-extrabold leading-tight">
          Cek <span className="gradient-text">estimasi biaya</span> sebelum pesan
        </h2>
      </Reveal>

      <Reveal className="mt-6">
        <GlassCard variant="strong" className="space-y-6">
          {/* Pilih layanan */}
          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2.5 block font-semibold">
              Jenis tugas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {items.slice(0, 6).map((i) => (
                <button
                  key={i.id}
                  onClick={() => { haptic(6); setTaskId(i.id) }}
                  className={cn(
                    'h-12 rounded-xl text-sm font-semibold transition-all press border',
                    taskId === i.id
                      ? 'bg-gradient-to-br from-purple to-cyan text-white border-transparent glow-purple'
                      : 'glass text-white/70 border-white/10'
                  )}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider qty */}
          {!item?.fixed && (
            <div>
              <div className="flex items-baseline justify-between mb-2.5">
                <label className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  Jumlah {item?.unit ?? 'halaman'}
                </label>
                <span className="text-2xl font-extrabold gradient-text">{qty}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #7C3AED 0%, #06B6D4 ${qty}%, rgba(255,255,255,0.1) ${qty}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>1</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          )}

          {/* Urgency speedometer */}
          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-3 block font-semibold">
              Urgensi
            </label>
            <div className="relative h-28 mb-3 flex items-end justify-center overflow-hidden">
              {/* Speedometer arc */}
              <svg viewBox="0 0 200 110" className="w-full max-w-[200px]">
                <defs>
                  <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#speedGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset="0"
                />
                {/* Needle */}
                <g
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '100px 100px',
                    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="35"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="100" r="8" fill="white" />
                  <circle cx="100" cy="100" r="4" fill="#7C3AED" />
                </g>
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(URGENCY_INFO) as UrgencyLevel[]).map((u) => {
                const info = URGENCY_INFO[u]
                const active = urgency === u
                const colorClass =
                  info.color === 'cyan'   ? 'from-cyan to-blue-500' :
                  info.color === 'purple' ? 'from-purple to-violet-400' :
                                            'from-pink to-rose-500'
                return (
                  <button
                    key={u}
                    onClick={() => { haptic(10); setUrgency(u) }}
                    className={cn(
                      'h-16 rounded-xl text-center transition-all press border',
                      active
                        ? `bg-gradient-to-br ${colorClass} text-white border-transparent`
                        : 'glass text-white/70 border-white/10'
                    )}
                  >
                    <div className="text-sm font-bold">{info.label}</div>
                    <div className="text-[10px] opacity-80">{info.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Total estimasi */}
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-purple/20 to-cyan/10 border border-white/10 inner-glow">
            <div className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Estimasi total
            </div>
            <CountUp
              value={total}
              className="text-4xl font-extrabold text-white block mt-1"
            />
            <div className="text-xs text-white/50 mt-1">
              *Harga final dikonfirmasi admin via WhatsApp
            </div>
          </div>

          <Link href="/booking">
            <ButtonGlow size="lg" fullWidth shimmer leftIcon={<Calculator size={18} />} rightIcon={<ArrowRight size={18} />}>
              Lanjut Pesan
            </ButtonGlow>
          </Link>
        </GlassCard>
      </Reveal>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #7C3AED;
          box-shadow: 0 0 16px rgba(124, 58, 237, 0.6);
          cursor: pointer;
        }
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #7C3AED;
          box-shadow: 0 0 16px rgba(124, 58, 237, 0.6);
          cursor: pointer;
        }
      `}</style>
    </section>
  )
}
