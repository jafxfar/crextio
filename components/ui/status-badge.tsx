import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, XCircle, AlertTriangle, Info, CircleDot } from 'lucide-react'
import type { EnrollmentStatus, CertificationStatus, CourseStatus } from '@/lib/data'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'

const variantConfig: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  warning: { bg: 'bg-amber-50 border border-amber-200',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  danger:  { bg: 'bg-red-50 border border-red-200',       text: 'text-red-700',     dot: 'bg-red-500' },
  info:    { bg: 'bg-sky-50 border border-sky-200',       text: 'text-sky-700',     dot: 'bg-sky-500' },
  neutral: { bg: 'bg-stone-100 border border-stone-200',  text: 'text-stone-600',   dot: 'bg-stone-400' },
  primary: { bg: 'bg-primary/15 border border-primary/30', text: 'text-foreground', dot: 'bg-primary' },
}

interface StatusBadgeProps {
  variant: BadgeVariant
  label: string
  className?: string
  showDot?: boolean
}

export function StatusBadge({ variant, label, className, showDot = true }: StatusBadgeProps) {
  const config = variantConfig[variant]
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium',
      config.bg, config.text, className,
    )}>
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />}
      {label}
    </span>
  )
}

export function EnrollmentBadge({ status }: { status: EnrollmentStatus }) {
  const map: Record<EnrollmentStatus, { variant: BadgeVariant; label: string }> = {
    not_started: { variant: 'neutral', label: 'Not Started' },
    in_progress: { variant: 'info',    label: 'In Progress' },
    completed:   { variant: 'success', label: 'Completed' },
    overdue:     { variant: 'danger',  label: 'Overdue' },
    failed:      { variant: 'warning', label: 'Failed' },
  }
  const { variant, label } = map[status]
  return <StatusBadge variant={variant} label={label} />
}

export function CertBadge({ status }: { status: CertificationStatus }) {
  const map: Record<CertificationStatus, { variant: BadgeVariant; label: string }> = {
    valid:          { variant: 'success', label: 'Valid' },
    expiring_soon:  { variant: 'warning', label: 'Expiring Soon' },
    expired:        { variant: 'danger',  label: 'Expired' },
    not_earned:     { variant: 'neutral', label: 'Not Earned' },
  }
  const { variant, label } = map[status]
  return <StatusBadge variant={variant} label={label} />
}

export function CourseBadge({ status }: { status: CourseStatus }) {
  const map: Record<CourseStatus, { variant: BadgeVariant; label: string }> = {
    active:   { variant: 'success', label: 'Active' },
    draft:    { variant: 'neutral', label: 'Draft' },
    archived: { variant: 'neutral', label: 'Archived' },
  }
  const { variant, label } = map[status]
  return <StatusBadge variant={variant} label={label} />
}
