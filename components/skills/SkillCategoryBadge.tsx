'use client'

import { cn } from '@/lib/utils'

const categoryStyles: Record<string, string> = {
  Safety: 'bg-red-50 text-red-700 border-red-200',
  Quality: 'bg-blue-50 text-blue-700 border-blue-200',
  Operations: 'bg-amber-50 text-amber-700 border-amber-200',
  Equipment: 'bg-orange-50 text-orange-700 border-orange-200',
  Analytics: 'bg-violet-50 text-violet-700 border-violet-200',
  'Soft Skills': 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

interface SkillCategoryBadgeProps {
  category: string
}

export function SkillCategoryBadge({ category }: SkillCategoryBadgeProps) {
  const style = categoryStyles[category] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border', style)}>
      {category}
    </span>
  )
}
