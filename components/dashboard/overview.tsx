'use client'

import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

import { TrendingUp } from 'lucide-react'
import { LeaderboardList } from './LeaderboardList';
import { departmentStats, globalComplianceRate } from '@/lib/data'
import { SectionCard } from '@/components/ui/metric-card'

import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import { DeptComplianceRow } from '@/components/compliance/DeptComplianceRow'
import { ComplianceTrendChart } from '@/components/compliance/ComplianceTrendChart'

function StatPills() {
  const stats = [
    { label: 'Соответствие', value: `${globalComplianceRate}%`, pill: true, dark: true },
    { label: 'Нанято', value: '51%', pill: true },
    { label: 'Время проекта', value: '15%', pill: false },
    { label: 'Выработка', value: '4%', pill: false },
  ]

  return (
    <div className="flex items-center gap-3 flex-wrap mb-8">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{s.label}</span>
          <span className={cn(
            'px-4 py-1.5 rounded-full text-sm font-semibold',
            s.dark
              ? 'bg-nav-pill text-white'
              : 'bg-[#ddff00] text-primary-foreground',
          )}>
            {s.value}
          </span>
        </div>
      ))}
      {/* Big stat numbers (Crextio right side) */}
      <div className="ml-auto flex items-center gap-6">
        {[
          { n: 427, label: 'Сотрудники' },
          { n: 26, label: 'Просрочено' },
          { n: 8, label: 'Курсы' },
        ].map(({ n, label }) => (
          <div key={label} className="text-right">
            <p className="text-2xl font-bold text-foreground leading-none">{n}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <StatPills />
      <div className="grid grid-cols-12 gap-4 md:gap-6 p-4">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <SectionCard
            title="Динамика соответствия"
            subtitle="Скользящее среднее за 6 месяцев"
            action={
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium border border-emerald-200">
                <TrendingUp className="w-3 h-3" /> +7% с августа
              </span>
            }
          >
            <ComplianceTrendChart />
          </SectionCard>

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
        <div className="col-span-12 xl:col-span-6">

          <SectionCard title="Соответствие по отделам" subtitle="Текущий период" noPadding>
            {departmentStats.map(stat => (
              <DeptComplianceRow key={stat.department.id} stat={stat} />
            ))}
          </SectionCard>
        </div>
        <div className="col-span-12 xl:col-span-6">
          <SectionCard
            title="Таблица лидеров XP"
            subtitle="Лучшие сотрудники квартала"
            action={
              <span className="inline-flex items-center gap-1 text-[11px] bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium">
                <Trophy className="w-3 h-3" /> Q1 2025
              </span>
            }
          >
            <LeaderboardList />
          </SectionCard>
        </div>
      </div>
    </div >
  )
}
