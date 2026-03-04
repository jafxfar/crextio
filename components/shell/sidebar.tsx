'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Settings,
  Bell,
  GraduationCap,
} from 'lucide-react'
import { Avatar } from '../ui/avatar'
import { cn } from '@/lib/utils'
import { AvatarImage } from '@radix-ui/react-avatar'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/courses', label: 'Courses' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/compliance', label: 'Compliance' },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 h-18 backdrop-blur-md border-b border-border/30 flex items-center px-10 gap-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 flex-1 shrink-0">
        <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-background" />
        </div>
        <span className="text-[15px] font-semibold text-foreground tracking-tight">CREXTIO</span>
      </Link>

      {/* Pill nav — centered */}
      <nav className="flex bg-white items-center gap-2 rounded-full justify-center">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Settings with text */}
        <Link href="/settings" className="flex bg-white rounded-full px-6 py-3 items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-4.5 h-4.5" />
          <span className="text-[15px] font-medium">Setting</span>
        </Link>

        {/* Notifications with yellow dot */}
        <button className="relative flex bg-white rounded-full px-[14.25px] py-[14.25px] text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-[11px] right-[11px] w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Avatar */}
        <button className="w-[46.5px] h-[46.5px] rounded-full bg-white flex items-center justify-center">
          <Avatar className="w-full h-full rounded-full">
            <AvatarImage src={"https://avatars.githubusercontent.com/u/12345678?v=4"} />
          </Avatar >
        </button>
      </div>
    </header>
  )
}
