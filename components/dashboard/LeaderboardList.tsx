
import { users } from '@/lib/data'
import { Zap } from 'lucide-react'


const RANK_COLORS = ['#E8C227', '#9CA3AF', '#B45309', '#6B7280', '#6B7280']

export function LeaderboardList() {
    const top5 = users.slice(0, 5)
    const maxXP = top5[0].xp

    return (
        <div className="space-y-3">
            {top5.map((user, i) => {
                const barWidth = (user.xp / maxXP) * 100
                return (
                    <div key={user.id} className="flex items-center gap-3">
                        <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: RANK_COLORS[i] }}
                        >
                            {i + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-card-dark-foreground">{user.avatarInitials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] font-medium text-card-dark-foreground truncate">{user.name}</span>
                                <span className="text-[11px] font-bold text-primary ml-2 flex items-center gap-0.5 flex-shrink-0">
                                    <Zap className="w-2.5 h-2.5" />{(user.xp / 1000).toFixed(1)}k
                                </span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${barWidth}%`, backgroundColor: RANK_COLORS[i] }}
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}