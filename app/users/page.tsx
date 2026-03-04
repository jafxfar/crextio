import { DashboardShell } from '@/components/shell/dashboard-shell'
import { Podium } from '@/components/users/Podium'
import { UserTable } from "@/components/users/UserTable";
import { users, departments } from '@/lib/data'

export default function Page() {

  const top3 = users.slice(0, 3)

  return (
    <DashboardShell title="Users & XP" subtitle="Employee performance and leaderboard">
      <div className="space-y-5">

        <Podium users={top3} />

        <UserTable users={users} departments={departments} />

      </div>
    </DashboardShell>
  )
}
