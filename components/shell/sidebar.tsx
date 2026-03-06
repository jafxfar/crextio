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
import LogoText from '@/public/logo_title.svg'
const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/courses', label: 'Courses' },
  { href: '/departments', label: 'Departments' },
  { href: '/skills', label: 'Skills' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/certifications', label: 'Compliance' },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 h-18 backdrop-blur-md border-b border-border/30 flex items-center px-10 gap-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 flex-1 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="142" height="54" fill="none">
          <path fill="#000" fill-rule="evenodd" d="M22.605 9.042a49.176 49.176 0 0 1-1.865 4.54c2.881 1.616 6.265 1.802 8.527 1.183-3.428 1.852-6.065 1.852-15.557.529l.02-.014c-1.01-.132-2.09-.273-3.254-.42-6.328-1.057-13.71 4.233-8.964 10.582h16.157c4.69 0 9.025-2.499 11.388-6.562l7.258-12.483c-3.164-3.704-11.6-3.704-13.71 2.645Z" clip-rule="evenodd" />
          <path fill="#000" fill-rule="evenodd" d="M39.785 33.127a49.075 49.075 0 0 1-2.987-3.89c-2.836 1.694-4.688 4.541-5.284 6.816.115-3.904 1.433-6.195 7.32-13.78l.003.023c.619-.81 1.281-1.678 1.989-2.617 4.077-4.968 3.202-14.028-4.651-13.079l-8.08 14.039a13.263 13.263 0 0 0-.029 13.174l7.147 12.548c4.779-.897 8.997-8.228 4.572-13.234Z" clip-rule="evenodd" />
          <path fill="#000" fill-rule="evenodd" d="M10.57 35.979c1.8-.325 3.405-.537 4.85-.65-.044-3.311-1.576-6.344-3.24-8 3.311 2.053 4.63 4.343 8.234 13.252l-.021-.01c.39.942.808 1.952 1.264 3.036 2.25 6.027 10.509 9.796 13.616 2.498l-8.079-14.038a13.176 13.176 0 0 0-11.358-6.613L1.431 25.39c-1.615 4.6 2.604 11.93 9.139 10.589Z" clip-rule="evenodd" />

          <text x="55" y="33"
            font-family="Inter, Arial, sans-serif"
            font-size="20"
            font-weight="600"
            fill="black">
            Jupiter
          </text>
        </svg>
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
