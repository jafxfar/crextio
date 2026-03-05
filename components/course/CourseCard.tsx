'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { courses, departments } from '@/lib/data'
import { BookOpen, Users, Clock, Award, BarChart2, Pencil } from 'lucide-react'

import { CourseBadge, StatusBadge } from '@/components/ui/status-badge'

function ProgressBar({ value, color = 'bg-primary' }: { value: number; color?: string }) {
    return (
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${value}%` }} />
        </div>
    )
}

function getDeptNames(deptIds: string[]) {
    return deptIds.map(id => departments.find(d => d.id === id)?.name ?? id).join(', ')
}

export function CourseCard({ course }: { course: typeof courses[0] }) {
    const compColor =
        course.completionRate >= 85 ? 'bg-emerald-500' :
            course.completionRate >= 60 ? 'bg-primary' : 'bg-red-400'

    return (
        <div className="border rounded-2xl p-5 border-gray-200 bg-white transition-all duration-200 flex flex-col gap-4 group">

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-[12px] bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                    <CourseBadge status={course.status} />
                    {course.isCompliance && (
                        <StatusBadge variant="info" label="Compliance" />
                    )}
                </div>
            </div>

            {/* Title + description */}
            <div>
                <h3 className="text-[14px] font-semibold text-foreground leading-snug group-hover:text-foreground/70 transition-colors">
                    {course.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{course.description}</p>
            </div>

            {/* Stat row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {course.totalEnrolled}
                </span>
                <span className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3" /> Avg {course.avgScore ?? '—'}%
                </span>
                {course.certificationName && (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Award className="w-3 h-3" /> Cert
                    </span>
                )}
            </div>

            {/* Completion bar */}
            {course.status === 'active' && course.totalEnrolled > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-muted-foreground">Completion</span>
                        <span className="text-[11px] font-bold text-foreground">{course.completionRate}%</span>
                    </div>
                    <ProgressBar value={course.completionRate} color={compColor} />
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-[11px] text-muted-foreground truncate max-w-[55%]">
                    {getDeptNames(course.departmentIds).substring(0, 34)}
                    {getDeptNames(course.departmentIds).length > 34 ? '...' : ''}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {course.dueDate && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {course.dueDate}
                        </span>
                    )}
                    <Link
                        href="/courses/edit"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground text-[11px] font-medium transition-all border border-border hover:border-primary"
                    >
                        <Pencil className="w-2.5 h-2.5" /> Edit
                    </Link>
                </div>
            </div>
        </div>
    )
}
