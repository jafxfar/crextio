import { DashboardShell } from '@/components/shell/dashboard-shell'
import { CertificatesManagement } from '@/components/certificates/CertificatesManagement'
import { MetricCard } from '@/components/ui/metric-card'
import { certifications, certificateTemplates } from '@/lib/data'
import { Award, CheckCircle2, Clock, XCircle } from 'lucide-react'

export default function CertificatesPage() {
  const valid = certifications.filter(c => c.status === 'valid').length
  const expiring = certifications.filter(c => c.status === 'expiring_soon').length
  const expired = certifications.filter(c => c.status === 'expired').length

  return (
    <DashboardShell title="Сертификаты" subtitle="Управление шаблонами сертификатов и учёт выданных сертификатов">
      <div className="space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Шаблоны"
            value={certificateTemplates.length}
            subtitle="Типы сертификатов"
            icon={<Award className="w-4 h-4 text-white" />}
            accentColor="bg-amber-500"
          />
          <MetricCard
            title="Действующие"
            value={valid}
            subtitle="Активные сертификаты"
            icon={<CheckCircle2 className="w-4 h-4 text-white" />}
            accentColor="bg-emerald-500"
          />
          <MetricCard
            title="Истекают скоро"
            value={expiring}
            subtitle="В течение 30 дней"
            icon={<Clock className="w-4 h-4 text-white" />}
            accentColor="bg-amber-400"
          />
          <MetricCard
            title="Истекшие"
            value={expired}
            subtitle="Требуют продления"
            icon={<XCircle className="w-4 h-4 text-white" />}
            accentColor="bg-red-500"
          />
        </div>

        <CertificatesManagement />

      </div>
    </DashboardShell>
  )
}
