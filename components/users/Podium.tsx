'use client'

import { SectionCard } from '@/components/ui/metric-card'
import { Crown, Medal } from 'lucide-react'
import type { User } from '@/lib/data'
interface PodiumProps {
    users: User[]
}
export function Podium(props: PodiumProps) {

    const users = props.users

    const top3 = users.slice(0, 3)

    return (
        <SectionCard title="Лучшие сотрудники — Таблица лидеров XP" subtitle="С начала квартала · Q1 2025">
            <div className="flex items-end justify-center gap-4 pt-4 pb-2">
                {/* 2nd */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-600">{top3[1].avatarInitials}</span>
                    </div>
                    <div className="bg-gray-100 border border-gray-200 rounded-t-xl w-20 h-20 flex flex-col items-center justify-center gap-1">
                        <Medal className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-bold text-gray-600">2-е</p>
                        <p className="text-[10px] text-gray-500">{(top3[1].xp / 1000).toFixed(1)}k XP</p>
                    </div>
                    <p className="text-xs font-medium text-foreground text-center w-20 truncate">{top3[1].name.split(' ')[0]}</p>
                </div>
                {/* 1st */}
                <div className="flex flex-col items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center ring-2 ring-amber-400">
                        <span className="text-sm font-bold text-amber-700">{top3[0].avatarInitials}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-t-xl w-24 h-28 flex flex-col items-center justify-center gap-1">
                        <Crown className="w-4 h-4 text-amber-500" />
                        <p className="text-sm font-bold text-amber-700">1-е</p>
                        <p className="text-[11px] font-semibold text-amber-600">{(top3[0].xp / 1000).toFixed(1)}k XP</p>
                    </div>
                    <p className="text-xs font-semibold text-foreground text-center w-24 truncate">{top3[0].name.split(' ')[0]}</p>
                </div>
                {/* 3rd */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-amber-900">{top3[2].avatarInitials}</span>
                    </div>
                    <div className="bg-amber-900/5 border border-amber-900/20 rounded-t-xl w-20 h-16 flex flex-col items-center justify-center gap-1">
                        <Medal className="w-4 h-4 text-amber-800" />
                        <p className="text-xs font-bold text-amber-800">3-е</p>
                        <p className="text-[10px] text-amber-700">{(top3[2].xp / 1000).toFixed(1)}k XP</p>
                    </div>
                    <p className="text-xs font-medium text-foreground text-center w-20 truncate">{top3[2].name.split(' ')[0]}</p>
                </div>
            </div>
        </SectionCard>
    )
}
