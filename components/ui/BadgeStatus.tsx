import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/lib/types'
import { Clock, CheckCircle2, Sparkles, XCircle } from 'lucide-react'

interface BadgeStatusProps {
  status: BookingStatus
  size?: 'sm' | 'md'
  className?: string
}

const config = {
  Pending:   { label: 'Pending',     color: 'amber', glow: 'glow-amber', Icon: Clock },
  Confirmed: { label: 'Dikonfirmasi', color: 'cyan',  glow: 'glow-cyan',  Icon: Sparkles },
  Completed: { label: 'Selesai',     color: 'green', glow: 'glow-green', Icon: CheckCircle2 },
  Cancelled: { label: 'Dibatalkan',  color: 'red',   glow: 'glow-red',   Icon: XCircle },
} as const

export function BadgeStatus({ status, size = 'sm', className }: BadgeStatusProps) {
  const c = config[status]
  const Icon = c.Icon
  const colorClasses = {
    amber: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
    cyan:  'border-cyan-400/40 text-cyan-300 bg-cyan-500/10',
    green: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
    red:   'border-red-400/40 text-red-300 bg-red-500/10',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        colorClasses[c.color as keyof typeof colorClasses],
        c.glow,
        size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm',
        className
      )}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      {c.label}
    </span>
  )
}
