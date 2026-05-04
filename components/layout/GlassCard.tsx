import { cn } from '@/lib/utils'
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'neu' | 'gradient-border'
  glow?: 'none' | 'purple' | 'cyan' | 'pink' | 'green' | 'amber' | 'red'
  children: ReactNode
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', glow = 'none', className, children, ...rest }, ref) => {
    const base = 'rounded-3xl p-5 transition-all'
    const variants = {
      'default':         'glass',
      'strong':          'glass-strong',
      'neu':             'neu',
      'gradient-border': 'gradient-border',
    }
    const glows = {
      none:   '',
      purple: 'glow-purple',
      cyan:   'glow-cyan',
      pink:   'glow-pink',
      green:  'glow-green',
      amber:  'glow-amber',
      red:    'glow-red',
    }
    return (
      <div
        ref={ref}
        className={cn(base, variants[variant], glows[glow], className)}
        {...rest}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = 'GlassCard'
