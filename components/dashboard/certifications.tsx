'use client'

import {
  certifications, users, courses, departments, departmentStats,
  globalComplianceRate, failedAttempts,
} from '@/lib/data'
import { SectionCard } from '@/components/ui/metric-card'
import { CertBadge } from '@/components/ui/status-badge'
import {
  Award, ShieldCheck, AlertTriangle, XCircle, CheckCircle2,
  Clock, TrendingUp, TrendingDown, Download, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// Mock compliance trend over months
const complianceTrend = [
  { month: 'Aug', rate: 76 },
  { month: 'Sep', rate: 78 },
  { month: 'Oct', rate: 80 },
  { month: 'Nov', rate: 79 },
  { month: 'Dec', rate: 82 },
  { month: 'Jan', rate: 83 },
]

function ComplianceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={complianceTrend}>
        <defs>
          <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.82 0.165 90)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="oklch(0.82 0.165 90)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
        <Tooltip
          contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: 12 }}
          formatter={(v: number) => [`${v}%`, 'Compliance Rate']}
        />
        <Area type="monotone" dataKey="rate" stroke="oklch(0.82 0.165 90)" strokeWidth={2.5} fill="url(#compGrad)" dot={{ fill: 'oklch(0.14 0.012 60)', strokeWidth: 0, r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function DeptComplianceRow({ stat }: { stat: typeof departmentStats[0] }) {
  const { department, complianceRate, completedUsers, overdueUsers } = stat
  const color =
    complianceRate >= 90 ? 'bg-emerald-500' :
    complianceRate >= 75 ? 'bg-primary' :
    'bg-amber-500'
  const badge =
    complianceRate >= 90 ? { label: 'Compliant', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' } :
    complianceRate >= 75 ? { label: 'On Track', bg: 'bg-blue-50 text-blue-700 border-blue-200' } :
    { label: 'At Risk', bg: 'bg-amber-50 text-amber-700 border-amber-200' }

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors border-b border-border last:border-0">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: department.color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground">{department.name}</span>
          <span className="text-sm font-bold text-foreground">{complianceRate}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full', color)} style={{ width: `${complianceRate}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 text-xs text-muted-foreground">
        <span className="hidden md:flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{completedUsers}</span>
        <span className="hidden md:flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" />{overdueUsers}</span>
        <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border', badge.bg)}>{badge.label}</span>
      </div>
    </div>
  )
}

function CertificationRow({ cert }: { cert: typeof certifications[0] }) {
  const user = users.find(u => u.id === cert.userId)
  const course = courses.find(c => c.id === cert.courseId)
  const dept = departments.find(d => d.id === user?.departmentId)

  const daysLeft = Math.ceil((new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/40 transition-colors border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: dept?.color || '#6B7280' }}
        >
          {user?.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{course?.certificationName}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden md:block text-right">
          <p className="text-[11px] text-muted-foreground font-mono">{cert.certNumber}</p>
          <p className="text-[11px] text-muted-foreground">
            Expires {cert.expiresAt}
            {daysLeft > 0 && daysLeft < 90 && (
              <span className="text-amber-600 ml-1">({daysLeft}d)</span>
            )}
          </p>
        </div>
        <CertBadge status={cert.status} />
        <button className="w-7 h-7 rounded-[8px] bg-secondary hover:bg-accent flex items-center justify-center transition-colors">
          <Download className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

export function CertificationsPage() {
  const valid = certifications.filter(c => c.status === 'valid').length
  const expiring = certifications.filter(c => c.status === 'expiring_soon').length
  const expired = certifications.filter(c => c.status === 'expired').length
  const notEarned = certifications.filter(c => c.status === 'not_earned').length

  return (
    <div className="space-y-5">

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Valid Certs', value: valid, icon: <CheckCircle2 className="w-4 h-4 text-white" />, bg: 'bg-emerald-500' },
          { label: 'Expiring Soon', value: expiring, icon: <Clock className="w-4 h-4 text-white" />, bg: 'bg-amber-500' },
          { label: 'Expired', value: expired, icon: <XCircle className="w-4 h-4 text-white" />, bg: 'bg-red-500' },
          { label: 'Global Compliance', value: `${globalComplianceRate}%`, icon: <ShieldCheck className="w-4 h-4 text-primary-foreground" />, bg: 'bg-nav-pill' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-[16px] border border-border p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex items-center gap-4">
            <div className={cn('w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0', stat.bg)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Compliance trend */}
        <SectionCard
          title="Compliance Rate Trend"
          subtitle="6-month rolling average"
          action={
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +7% since Aug
            </span>
          }
        >
          <ComplianceTrendChart />
        </SectionCard>

        {/* Department compliance */}
        <SectionCard title="Compliance by Department" subtitle="Current period" noPadding>
          {departmentStats.map(stat => (
            <DeptComplianceRow key={stat.department.id} stat={stat} />
          ))}
        </SectionCard>

      </div>

      {/* Certifications table */}
      <SectionCard
        title="Active Certifications"
        subtitle={`${certifications.length} issued certificates`}
        noPadding
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-[10px] text-xs font-medium hover:bg-primary/90 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        }
      >
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-secondary border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Employee / Certificate</span>
          <span className="hidden md:block">Cert Number · Expiry</span>
          <span>Status</span>
        </div>
        {certifications.map(cert => (
          <CertificationRow key={cert.id} cert={cert} />
        ))}
      </SectionCard>

      {/* Failed attempts remediation */}
      <SectionCard
        title="Remediation Required"
        subtitle="Employees who have failed and need follow-up"
        noPadding
        action={
          <span className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium border border-red-200">
            <AlertTriangle className="w-3 h-3" /> {failedAttempts.length} employees
          </span>
        }
      >
        <div className="flex items-center gap-4 px-5 py-2.5 bg-secondary border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          <span className="flex-1">Employee · Course</span>
          <span className="hidden md:block w-24">Score</span>
          <span className="w-20">Attempts</span>
          <span className="w-24">Action</span>
        </div>
        <div className="divide-y divide-border">
          {failedAttempts.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-red-700">{item.userName.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.courseTitle}</p>
                </div>
              </div>
              <div className="hidden md:block w-24">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-red-600">{item.score}%</span>
                  <span className="text-xs text-muted-foreground">/ {item.passingScore}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: `${(item.score / item.passingScore) * 100}%` }} />
                </div>
              </div>
              <div className="w-20 flex items-center gap-1">
                {Array.from({ length: Math.min(item.attempts, 5) }).map((_, j) => (
                  <div key={j} className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                ))}
                <span className="text-xs text-muted-foreground">{item.attempts}x</span>
              </div>
              <div className="w-24">
                <button className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/10 text-primary rounded-[8px] text-[11px] font-medium hover:bg-primary/20 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Re-assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

    </div>
  )
}
