import { cn } from '@/lib/utils'

interface MeshGradientProps {
  className?: string
  variant?: 'full' | 'subtle'
}

export function MeshGradient({ className, variant = 'full' }: MeshGradientProps) {
  return (
    <div
      className={cn(
        'mesh-bg',
        variant === 'subtle' && 'opacity-50',
        className
      )}
      aria-hidden="true"
    >
      <div className="blob-3" />
    </div>
  )
}
