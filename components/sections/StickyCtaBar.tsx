'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn, haptic } from '@/lib/utils'

export function StickyCtaBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-30 transition-all duration-400',
        show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}
      style={{ bottom: 'calc(var(--safe-bottom) + 88px)' }}
    >
      <div className="mx-auto max-w-xl px-4">
        <Link
          href="/booking"
          onClick={() => haptic(10)}
          className="group relative block w-full h-14 rounded-2xl overflow-hidden press"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple via-pink to-cyan glow-purple" />
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2.5s_linear_infinite]"
            style={{ backgroundSize: '200% 100%' }}
          />
          <span className="relative flex items-center justify-center gap-2 h-full text-white font-bold">
            Pesan Sekarang
            <ArrowRight size={18} />
          </span>
        </Link>
      </div>
    </div>
  )
}
