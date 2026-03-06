import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CoursesPage } from '@/components/course/courses'

export default function Page() {
  return (
    <DashboardShell title="Курсы" subtitle="Управление учебными материалами и модулями">
      <CoursesPage />
    </DashboardShell>
  )
}
