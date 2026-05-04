'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  stagger?: boolean
  delay?: number
  style?: CSSProperties
}

export function Reveal({ children, className, stagger = false, delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in-view')
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('in-view'), delay)
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(stagger ? 'stagger' : 'reveal', className)}
      style={style}
    >
      {children}
    </div>
  )
}
