'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FilePlus, Search, ListChecks, Shield } from 'lucide-react'
import { cn, haptic } from '@/lib/utils'

const tabs = [
  { href: '/',            label: 'Home',    Icon: Home },
  { href: '/booking',     label: 'Pesan',   Icon: FilePlus },
  { href: '/track',       label: 'Lacak',   Icon: Search },
  { href: '/my-bookings', label: 'Saya',    Icon: ListChecks },
  { href: '/admin',       label: 'Admin',   Icon: Shield },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mx-auto max-w-xl px-3 pb-3 pt-2">
        <div className="glass-strong rounded-3xl px-2 py-2 border border-white/10">
          <ul className="flex items-center justify-between">
            {tabs.map(({ href, label, Icon }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <li key={href} className="flex-1">
                  <Link
                    href={href}
                    onClick={() => haptic(6)}
                    className={cn(
                      'group relative flex flex-col items-center justify-center gap-0.5',
                      'h-14 rounded-2xl press transition-all',
                      active && 'bg-gradient-to-br from-purple/25 to-cyan/15'
                    )}
                  >
                    {active && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-purple to-cyan glow-purple" />
                    )}
                    <Icon
                      size={20}
                      className={cn(
                        'transition-colors',
                        active ? 'text-white' : 'text-white/50'
                      )}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-semibold tracking-wide transition-colors',
                        active ? 'text-white' : 'text-white/50'
                      )}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}
