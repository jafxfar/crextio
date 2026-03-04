'use client'

import { Download } from 'lucide-react'
import { certifications, users, courses, departments } from '@/lib/data'
import { CertBadge } from '@/components/ui/status-badge'

export function CertificationRow({ cert }: { cert: typeof certifications[0] }) {
    const user = users.find(u => u.id === cert.userId)
    const course = courses.find(c => c.id === cert.courseId)
    const dept = departments.find(d => d.id === user?.departmentId)

    const daysLeft = Math.ceil((new Date(cert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    return (
        <div className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/40 transition-colors border-b border-border last:border-0">
            <div className="flex items-center gap-3 min-w-0">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: dept?.color || '#6B7280' }}
                >
                    {user?.avatarInitials}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{course?.certificationName}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="hidden md:block text-right">
                    <p className="text-[11px] text-muted-foreground font-mono">{cert.certNumber}</p>
                    <p className="text-[11px] text-muted-foreground">
                        Expires {cert.expiresAt}
                        {daysLeft > 0 && daysLeft < 90 && (
                            <span className="text-amber-600 ml-1">({daysLeft}d)</span>
                        )}
                    </p>
                </div>
                <CertBadge status={cert.status} />
                <button className="w-7 h-7 rounded-[8px] bg-secondary hover:bg-accent flex items-center justify-center transition-colors">
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
            </div>
        </div>
    )
}