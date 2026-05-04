'use client'

import { useEffect, useRef } from 'react'

interface ConfettiLiteProps {
  trigger: boolean
  duration?: number
}

const COLORS = ['#7C3AED', '#06B6D4', '#EC4899', '#10b981', '#f59e0b']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vrot: number
  size: number
  color: string
  shape: number
  life: number
}

export function ConfettiLite({ trigger, duration = 2200 }: ConfettiLiteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.scale(dpr, dpr)

    // Spawn particles
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 3
    particlesRef.current = []
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80 + Math.random() * 0.5
      const speed = 8 + Math.random() * 6
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.4,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
        shape: Math.floor(Math.random() * 2),
        life: 1,
      })
    }

    startRef.current = performance.now()

    const tick = (t: number) => {
      const elapsed = t - startRef.current
      const progress = elapsed / duration
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = 0
      for (const p of particlesRef.current) {
        p.vy += 0.35  // gravity
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vrot
        p.life = Math.max(0, 1 - progress)
        if (p.life <= 0) continue
        alive++

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        if (p.shape === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      if (alive > 0 && progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [trigger, duration])

  if (!trigger) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200]"
      aria-hidden="true"
    />
  )
}
