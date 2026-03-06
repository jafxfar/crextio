// ─── Course Editor Types ─────────────────────────────────────────────────────

export type StepType = 'info' | 'video' | 'quiz' | 'file'
export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'POSITIONING'
export type CourseStatus = 'active' | 'draft' | 'archived'

// ─── Question types ───────────────────────────────────────────────────────────

/** Option for SINGLE_CHOICE / MULTIPLE_CHOICE */
export interface ChoiceOption {
  id: number
  text: string
  isCorrect: boolean
}

/** Option for ORDERING (POSITIONING) */
export interface OrderingOption {
  id: number
  text: string
  correctOrder: number   // 1-based position in the correct sequence
}

/** Discriminated union payload – mirrors the diagram's Abstract Payload */
export type QuestionPayload =
  | { type: 'SINGLE_CHOICE';   options: ChoiceOption[]   }
  | { type: 'MULTIPLE_CHOICE'; options: ChoiceOption[]   }
  | { type: 'POSITIONING';     options: OrderingOption[] }

export interface EditorQuestion {
  id: number | string
  moduleId: number          // which module this question belongs to (backend ref)
  type: QuestionType
  questionText: string
  points: number
  payload: QuestionPayload  // singular – one payload per question matches the diagram
}

// ─── Step ────────────────────────────────────────────────────────────────────

export interface EditorStep {
  id: number
  title: string
  type: StepType
  position: number
  points: number
  isAnswered: boolean
  userPoints: number
  data: {
    // info / text
    content?: string
    // video
    videoUrl?: string
    // file / document
    fileUrl?: string
    fileName?: string
    fileSize?: number       // bytes
    fileMimeType?: string
    // code template (from diagram StepData)
    codeTemplate?: string
    // quiz – list of questions for this step
    questions?: EditorQuestion[]
    // ai-generated audio narration (base64 data URL or remote URL)
    audioUrl?: string
  }
}

// ─── Chapter ─────────────────────────────────────────────────────────────────

export interface EditorChapter {
  id: number
  title: string
  position: number
  maxPoints: number
  userPoints?: number
  flashCards?: unknown[]
  steps: EditorStep[]
}

// ─── Module ──────────────────────────────────────────────────────────────────

export interface EditorModule {
  id: number
  title: string
  position: number
  maxPoints?: number
  userPoints?: number
  chapters: EditorChapter[]
}

// ─── Full Course ──────────────────────────────────────────────────────────────

export interface EditorCourse {
  id: number
  title: string
  info: string
  usersCount: number
  progress: number
  mainSourceUrl: string
  departaments: string[]
  coins: number
  skills: string[]
  modules: EditorModule[]
  maxPoints: number
  maxAttempts: number
  passingPercentage: number
  badgeUrl: string
  imageUrl: string
}

export interface CourseSettings {
  title: string
  description: string
  status: CourseStatus
  passingPercentage: number
  maxAttempts: number
  departmentIds: string[]
  certificationName: string
  certificationValidityDays: number | null
  isCompliance: boolean
  dueDate: string
}
