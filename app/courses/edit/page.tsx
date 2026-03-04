import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CourseEditorPage } from '@/components/course-editor/course-editor-page'

export default function CourseEditorRoute() {
  return (
    <DashboardShell title="Course Editor" subtitle="Machine Safety & Lockout/Tagout">
      <CourseEditorPage />
    </DashboardShell>
  )
}
