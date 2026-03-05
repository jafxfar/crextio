'use client'

import { TopNav } from './sidebar'

interface DashboardShellProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  return (
    <div className="min-h-screen w-full " style={{ background: 'linear-gradient(150deg, #e3e4e6 30%, #ddff00 100%)' }}>
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}
