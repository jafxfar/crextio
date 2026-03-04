import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CertificationsPage } from '@/components/certification/certifications'

export default function Page() {
  return (
    <DashboardShell title="Compliance" subtitle="Regulatory compliance tracking and reporting">
      <CertificationsPage />
    </DashboardShell>
  )
}
