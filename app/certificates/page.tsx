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
    <DashboardShell title="Certificates" subtitle="Manage certificate templates and track issued certificates">
      <div className="space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Templates"
            value={certificateTemplates.length}
            subtitle="Defined certificate types"
            icon={<Award className="w-4 h-4 text-white" />}
            accentColor="bg-amber-500"
          />
          <MetricCard
            title="Valid"
            value={valid}
            subtitle="Active certificates"
            icon={<CheckCircle2 className="w-4 h-4 text-white" />}
            accentColor="bg-emerald-500"
          />
          <MetricCard
            title="Expiring Soon"
            value={expiring}
            subtitle="Within 30 days"
            icon={<Clock className="w-4 h-4 text-white" />}
            accentColor="bg-amber-400"
          />
          <MetricCard
            title="Expired"
            value={expired}
            subtitle="Need renewal"
            icon={<XCircle className="w-4 h-4 text-white" />}
            accentColor="bg-red-500"
          />
        </div>

        <CertificatesManagement />

      </div>
    </DashboardShell>
  )
}
