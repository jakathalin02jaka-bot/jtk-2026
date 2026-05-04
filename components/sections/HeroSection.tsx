'use client'

import Link from 'next/link'
import { ButtonGlow } from '@/components/ui/ButtonGlow'
import { MeshGradient } from '@/components/effects/MeshGradient'
import { ArrowRight, Sparkles, Zap, Trophy } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-12">
      <MeshGradient />

      <div className="relative z-10 px-5">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 animate-fade-in">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative rounded-full bg-emerald-400 w-2 h-2" />
          </span>
          <span className="text-xs font-medium text-white/80">
            Online & ready · Respon &lt; 10 menit
          </span>
        </div>

        {/* Kinetic headline */}
        <h1 className="mt-5 text-[44px] leading-[1.05] sm:text-5xl font-extrabold tracking-tight">
          <span className="block animate-fade-up text-white" style={{ animationDelay: '60ms' }}>
            Deadline
          </span>
          <span
            className="block animate-fade-up gradient-text"
            style={{ animationDelay: '180ms' }}
          >
            Besok?
          </span>
          <span
            className="block animate-fade-up text-white/90 text-[28px] sm:text-3xl font-bold mt-1"
            style={{ animationDelay: '300ms' }}
          >
            Tenang, kami yang turun.
          </span>
        </h1>

        <p
          className="mt-5 text-base text-white/65 leading-relaxed max-w-md animate-fade-up"
          style={{ animationDelay: '420ms' }}
        >
          Joki tugas online dengan tim profesional. Booking via WhatsApp,
          dikerjakan kilat, garansi revisi sampai puas.
        </p>

        {/* CTA */}
        <div
          className="mt-7 flex flex-col gap-3 animate-fade-up"
          style={{ animationDelay: '540ms' }}
        >
          <Link href="/booking">
            <ButtonGlow size="lg" shimmer fullWidth rightIcon={<ArrowRight size={20} />}>
              Pesan Sekarang
            </ButtonGlow>
          </Link>
          <Link href="/track">
            <ButtonGlow variant="secondary" size="md" fullWidth>
              Lacak Pesanan
            </ButtonGlow>
          </Link>
        </div>

        {/* Floating 3D-ish stat cards */}
        <div
          className="mt-10 grid grid-cols-3 gap-3 animate-fade-up"
          style={{ animationDelay: '660ms' }}
        >
          {[
            { Icon: Trophy,   value: '500+', label: 'Tugas selesai', glow: 'glow-purple', tilt: '-2deg' },
            { Icon: Zap,      value: '< 24j', label: 'Express',       glow: 'glow-cyan',   tilt: '0deg'  },
            { Icon: Sparkles, value: '4.9★', label: 'Rating',         glow: 'glow-pink',   tilt: '2deg'  },
          ].map((s, i) => (
            <div
              key={i}
              className={`relative glass rounded-2xl p-3 border border-white/10 ${s.glow} animate-float-bob`}
              style={{
                transform: `perspective(800px) rotateY(${s.tilt})`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <s.Icon size={18} className="text-white/90 mb-1" />
              <div className="text-lg font-extrabold text-white leading-none">{s.value}</div>
              <div className="text-[10px] text-white/50 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
