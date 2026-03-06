import { DashboardShell } from '@/components/shell/dashboard-shell'
import { SkillsPanel } from '@/components/skills/SkillsPanel'
import { MetricCard } from '@/components/ui/metric-card'
import { skills } from '@/lib/data'
import { Layers, Tag, Users, Star } from 'lucide-react'

export default function SkillsPage() {
  const categories = Array.from(new Set(skills.map(s => s.category)))

  const statsByCategory = categories.map(cat => ({
    name: cat,
    count: skills.filter(s => s.category === cat).length,
  }))

  const topCategory = statsByCategory.sort((a, b) => b.count - a.count)[0]

  return (
    <DashboardShell title="Навыки" subtitle="Управление библиотекой навыков, назначенных сотрудникам и курсам">
      <div className="space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Всего навыков"
            value={skills.length}
            subtitle="По всем категориям"
            icon={<Star className="w-4 h-4 text-white" />}
            accentColor="bg-foreground"
          />
          <MetricCard
            title="Категории"
            value={categories.length}
            subtitle="Группы навыков"
            icon={<Tag className="w-4 h-4 text-white" />}
            accentColor="bg-violet-500"
          />
          <MetricCard
            title="Наибольшая категория"
            value={topCategory?.count ?? 0}
            subtitle={topCategory?.name ?? '—'}
            icon={<Layers className="w-4 h-4 text-white" />}
            accentColor="bg-blue-500"
          />
          <MetricCard
            title="Назначено пользователям"
            value="36"
            subtitle="Назначений навыков"
            icon={<Users className="w-4 h-4 text-white" />}
            accentColor="bg-emerald-500"
          />
        </div>

        {/* Skills panel */}
        <SkillsPanel />

      </div>
    </DashboardShell>
  )
}
