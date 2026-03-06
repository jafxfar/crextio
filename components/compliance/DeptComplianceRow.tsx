'use client'

import { departmentStats } from '@/lib/data'

import { XCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'



export function DeptComplianceRow({ stat }: { stat: typeof departmentStats[0] }) {
    const { department, complianceRate, completedUsers, overdueUsers } = stat
    const color =
        complianceRate >= 90 ? 'bg-emerald-500' :
            complianceRate >= 75 ? 'bg-primary' :
                'bg-amber-500'
    const badge =
        complianceRate >= 90 ? { label: 'Соответствует', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' } :
            complianceRate >= 75 ? { label: 'В норме', bg: 'bg-blue-50 text-blue-700 border-blue-200' } :
                { label: 'Под угрозой', bg: 'bg-amber-50 text-amber-700 border-amber-200' }

    return (
        <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors border-b border-border last:border-0">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: department.color }} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{department.name}</span>
                    <span className="text-sm font-bold text-foreground">{complianceRate}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', color)} style={{ width: `${complianceRate}%` }} />
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-xs text-muted-foreground">
                <span className="hidden md:flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" />{completedUsers}</span>
                <span className="hidden md:flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500" />{overdueUsers}</span>
                <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border', badge.bg)}>{badge.label}</span>
            </div>
        </div>
    )
}
