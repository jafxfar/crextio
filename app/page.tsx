import { DashboardShell } from '@/components/shell/dashboard-shell'
import { DashboardOverview } from '@/components/dashboard/overview'

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Hello, Admin"
      subtitle="ForgeLearn Enterprise · Q1 2025 Overview"
    >
      <DashboardOverview />
    </DashboardShell>
  )
}
