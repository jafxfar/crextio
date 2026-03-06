import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CertificationsPage } from '@/components/certification/certifications'

export default function Page() {
  return (
    <DashboardShell title="Соответствие" subtitle="Отслеживание сертификатов и статус соответствия">
      <CertificationsPage />
    </DashboardShell>
  )
}
