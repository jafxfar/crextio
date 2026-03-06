'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const complianceTrend = [
  { month: 'Авг', rate: 76 },
  { month: 'Сен', rate: 78 },
  { month: 'Окт', rate: 80 },
  { month: 'Ноя', rate: 79 },
  { month: 'Дек', rate: 82 },
  { month: 'Янв', rate: 83 },
]

export function ComplianceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={complianceTrend}>
        <defs>
          <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.82 0.165 90)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="oklch(0.82 0.165 90)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
        <Tooltip
          contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: 12 }}
          formatter={(v: number) => [`${v}%`, 'Показатель соответствия']}
        />
        <Area type="monotone" dataKey="rate" stroke="oklch(0.82 0.165 90)" strokeWidth={2.5} fill="url(#compGrad)" dot={{ fill: 'oklch(0.14 0.012 60)', strokeWidth: 0, r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
