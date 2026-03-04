'use client'

import {
  certifications, departmentStats,
  globalComplianceRate, failedAttempts,
} from '@/lib/data'
import { cn } from '@/lib/utils'
import { SectionCard } from '@/components/ui/metric-card'
import {
  Clock, TrendingUp, Download, RefreshCw,
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2
} from 'lucide-react'

import { CertificationRow } from '@/components/compliance/CertificationRow'
import { DeptComplianceRow } from '@/components/compliance/DeptComplianceRow'
import { ComplianceTrendChart } from '@/components/compliance/ComplianceTrendChart'

export function CertificationsPage() {
  const valid = certifications.filter(c => c.status === 'valid').length
  const expiring = certifications.filter(c => c.status === 'expiring_soon').length
  const expired = certifications.filter(c => c.status === 'expired').length

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
