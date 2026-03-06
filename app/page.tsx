import { DashboardShell } from '@/components/shell/dashboard-shell'
import { DashboardOverview } from '@/components/dashboard/overview'

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Добро пожаловать, Администратор"
      subtitle="Система работает в штатном режиме. Вот что происходит в вашей компании сегодня."
    >
      <DashboardOverview />
    </DashboardShell>
  )
}
