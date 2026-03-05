import { BookOpen, Video, HelpCircle, FileUp } from 'lucide-react'

export const stepMeta = {
  info:  { label: 'Text',  icon: BookOpen,  color: 'bg-blue-500/15 text-blue-600'      },
  video: { label: 'Video', icon: Video,      color: 'bg-purple-500/15 text-purple-600'  },
  quiz:  { label: 'Quiz',  icon: HelpCircle, color: 'bg-amber-500/15 text-amber-600'   },
  file:  { label: 'File',  icon: FileUp,     color: 'bg-green-500/15 text-green-600'   },
} as const

export type StepMetaKey = keyof typeof stepMeta

export function getMeta(type: string) {
  return stepMeta[type as StepMetaKey] ?? stepMeta.info
}
