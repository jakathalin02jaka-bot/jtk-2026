import Link from 'next/link'
import { Reveal } from '@/components/effects/Reveal'
import { ButtonGlow } from '@/components/ui/ButtonGlow'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative py-12 px-5">
      <Reveal>
        <div className="relative rounded-4xl overflow-hidden p-8 text-center">
          {/* Layered glass + gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple via-pink/40 to-cyan opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />

          <div className="relative">
            <div className="text-xs font-bold tracking-[0.25em] text-white/80 uppercase mb-3">
              ✦ Siap mulai?
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Tugasmu, kelarin
              <br />
              hari ini juga.
            </h2>
            <p className="text-sm text-white/85 mt-3 leading-relaxed">
              Booking sekarang, dapat respon &lt; 10 menit.
              <br />
              Garansi revisi sampai puas.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <Link href="/booking">
                <ButtonGlow
                  variant="secondary"
                  size="lg"
                  fullWidth
                  shimmer
                  rightIcon={<ArrowRight size={20} />}
                  className="!bg-white !text-purple-700 !border-white"
                >
                  Pesan Sekarang
                </ButtonGlow>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
