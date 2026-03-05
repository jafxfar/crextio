// ─── Data Models ────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'employee'
export type CourseStatus = 'active' | 'draft' | 'archived'
export type EnrollmentStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue' | 'failed'
export type CertificationStatus = 'valid' | 'expiring_soon' | 'expired' | 'not_earned'

export interface Department {
  id: string
  name: string
  headcount: number
  color: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  departmentId: string
  avatarInitials: string
  xp: number
  rank: number
  joinedAt: string
  completedCourses: number
  totalCourses: number
  certifications: number
}

export interface Step {
  id: string
  title: string
  type: 'video' | 'reading' | 'question' | 'simulation'
  durationMinutes: number
  order: number
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  points: number
}

export interface Chapter {
  id: string
  title: string
  steps: Step[]
  questions: Question[]
  order: number
}

export interface Module {
  id: string
  title: string
  chapters: Chapter[]
  durationMinutes: number
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  departmentIds: string[]
  modules: Module[]
  status: CourseStatus
  passingScore: number
  certificationName: string | null
  certificationValidityDays: number | null
  createdAt: string
  updatedAt: string
  totalEnrolled: number
  completionRate: number
  avgScore: number
  isCompliance: boolean
  dueDate: string | null
}

export interface UserProgress {
  userId: string
  courseId: string
  status: EnrollmentStatus
  progressPercent: number
  score: number | null
  attempts: number
  startedAt: string | null
  completedAt: string | null
  dueDate: string | null
}

export interface Certification {
  id: string
  userId: string
  courseId: string
  issuedAt: string
  expiresAt: string
  status: CertificationStatus
  certNumber: string
}

export interface FailedAttempt {
  userId: string
  userName: string
  courseId: string
  courseTitle: string
  score: number
  passingScore: number
  attemptDate: string
  attempts: number
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const departments: Department[] = [
  { id: 'd1', name: 'Assembly Line', headcount: 142, color: '#1E40AF' },
  { id: 'd2', name: 'Quality Control', headcount: 68, color: '#0891B2' },
  { id: 'd3', name: 'Maintenance', headcount: 54, color: '#059669' },
  { id: 'd4', name: 'Logistics', headcount: 87, color: '#D97706' },
  { id: 'd5', name: 'Health & Safety', headcount: 31, color: '#DC2626' },
  { id: 'd6', name: 'Engineering', headcount: 45, color: '#7C3AED' },
]

export const users: User[] = [
  { id: 'u1', name: 'Marcus Webb', email: 'marcus.webb@forge.co', role: 'employee', departmentId: 'd1', avatarInitials: 'MW', xp: 12480, rank: 1, joinedAt: '2022-03-15', completedCourses: 18, totalCourses: 20, certifications: 5 },
  { id: 'u2', name: 'Priya Sharma', email: 'priya.sharma@forge.co', role: 'manager', departmentId: 'd2', avatarInitials: 'PS', xp: 11920, rank: 2, joinedAt: '2021-07-01', completedCourses: 22, totalCourses: 24, certifications: 7 },
  { id: 'u3', name: 'Devon Castillo', email: 'devon.castillo@forge.co', role: 'employee', departmentId: 'd3', avatarInitials: 'DC', xp: 10750, rank: 3, joinedAt: '2022-11-20', completedCourses: 15, totalCourses: 18, certifications: 4 },
  { id: 'u4', name: 'Aisha Nkosi', email: 'aisha.nkosi@forge.co', role: 'employee', departmentId: 'd5', avatarInitials: 'AN', xp: 9840, rank: 4, joinedAt: '2023-01-10', completedCourses: 14, totalCourses: 16, certifications: 4 },
  { id: 'u5', name: 'James Thornton', email: 'james.thornton@forge.co', role: 'manager', departmentId: 'd4', avatarInitials: 'JT', xp: 9200, rank: 5, joinedAt: '2020-05-22', completedCourses: 20, totalCourses: 22, certifications: 6 },
  { id: 'u6', name: 'Lena Fischer', email: 'lena.fischer@forge.co', role: 'employee', departmentId: 'd6', avatarInitials: 'LF', xp: 8660, rank: 6, joinedAt: '2023-04-01', completedCourses: 12, totalCourses: 16, certifications: 3 },
  { id: 'u7', name: 'Rajan Patel', email: 'rajan.patel@forge.co', role: 'employee', departmentId: 'd1', avatarInitials: 'RP', xp: 7940, rank: 7, joinedAt: '2023-06-15', completedCourses: 11, totalCourses: 15, certifications: 3 },
  { id: 'u8', name: 'Chloe Martin', email: 'chloe.martin@forge.co', role: 'admin', departmentId: 'd2', avatarInitials: 'CM', xp: 7200, rank: 8, joinedAt: '2022-08-30', completedCourses: 16, totalCourses: 20, certifications: 5 },
  { id: 'u9', name: 'Omar Hassan', email: 'omar.hassan@forge.co', role: 'employee', departmentId: 'd3', avatarInitials: 'OH', xp: 6800, rank: 9, joinedAt: '2023-09-12', completedCourses: 9, totalCourses: 14, certifications: 2 },
  { id: 'u10', name: 'Sofia Reyes', email: 'sofia.reyes@forge.co', role: 'employee', departmentId: 'd4', avatarInitials: 'SR', xp: 6100, rank: 10, joinedAt: '2023-11-01', completedCourses: 8, totalCourses: 13, certifications: 2 },
]

export const courses: Course[] = [
  {
    id: 'c1', title: 'Machine Safety & Lockout/Tagout', description: 'Mandatory LOTO procedures for all floor personnel.',
    departmentIds: ['d1', 'd3'], status: 'active', passingScore: 80, certificationName: 'LOTO Certified',
    certificationValidityDays: 365, createdAt: '2024-01-10', updatedAt: '2024-12-01',
    totalEnrolled: 196, completionRate: 87, avgScore: 84, isCompliance: true, dueDate: '2025-03-31',
    modules: [
      {
        id: 'm1', title: 'Hazard Identification', durationMinutes: 45, order: 1,
        chapters: [
          { id: 'ch1', title: 'Energy Sources', order: 1, questions: [], steps: [
            { id: 's1', title: 'Intro Video', type: 'video', durationMinutes: 10, order: 1 },
            { id: 's2', title: 'Reading: OSHA Standards', type: 'reading', durationMinutes: 15, order: 2 },
          ]},
        ],
      },
    ],
  },
  {
    id: 'c2', title: 'ISO 9001 Quality Management', description: 'Quality process standards and documentation.',
    departmentIds: ['d2'], status: 'active', passingScore: 75, certificationName: 'ISO 9001 Internal Auditor',
    certificationValidityDays: 730, createdAt: '2024-02-14', updatedAt: '2024-11-20',
    totalEnrolled: 68, completionRate: 92, avgScore: 88, isCompliance: true, dueDate: '2025-06-30',
    modules: [], 
  },
  {
    id: 'c3', title: 'Forklift Operations & Safety', description: 'Certification for powered industrial truck operations.',
    departmentIds: ['d4'], status: 'active', passingScore: 85, certificationName: 'Forklift Operator Certified',
    certificationValidityDays: 1095, createdAt: '2024-03-01', updatedAt: '2024-10-15',
    totalEnrolled: 87, completionRate: 74, avgScore: 79, isCompliance: true, dueDate: '2025-02-28',
    modules: [],
  },
  {
    id: 'c4', title: 'Personal Protective Equipment', description: 'Selection and use of PPE across all zones.',
    departmentIds: ['d1', 'd3', 'd4', 'd5'], status: 'active', passingScore: 70, certificationName: null,
    certificationValidityDays: null, createdAt: '2024-01-20', updatedAt: '2024-09-10',
    totalEnrolled: 314, completionRate: 95, avgScore: 91, isCompliance: true, dueDate: '2025-01-31',
    modules: [],
  },
  {
    id: 'c5', title: 'Lean Manufacturing Principles', description: '5S, kaizen, and waste elimination techniques.',
    departmentIds: ['d1', 'd6'], status: 'active', passingScore: 70, certificationName: 'Lean Practitioner',
    certificationValidityDays: null, createdAt: '2024-04-05', updatedAt: '2024-08-22',
    totalEnrolled: 187, completionRate: 68, avgScore: 76, isCompliance: false, dueDate: null,
    modules: [],
  },
  {
    id: 'c6', title: 'Electrical Safety Awareness', description: 'Arc flash and electrical hazard prevention.',
    departmentIds: ['d3', 'd6'], status: 'active', passingScore: 85, certificationName: 'Electrical Safety Aware',
    certificationValidityDays: 365, createdAt: '2024-05-12', updatedAt: '2024-12-10',
    totalEnrolled: 99, completionRate: 61, avgScore: 72, isCompliance: true, dueDate: '2025-04-15',
    modules: [],
  },
  {
    id: 'c7', title: 'Emergency Response Procedures', description: 'Fire, chemical spill, and evacuation protocols.',
    departmentIds: ['d1','d2','d3','d4','d5','d6'], status: 'active', passingScore: 80, certificationName: null,
    certificationValidityDays: null, createdAt: '2024-01-05', updatedAt: '2024-11-30',
    totalEnrolled: 427, completionRate: 88, avgScore: 86, isCompliance: true, dueDate: '2025-03-15',
    modules: [],
  },
  {
    id: 'c8', title: 'Six Sigma Yellow Belt', description: 'Data-driven process improvement fundamentals.',
    departmentIds: ['d6'], status: 'draft', passingScore: 75, certificationName: 'Six Sigma Yellow Belt',
    certificationValidityDays: null, createdAt: '2024-12-01', updatedAt: '2025-01-15',
    totalEnrolled: 0, completionRate: 0, avgScore: 0, isCompliance: false, dueDate: null,
    modules: [],
  },
]

export const userProgressData: UserProgress[] = [
  { userId: 'u1', courseId: 'c1', status: 'completed', progressPercent: 100, score: 92, attempts: 1, startedAt: '2025-01-05', completedAt: '2025-01-12', dueDate: '2025-03-31' },
  { userId: 'u1', courseId: 'c3', status: 'overdue', progressPercent: 45, score: null, attempts: 0, startedAt: '2024-12-01', completedAt: null, dueDate: '2025-02-28' },
  { userId: 'u2', courseId: 'c2', status: 'completed', progressPercent: 100, score: 96, attempts: 1, startedAt: '2024-12-15', completedAt: '2025-01-03', dueDate: '2025-06-30' },
  { userId: 'u3', courseId: 'c1', status: 'in_progress', progressPercent: 60, score: null, attempts: 0, startedAt: '2025-01-20', completedAt: null, dueDate: '2025-03-31' },
  { userId: 'u4', courseId: 'c7', status: 'completed', progressPercent: 100, score: 88, attempts: 1, startedAt: '2025-01-08', completedAt: '2025-01-10', dueDate: '2025-03-15' },
  { userId: 'u5', courseId: 'c3', status: 'overdue', progressPercent: 20, score: null, attempts: 1, startedAt: '2024-11-01', completedAt: null, dueDate: '2025-02-28' },
  { userId: 'u6', courseId: 'c6', status: 'failed', progressPercent: 100, score: 58, attempts: 2, startedAt: '2025-01-10', completedAt: null, dueDate: '2025-04-15' },
  { userId: 'u7', courseId: 'c4', status: 'completed', progressPercent: 100, score: 94, attempts: 1, startedAt: '2025-01-15', completedAt: '2025-01-16', dueDate: '2025-01-31' },
  { userId: 'u9', courseId: 'c6', status: 'failed', progressPercent: 100, score: 62, attempts: 3, startedAt: '2024-12-20', completedAt: null, dueDate: '2025-04-15' },
  { userId: 'u10', courseId: 'c3', status: 'overdue', progressPercent: 10, score: null, attempts: 0, startedAt: '2024-11-15', completedAt: null, dueDate: '2025-02-28' },
]

export const failedAttempts: FailedAttempt[] = [
  { userId: 'u6', userName: 'Lena Fischer', courseId: 'c6', courseTitle: 'Electrical Safety Awareness', score: 58, passingScore: 85, attemptDate: '2025-01-22', attempts: 2 },
  { userId: 'u9', userName: 'Omar Hassan', courseId: 'c6', courseTitle: 'Electrical Safety Awareness', score: 62, passingScore: 85, attemptDate: '2025-01-20', attempts: 3 },
  { userId: 'u5', userName: 'James Thornton', courseId: 'c3', courseTitle: 'Forklift Operations & Safety', score: 71, passingScore: 85, attemptDate: '2025-01-18', attempts: 1 },
  { userId: 'u3', userName: 'Devon Castillo', courseId: 'c1', courseTitle: 'Machine Safety & LOTO', score: 74, passingScore: 80, attemptDate: '2025-01-25', attempts: 1 },
  { userId: 'u10', userName: 'Sofia Reyes', courseId: 'c7', courseTitle: 'Emergency Response Procedures', score: 66, passingScore: 80, attemptDate: '2025-01-19', attempts: 2 },
]

export const certifications: Certification[] = [
  { id: 'cert1', userId: 'u1', courseId: 'c1', issuedAt: '2025-01-12', expiresAt: '2026-01-12', status: 'valid', certNumber: 'LOTO-2025-0112' },
  { id: 'cert2', userId: 'u2', courseId: 'c2', issuedAt: '2025-01-03', expiresAt: '2027-01-03', status: 'valid', certNumber: 'ISO9001-2025-0103' },
  { id: 'cert3', userId: 'u4', courseId: 'c4', issuedAt: '2024-03-10', expiresAt: '2025-03-10', status: 'expiring_soon', certNumber: 'PPE-2024-0310' },
  { id: 'cert4', userId: 'u5', courseId: 'c7', issuedAt: '2023-06-01', expiresAt: '2024-06-01', status: 'expired', certNumber: 'ERP-2023-0601' },
  { id: 'cert5', userId: 'u7', courseId: 'c4', issuedAt: '2025-01-16', expiresAt: '2026-01-16', status: 'valid', certNumber: 'PPE-2025-0116' },
]

// ─── Skills ──────────────────────────────────────────────────────────────────

export interface Skill {
  id: string
  name: string
  icon: string // emoji shorthand
  category: string
}

export const skills: Skill[] = [
  { id: 'sk1', name: 'Machine Safety', icon: '⚙️', category: 'Safety' },
  { id: 'sk2', name: 'Electrical Safety', icon: '⚡', category: 'Safety' },
  { id: 'sk3', name: 'Fire Prevention', icon: '🔥', category: 'Safety' },
  { id: 'sk4', name: 'Quality Control', icon: '✅', category: 'Quality' },
  { id: 'sk5', name: 'Lean Manufacturing', icon: '📉', category: 'Operations' },
  { id: 'sk6', name: 'Six Sigma', icon: '📊', category: 'Operations' },
  { id: 'sk7', name: 'Forklift Operation', icon: '🏗️', category: 'Equipment' },
  { id: 'sk8', name: 'PPE Usage', icon: '🦺', category: 'Safety' },
  { id: 'sk9', name: 'Emergency Response', icon: '🚨', category: 'Safety' },
  { id: 'sk10', name: 'ISO Standards', icon: '📋', category: 'Quality' },
  { id: 'sk11', name: 'Data Analysis', icon: '🔬', category: 'Analytics' },
  { id: 'sk12', name: 'Leadership', icon: '👥', category: 'Soft Skills' },
]

// ─── Certificate Templates ────────────────────────────────────────────────────

export interface CertificateTemplate {
  id: string
  name: string
  validityDays: number | null
  description: string
}

export const certificateTemplates: CertificateTemplate[] = [
  { id: 'ct1', name: 'LOTO Certified', validityDays: 365, description: 'Lockout/Tagout safety certification' },
  { id: 'ct2', name: 'ISO 9001 Internal Auditor', validityDays: 730, description: 'ISO quality management auditor' },
  { id: 'ct3', name: 'Forklift Operator Certified', validityDays: 1095, description: 'Powered industrial truck operator' },
  { id: 'ct4', name: 'Lean Practitioner', validityDays: null, description: 'Lean manufacturing practitioner' },
  { id: 'ct5', name: 'Electrical Safety Aware', validityDays: 365, description: 'Arc flash and electrical hazard awareness' },
  { id: 'ct6', name: 'Six Sigma Yellow Belt', validityDays: null, description: 'Six Sigma process improvement' },
  { id: 'ct7', name: 'Emergency Response Certified', validityDays: 365, description: 'Emergency response procedures' },
  { id: 'ct8', name: 'PPE Compliance Badge', validityDays: 365, description: 'Personal protective equipment usage' },
]

// ─── Derived / aggregated stats ───────────────────────────────────────────────

export interface DepartmentComplianceStat {
  department: Department
  complianceRate: number
  completedUsers: number
  overdueUsers: number
}

export const departmentStats: DepartmentComplianceStat[] = [
  { department: departments[0], complianceRate: 78, completedUsers: 111, overdueUsers: 18 },
  { department: departments[1], complianceRate: 95, completedUsers: 65, overdueUsers: 2 },
  { department: departments[2], complianceRate: 82, completedUsers: 44, overdueUsers: 6 },
  { department: departments[3], complianceRate: 71, completedUsers: 62, overdueUsers: 19 },
  { department: departments[4], complianceRate: 98, completedUsers: 30, overdueUsers: 1 },
  { department: departments[5], complianceRate: 84, completedUsers: 38, overdueUsers: 5 },
]

export const globalComplianceRate = 83

export const overdueCourses = [
  { userId: 'u1', userName: 'Marcus Webb', department: 'Assembly Line', courseTitle: 'Forklift Operations & Safety', daysOverdue: 3, dueDate: '2025-02-28' },
  { userId: 'u5', userName: 'James Thornton', department: 'Logistics', courseTitle: 'Forklift Operations & Safety', daysOverdue: 3, dueDate: '2025-02-28' },
  { userId: 'u10', userName: 'Sofia Reyes', department: 'Logistics', courseTitle: 'Forklift Operations & Safety', daysOverdue: 3, dueDate: '2025-02-28' },
  { userId: 'u3', userName: 'Devon Castillo', department: 'Maintenance', courseTitle: 'Machine Safety & LOTO', daysOverdue: 0, dueDate: '2025-03-31' },
  { userId: 'u8', userName: 'Chloe Martin', department: 'Quality Control', courseTitle: 'Emergency Response Procedures', daysOverdue: 0, dueDate: '2025-03-15' },
]
