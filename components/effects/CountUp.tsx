'use client'

import { useEffect, useRef, useState } from 'react'
import { formatRupiah } from '@/lib/utils'

interface CountUpProps {
  value: number
  duration?: number
  format?: 'rupiah' | 'number'
  className?: string
}

export function CountUp({
  value,
  duration = 600,
  format = 'rupiah',
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    const start = performance.now()

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3)
      const v = from + (to - from) * eased
      setDisplay(Math.round(v))
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return (
    <span className={className}>
      {format === 'rupiah' ? formatRupiah(display) : display.toLocaleString('id-ID')}
    </span>
  )
}
