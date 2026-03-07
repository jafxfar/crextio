'use client'

import { useState } from 'react'
import { SectionCard } from '@/components/ui/metric-card'
import {
    Zap, Search, Award,
    ChevronUp, ChevronDown, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { User, Department } from "@/lib/data";
import { CreateUserModal } from './CreateUserModal'

interface UserTableProps {
    users: User[]
    departments:Department[]
}

function RoleChip({ role }: { role: 'admin' | 'manager' | 'employee' }) {
    const map = {
        admin: 'bg-purple-50 text-purple-700 border-purple-200',
        manager: 'bg-blue-50 text-blue-700 border-blue-200',
        employee: 'bg-gray-100 text-gray-600 border-gray-200',
    }
    const labels = {
        admin: 'Администратор',
        manager: 'Менеджер',
        employee: 'Сотрудник',
    }
    return (
        <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border', map[role])}>
            {labels[role]}
        </span>
    )
}

export function UserTable(props: UserTableProps) {
    const { users, departments } = props
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<'xp' | 'completed' | 'certs'>('xp')
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
    const [createOpen, setCreateOpen] = useState(false)

    const sorted = [...users]
        .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const vals = {
                xp: [a.xp, b.xp],
                completed: [a.completedCourses, b.completedCourses],
                certs: [a.certifications, b.certifications],
            }
            const [av, bv] = vals[sortBy]
            return sortDir === 'desc' ? bv - av : av - bv
        })

    function toggleSort(field: typeof sortBy) {
        if (sortBy === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
        else { setSortBy(field); setSortDir('desc') }
    }

    function SortIcon({ field }: { field: typeof sortBy }) {
        if (sortBy !== field) return <ChevronUp className="w-3 h-3 opacity-30" />
        return sortDir === 'desc' ? <ChevronDown className="w-3 h-3 text-primary" /> : <ChevronUp className="w-3 h-3 text-primary" />
    }

    return (
        <>
        <SectionCard
            title="Все пользователи"
            subtitle={`${users.length} активных сотрудников`}
            noPadding
            action={
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-32"
                        />
                    </div>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-1.5 bg-foreground text-background rounded-full px-3.5 py-1.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Создать
                    </button>
                </div>
            }
        >
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-4 px-5 py-2.5 bg-secondary border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                <span>Сотрудник</span>
                <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort('xp')}>
                    XP Score <SortIcon field="xp" />
                </button>
                <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort('completed')}>
                    Курсы <SortIcon field="completed" />
                </button>
                <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort('certs')}>
                    Серт. <SortIcon field="certs" />
                </button>
                <span>Прогресс</span>
            </div>

            <div className="divide-y divide-border">
                {sorted.map((user, i) => {
                    const dept = departments.find(d => d.id === user.departmentId)
                    const completionPct = Math.round((user.completedCourses / user.totalCourses) * 100)
                    return (
                        <div
                            key={user.id}
                            className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-4 px-5 py-3.5 items-center hover:bg-secondary/40 transition-colors cursor-pointer"
                        >
                            {/* Employee */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                        style={{ backgroundColor: dept?.color || '#6B7280' }}
                                    >
                                        {user.avatarInitials}
                                    </div>
                                    {user.rank <= 3 && (
                                        <div className={cn(
                                            'absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center',
                                            user.rank === 1 ? 'bg-amber-400' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-700',
                                        )}>
                                            <span className="text-[8px] font-bold text-white">{user.rank}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <RoleChip role={user.role} />
                                        <span className="text-[11px] text-muted-foreground truncate">{dept?.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* XP */}
                            <div>
                                <p className="text-sm font-bold text-foreground flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-500" />{user.xp.toLocaleString()}
                                </p>
                                <p className="text-[11px] text-muted-foreground">Ранг #{user.rank}</p>
                            </div>

                            {/* Courses */}
                            <div>
                                <p className="text-sm font-medium text-foreground">{user.completedCourses}/{user.totalCourses}</p>
                                <p className="text-[11px] text-muted-foreground">{completionPct}% выполнено</p>
                            </div>

                            {/* Certifications */}
                            <div className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-sm font-medium text-foreground">{user.certifications}</span>
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                                    <div
                                        className={cn('h-full rounded-full', completionPct >= 90 ? 'bg-emerald-500' : completionPct >= 60 ? 'bg-primary' : 'bg-amber-500')}
                                        style={{ width: `${completionPct}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">{completionPct}% завершено</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </SectionCard>

        <CreateUserModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onCreated={() => {
                // TODO: refresh users list from API when backend list endpoint is available
                setCreateOpen(false)
            }}
        />
        </>
    )
}
