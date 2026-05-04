'use client'

import { cn, haptic } from '@/lib/utils'
import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface SheetBottomProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxHeight?: string
}

export function SheetBottom({
  open,
  onClose,
  title,
  children,
  maxHeight = '85vh',
}: SheetBottomProps) {
  useEffect(() => {
    if (!open) return
    haptic(8)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <button
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
      />
      {/* Sheet */}
      <div
        className={cn(
          'relative w-full max-w-xl glass-strong rounded-t-[2.5rem] border-t border-white/10',
          'animate-slide-up overflow-hidden flex flex-col'
        )}
        style={{ maxHeight, paddingBottom: 'var(--safe-bottom)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-2 pb-4 shrink-0">
            <h3 className="text-xl font-bold gradient-text">{title}</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full glass press flex items-center justify-center text-white/80"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {/* Content scrollable */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 no-scrollbar">{children}</div>
      </div>
    </div>
  )
}
