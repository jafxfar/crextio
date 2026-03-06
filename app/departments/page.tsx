import { DashboardShell } from '@/components/shell/dashboard-shell'
import { DepartmentsPanel } from '@/components/departments/DepartmentsPanel'
import { MetricCard } from '@/components/ui/metric-card'
import { departments, users, departmentStats } from '@/lib/data'
import { Building2, Users, TrendingUp, ShieldCheck } from 'lucide-react'

export default function DepartmentsPage() {
  const totalHeadcount = departments.reduce((sum, d) => sum + d.headcount, 0)
  const avgCompliance = Math.round(
    departmentStats.reduce((sum, s) => sum + s.complianceRate, 0) / departmentStats.length,
  )
  const topDept = departmentStats.sort((a, b) => b.complianceRate - a.complianceRate)[0]

  return (
    <DashboardShell title="Отделы" subtitle="Управление организационными отделами и просмотр соответствия по командам">
      <div className="space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Отделы"
            value={departments.length}
            subtitle="Активные отделы"
            icon={<Building2 className="w-4 h-4 text-white" />}
            accentColor="bg-foreground"
          />
          <MetricCard
            title="Всего сотрудников"
            value={totalHeadcount}
            subtitle="Все сотрудники"
            icon={<Users className="w-4 h-4 text-white" />}
            accentColor="bg-blue-500"
          />
          <MetricCard
            title="Ср. соответствие"
            value={`${avgCompliance}%`}
            subtitle="По всем отделам"
            icon={<TrendingUp className="w-4 h-4 text-white" />}
            accentColor="bg-emerald-500"
          />
          <MetricCard
            title="Лучший отдел"
            value={`${topDept.complianceRate}%`}
            subtitle={topDept.department.name}
            icon={<ShieldCheck className="w-4 h-4 text-white" />}
            accentColor="bg-violet-500"
          />
        </div>

        {/* Departments panel */}
        <DepartmentsPanel />

      </div>
    </DashboardShell>
  )
}
