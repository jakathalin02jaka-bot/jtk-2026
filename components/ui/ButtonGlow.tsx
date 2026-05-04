'use client'

import { cn, haptic } from '@/lib/utils'
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'

interface ButtonGlowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  shimmer?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

export const ButtonGlow = forwardRef<HTMLButtonElement, ButtonGlowProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      shimmer = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      onClick,
      disabled,
      ...rest
    },
    ref
  ) => {
    const sizes = {
      sm: 'h-11 px-4 text-sm rounded-2xl',
      md: 'h-14 px-6 text-base rounded-2xl',
      lg: 'h-16 px-8 text-lg rounded-3xl',
    }

    const variants = {
      primary:
        'text-white bg-gradient-to-r from-purple to-cyan glow-purple hover:glow-pink',
      secondary:
        'text-white glass border border-white/10 hover:border-white/20',
      ghost:
        'text-white/80 bg-white/5 hover:bg-white/10',
      danger:
        'text-white bg-gradient-to-r from-red-500 to-pink-500 glow-red',
      success:
        'text-white bg-gradient-to-r from-emerald-500 to-cyan-500 glow-green',
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={(e) => {
          if (!disabled) haptic(8)
          onClick?.(e)
        }}
        className={cn(
          'relative overflow-hidden font-semibold press',
          'inline-flex items-center justify-center gap-2',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
          'active:scale-[0.97]',
          sizes[size],
          variants[variant],
          fullWidth && 'w-full',
          className
        )}
        {...rest}
      >
        {shimmer && !disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent"
            style={{ backgroundSize: '200% 100%' }}
          />
        )}
        {leftIcon && <span className="relative z-10 shrink-0">{leftIcon}</span>}
        <span className="relative z-10">{children}</span>
        {rightIcon && <span className="relative z-10 shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)
ButtonGlow.displayName = 'ButtonGlow'
