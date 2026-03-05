import { DashboardShell } from '@/components/shell/dashboard-shell'
import { DashboardOverview } from '@/components/dashboard/overview'

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Hello, Admin"
      subtitle="Jupiter is running smoothly. Here's what's happening with your company today."
    >
      <DashboardOverview />
    </DashboardShell>
  )
}
