import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CertificationsPage } from '@/components/dashboard/certifications'

export default function Page() {
  return (
    <DashboardShell title="Certifications" subtitle="Certificate tracking and compliance status">
      <CertificationsPage />
    </DashboardShell>
  )
}
