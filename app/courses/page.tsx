import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CoursesPage } from '@/components/course/courses'

export default function Page() {
  return (
    <DashboardShell title="Courses" subtitle="Manage training content and modules">
      <CoursesPage />
    </DashboardShell>
  )
}
