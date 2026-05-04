import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ProgressOrbProps {
  /** 0 = pending, 1 = confirmed, 2 = completed, -1 = cancelled */
  step: number
  labels?: [string, string, string]
}

export function ProgressOrb({
  step,
  labels = ['Diterima', 'Dikerjakan', 'Selesai'],
}: ProgressOrbProps) {
  const isCancelled = step === -1
  const safeStep = Math.max(0, step)

  return (
    <div className="relative w-full">
      {/* Connecting line */}
      <div className="absolute top-7 left-[14%] right-[14%] h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            isCancelled
              ? 'bg-gradient-to-r from-red-500 to-pink-500'
              : 'bg-gradient-to-r from-purple via-cyan to-emerald-400'
          )}
          style={{ width: `${(safeStep / 2) * 100}%` }}
        />
      </div>

      <div className="relative flex justify-between">
        {labels.map((label, i) => {
          const active = !isCancelled && i <= safeStep
          const current = !isCancelled && i === safeStep
          return (
            <div key={i} className="flex flex-col items-center gap-3 w-1/3">
              <div className="relative">
                {current && (
                  <span className="absolute inset-0 rounded-full bg-cyan/40 animate-[pulse-ring_2s_ease-out_infinite]" />
                )}
                <div
                  className={cn(
                    'relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg',
                    'transition-all duration-500',
                    'shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3)]',
                    active && !isCancelled && 'bg-gradient-to-br from-purple to-cyan text-white glow-cyan',
                    !active && !isCancelled && 'bg-white/5 text-white/30 border border-white/10',
                    isCancelled && 'bg-gradient-to-br from-red-500 to-pink-500 text-white glow-red'
                  )}
                >
                  {active && i < safeStep ? <Check size={22} /> : isCancelled ? '×' : i + 1}
                </div>
              </div>
              <span
                className={cn(
                  'text-xs font-medium text-center',
                  active && !isCancelled && 'text-white',
                  !active && !isCancelled && 'text-white/40',
                  isCancelled && 'text-red-300'
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
