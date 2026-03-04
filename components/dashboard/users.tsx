'use client'

import { useState } from 'react'
import { users, departments, userProgressData } from '@/lib/data'
import { SectionCard } from '@/components/ui/metric-card'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Trophy, Zap, Search, BookOpen, Award, Users,
  ChevronUp, ChevronDown, Crown, Medal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const RANK_CONFIG = [
  { bg: 'bg-amber-400', text: 'text-white', icon: <Crown className="w-3 h-3" /> },
  { bg: 'bg-gray-400', text: 'text-white', icon: <Medal className="w-3 h-3" /> },
  { bg: 'bg-amber-700', text: 'text-white', icon: <Medal className="w-3 h-3" /> },
]

function XPBar({ xp, maxXP }: { xp: number; maxXP: number }) {
  const pct = (xp / maxXP) * 100
  const color =
    pct > 85 ? 'bg-emerald-500' :
    pct > 60 ? 'bg-primary' :
    pct > 40 ? 'bg-amber-400' : 'bg-stone-300'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-medium text-muted-foreground w-10 text-right">
        {(xp / 1000).toFixed(1)}k
      </span>
    </div>
  )
}

function RoleChip({ role }: { role: 'admin' | 'manager' | 'employee' }) {
  const map = {
    admin:    'bg-purple-50 text-purple-700 border-purple-200',
    manager:  'bg-blue-50 text-blue-700 border-blue-200',
    employee: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border', map[role])}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  )
}

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'xp' | 'completed' | 'certs'>('xp')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

  const maxXP = Math.max(...users.map(u => u.xp))

  const sorted = [...users]
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const vals = {
        xp: [a.xp, b.xp],
        completed: [a.completedCourses, b.completedCourses],
        certs: [a.certifications, b.certifications],
      }
      const [av, bv] = vals[sortBy]
      return sortDir === 'desc' ? bv - av : av - bv
    })

  function toggleSort(field: typeof sortBy) {
    if (sortBy === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(field); setSortDir('desc') }
  }

  function SortIcon({ field }: { field: typeof sortBy }) {
    if (sortBy !== field) return <ChevronUp className="w-3 h-3 opacity-30" />
    return sortDir === 'desc' ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronUp className="w-3 h-3 text-primary" />
  }

  // Top 3 podium
  const top3 = users.slice(0, 3)

  return (
    <div className="space-y-5">

      {/* XP Podium */}
      <SectionCard title="Top Performers — XP Leaderboard" subtitle="Quarter to date · Q1 2025">
        <div className="flex items-end justify-center gap-4 pt-4 pb-2">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">{top3[1].avatarInitials}</span>
            </div>
            <div className="bg-gray-100 border border-gray-200 rounded-t-xl w-20 h-20 flex flex-col items-center justify-center gap-1">
              <Medal className="w-4 h-4 text-gray-500" />
              <p className="text-xs font-bold text-gray-600">2nd</p>
              <p className="text-[10px] text-gray-500">{(top3[1].xp/1000).toFixed(1)}k XP</p>
            </div>
            <p className="text-xs font-medium text-foreground text-center w-20 truncate">{top3[1].name.split(' ')[0]}</p>
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center ring-2 ring-amber-400">
              <span className="text-sm font-bold text-amber-700">{top3[0].avatarInitials}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-t-xl w-24 h-28 flex flex-col items-center justify-center gap-1">
              <Crown className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-bold text-amber-700">1st</p>
              <p className="text-[11px] font-semibold text-amber-600">{(top3[0].xp/1000).toFixed(1)}k XP</p>
            </div>
            <p className="text-xs font-semibold text-foreground text-center w-24 truncate">{top3[0].name.split(' ')[0]}</p>
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center">
              <span className="text-sm font-bold text-amber-900">{top3[2].avatarInitials}</span>
            </div>
            <div className="bg-amber-900/5 border border-amber-900/20 rounded-t-xl w-20 h-16 flex flex-col items-center justify-center gap-1">
              <Medal className="w-4 h-4 text-amber-800" />
              <p className="text-xs font-bold text-amber-800">3rd</p>
              <p className="text-[10px] text-amber-700">{(top3[2].xp/1000).toFixed(1)}k XP</p>
            </div>
            <p className="text-xs font-medium text-foreground text-center w-20 truncate">{top3[2].name.split(' ')[0]}</p>
          </div>
        </div>
      </SectionCard>

      {/* Users table */}
      <SectionCard
        title="All Users"
        subtitle={`${users.length} active employees`}
        noPadding
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-32"
              />
            </div>
          </div>
        }
      >
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-4 px-5 py-2.5 bg-secondary border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Employee</span>
          <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort('xp')}>
            XP Score <SortIcon field="xp" />
          </button>
          <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort('completed')}>
            Courses <SortIcon field="completed" />
          </button>
          <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort('certs')}>
            Certs <SortIcon field="certs" />
          </button>
          <span>Progress</span>
        </div>

        <div className="divide-y divide-border">
          {sorted.map((user, i) => {
            const dept = departments.find(d => d.id === user.departmentId)
            const completionPct = Math.round((user.completedCourses / user.totalCourses) * 100)
            return (
              <div
                key={user.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-4 px-5 py-3.5 items-center hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                {/* Employee */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: dept?.color || '#6B7280' }}
                    >
                      {user.avatarInitials}
                    </div>
                    {user.rank <= 3 && (
                      <div className={cn(
                        'absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center',
                        user.rank === 1 ? 'bg-amber-400' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-700',
                      )}>
                        <span className="text-[8px] font-bold text-white">{user.rank}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <RoleChip role={user.role} />
                      <span className="text-[11px] text-muted-foreground truncate">{dept?.name}</span>
                    </div>
                  </div>
                </div>

                {/* XP */}
                <div>
                  <p className="text-sm font-bold text-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />{user.xp.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Rank #{user.rank}</p>
                </div>

                {/* Courses */}
                <div>
                  <p className="text-sm font-medium text-foreground">{user.completedCourses}/{user.totalCourses}</p>
                  <p className="text-[11px] text-muted-foreground">{completionPct}% done</p>
                </div>

                {/* Certifications */}
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">{user.certifications}</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                    <div
                      className={cn('h-full rounded-full', completionPct >= 90 ? 'bg-emerald-500' : completionPct >= 60 ? 'bg-primary' : 'bg-amber-500')}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{completionPct}% complete</p>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

    </div>
  )
}
