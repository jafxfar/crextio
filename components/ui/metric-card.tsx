import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  accentColor?: string
  className?: string
  dark?: boolean
}

export function MetricCard({ title, value, subtitle, icon, trend, accentColor = 'bg-primary', className, dark }: MetricCardProps) {
  return (
    <div className={cn(
      'rounded-[16px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border flex flex-col gap-3',
      dark
        ? 'bg-card-dark border-card-dark text-card-dark-foreground'
        : 'bg-card border-border',
      className,
    )}>
      <div className="flex items-start justify-between">
        <div className={cn('w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0', accentColor)}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend.value >= 0
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700',
          )}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className={cn('text-[12px] font-medium', dark ? 'text-card-dark-foreground/60' : 'text-muted-foreground')}>{title}</p>
        <p className={cn('text-2xl font-bold mt-0.5 leading-tight', dark ? 'text-card-dark-foreground' : 'text-foreground')}>{value}</p>
        {subtitle && <p className={cn('text-xs mt-1', dark ? 'text-card-dark-foreground/50' : 'text-muted-foreground')}>{subtitle}</p>}
      </div>
    </div>
  )
}

interface SectionCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  noPadding?: boolean
  dark?: boolean
  headerless?: boolean
}

export function SectionCard({ title, subtitle, action, children, className, noPadding, dark, headerless }: SectionCardProps) {
  return (
    <div className={cn(
      'rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border overflow-hidden',
      dark ? 'bg-card-dark border-card-dark' : 'bg-card border-border',
      className,
    )}>
      {!headerless && (
        <div className={cn(
          'flex items-center justify-between px-5 py-4 border-b',
          dark ? 'border-white/10' : 'border-border',
        )}>
          <div>
            <h2 className={cn('text-[14px] font-semibold', dark ? 'text-card-dark-foreground' : 'text-foreground')}>{title}</h2>
            {subtitle && <p className={cn('text-[11px] mt-0.5', dark ? 'text-card-dark-foreground/50' : 'text-muted-foreground')}>{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  )
}
