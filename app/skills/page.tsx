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
    <DashboardShell title="Skills" subtitle="Manage the skill library assigned to employees and courses">
      <div className="space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Skills"
            value={skills.length}
            subtitle="Across all categories"
            icon={<Star className="w-4 h-4 text-white" />}
            accentColor="bg-foreground"
          />
          <MetricCard
            title="Categories"
            value={categories.length}
            subtitle="Skill groupings"
            icon={<Tag className="w-4 h-4 text-white" />}
            accentColor="bg-violet-500"
          />
          <MetricCard
            title="Largest Category"
            value={topCategory?.count ?? 0}
            subtitle={topCategory?.name ?? '—'}
            icon={<Layers className="w-4 h-4 text-white" />}
            accentColor="bg-blue-500"
          />
          <MetricCard
            title="Assigned to Users"
            value="36"
            subtitle="Skill assignments"
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
