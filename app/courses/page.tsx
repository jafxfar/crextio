import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CoursesPage } from '@/components/dashboard/courses'

export default function Page() {
  return (
    <DashboardShell title="Courses" subtitle="Manage training content and modules">
      <CoursesPage />
    </DashboardShell>
  )
}
