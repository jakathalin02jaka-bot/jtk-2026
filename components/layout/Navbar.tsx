'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (y > 80 && y > lastY) setHidden(true)
      else setHidden(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div
        className={cn(
          'mx-auto max-w-xl px-4 pt-3 pb-2 transition-all',
          scrolled && 'bg-surface-0/70 backdrop-blur-2xl'
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 press">
            <span className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-purple to-cyan flex items-center justify-center glow-purple">
              <Sparkles size={20} className="text-white" />
            </span>
            <div className="leading-tight">
              <div className="font-extrabold text-base gradient-text">Joki Kilat</div>
              <div className="text-[10px] text-white/50 -mt-0.5 tracking-wider uppercase">
                Tugas Selesai Tepat Waktu
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
