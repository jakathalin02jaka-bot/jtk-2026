'use client'

import { cn } from '@/lib/utils'
import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
  useState,
} from 'react'

interface InputFloatProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const InputFloat = forwardRef<HTMLInputElement, InputFloatProps>(
  ({ label, error, leftIcon, rightIcon, className, value, onFocus, onBlur, ...rest }, ref) => {
    const id = useId()
    const [focused, setFocused] = useState(false)
    const filled = value !== undefined && value !== ''
    const float = focused || filled

    return (
      <div className="w-full">
        <div
          className={cn(
            'relative rounded-2xl glass transition-all',
            'border border-white/10',
            focused && 'border-purple/60 glow-purple',
            error && 'border-red-500/60'
          )}
        >
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            value={value}
            onFocus={(e) => { setFocused(true); onFocus?.(e) }}
            onBlur={(e) => { setFocused(false); onBlur?.(e) }}
            className={cn(
              'peer w-full bg-transparent outline-none text-white',
              'h-14 pt-5 pb-1.5',
              leftIcon ? 'pl-12' : 'pl-4',
              rightIcon ? 'pr-12' : 'pr-4',
              className
            )}
            placeholder=" "
            {...rest}
          />
          <label
            htmlFor={id}
            className={cn(
              'absolute pointer-events-none transition-all duration-200',
              'text-white/50',
              leftIcon ? 'left-12' : 'left-4',
              float
                ? 'top-1.5 text-[11px] font-medium uppercase tracking-wider text-white/60'
                : 'top-1/2 -translate-y-1/2 text-base'
            )}
          >
            {label}
          </label>
          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 ml-1 text-xs text-red-400 animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)
InputFloat.displayName = 'InputFloat'

interface TextareaFloatProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TextareaFloat = forwardRef<HTMLTextAreaElement, TextareaFloatProps>(
  ({ label, error, className, value, onFocus, onBlur, onInput, ...rest }, ref) => {
    const id = useId()
    const [focused, setFocused] = useState(false)
    const filled = value !== undefined && value !== ''
    const float = focused || filled

    return (
      <div className="w-full">
        <div
          className={cn(
            'relative rounded-2xl glass transition-all',
            'border border-white/10',
            focused && 'border-purple/60 glow-purple',
            error && 'border-red-500/60'
          )}
        >
          <textarea
            ref={ref}
            id={id}
            value={value}
            rows={3}
            onFocus={(e) => { setFocused(true); onFocus?.(e) }}
            onBlur={(e) => { setFocused(false); onBlur?.(e) }}
            onInput={(e) => {
              const t = e.currentTarget
              t.style.height = 'auto'
              t.style.height = Math.min(t.scrollHeight, 240) + 'px'
              onInput?.(e)
            }}
            className={cn(
              'peer w-full bg-transparent outline-none text-white resize-none',
              'pt-7 pb-3 px-4 min-h-[96px]',
              className
            )}
            placeholder=" "
            {...rest}
          />
          <label
            htmlFor={id}
            className={cn(
              'absolute pointer-events-none transition-all duration-200 left-4',
              'text-white/50',
              float
                ? 'top-2 text-[11px] font-medium uppercase tracking-wider text-white/60'
                : 'top-4 text-base'
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-2 ml-1 text-xs text-red-400 animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)
TextareaFloat.displayName = 'TextareaFloat'
