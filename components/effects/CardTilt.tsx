'use client'

import { cn } from '@/lib/utils'
import { useRef, type ReactNode, type CSSProperties } from 'react'

interface CardTiltProps {
  children: ReactNode
  className?: string
  intensity?: number
  style?: CSSProperties
}

export function CardTilt({
  children,
  className,
  intensity = 8,
  style,
}: CardTiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)

  const onMove = (clientX: number, clientY: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (clientX - rect.left) / rect.width
    const py = (clientY - rect.top) / rect.height
    const rx = (0.5 - py) * intensity
    const ry = (px - 0.5) * intensity

    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`
      }
    })
  }

  const reset = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)'
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchMove={(e) => {
        const t = e.touches[0]
        if (t) onMove(t.clientX, t.clientY)
      }}
      onTouchEnd={reset}
      className={cn('transition-transform duration-200 ease-out will-change-transform', className)}
      style={{ transformStyle: 'preserve-3d', ...style }}
    >
      {children}
    </div>
  )
}
