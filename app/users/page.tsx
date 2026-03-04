import { DashboardShell } from '@/components/shell/dashboard-shell'
import { UsersPage } from '@/components/dashboard/users'

export default function Page() {
  return (
    <DashboardShell title="Users & XP" subtitle="Employee performance and leaderboard">
      <UsersPage />
    </DashboardShell>
  )
}
