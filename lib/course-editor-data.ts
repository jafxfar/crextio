import type {
  EditorModule,
  EditorChapter,
  EditorStep,
  CourseSettings,
} from './course-editor-types'

// ─── Seed Data for the Course Editor ─────────────────────────────────────────

export const seedSettings: CourseSettings = {
  title: 'Machine Safety & Lockout/Tagout',
  description:
    'Comprehensive mandatory training covering all LOTO procedures, hazard identification, and energy control programs for floor personnel.',
  status: 'active',
  passingPercentage: 80,
  maxAttempts: 3,
  departmentIds: ['d1', 'd3'],
  certificationName: 'LOTO Certified',
  certificationValidityDays: 365,
  isCompliance: true,
  dueDate: '2025-03-31',
}

export const seedModules: EditorModule[] = [
  {
    id: 'mod-1',
    title: 'Introduction to LOTO',
    description: 'Foundational concepts, regulatory requirements, and scope of the program.',
    order: 1,
    chapters: [
      {
        id: 'ch-1-1',
        title: 'What is LOTO?',
        order: 1,
        steps: [
          {
            id: 'step-1-1-1',
            title: 'Program Overview',
            type: 'video',
            order: 1,
            videoUrl: 'https://example.com/loto-intro.mp4',
            videoDurationMin: 8,
          },
          {
            id: 'step-1-1-2',
            title: 'OSHA 1910.147 Reference',
            type: 'info',
            order: 2,
            content:
              'OSHA Standard 1910.147 establishes minimum performance requirements for the control of hazardous energy during servicing and maintenance.',
          },
          {
            id: 'step-1-1-3',
            title: 'Knowledge Check: Regulation',
            type: 'question',
            order: 3,
            question: {
              id: 'q-1',
              type: 'single',
              prompt: 'Which OSHA standard governs Lockout/Tagout procedures?',
              options: [
                { id: 'o1', text: 'OSHA 1910.132' },
                { id: 'o2', text: 'OSHA 1910.147' },
                { id: 'o3', text: 'OSHA 1926.20' },
                { id: 'o4', text: 'OSHA 1910.303' },
              ],
              correctIndices: [1],
              points: 10,
            },
          },
        ],
      },
      {
        id: 'ch-1-2',
        title: 'Energy Sources',
        order: 2,
        steps: [
          {
            id: 'step-1-2-1',
            title: 'Types of Hazardous Energy',
            type: 'info',
            order: 1,
            content:
              'Electrical, mechanical, hydraulic, pneumatic, chemical, thermal, and gravitational energy must all be controlled before servicing equipment.',
          },
          {
            id: 'step-1-2-2',
            title: 'Energy Source Identification',
            type: 'question',
            order: 2,
            question: {
              id: 'q-2',
              type: 'multiple',
              prompt: 'Select ALL types of hazardous energy that must be controlled under LOTO:',
              options: [
                { id: 'o1', text: 'Electrical' },
                { id: 'o2', text: 'Hydraulic' },
                { id: 'o3', text: 'Ambient (room temperature)' },
                { id: 'o4', text: 'Pneumatic' },
                { id: 'o5', text: 'Administrative approval' },
              ],
              correctIndices: [0, 1, 3],
              points: 15,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mod-2',
    title: 'LOTO Procedures & Practice',
    description: 'Step-by-step procedures, device usage, and practical application scenarios.',
    order: 2,
    chapters: [
      {
        id: 'ch-2-1',
        title: 'Lockout Devices',
        order: 1,
        steps: [
          {
            id: 'step-2-1-1',
            title: 'Device Types Video',
            type: 'video',
            order: 1,
            videoUrl: 'https://example.com/loto-devices.mp4',
            videoDurationMin: 12,
          },
          {
            id: 'step-2-1-2',
            title: 'Equipment Checklist Download',
            type: 'file',
            order: 2,
            fileLabel: 'LOTO Equipment Inspection Checklist',
            fileAccept: '.pdf',
            required: true,
          },
          {
            id: 'step-2-1-3',
            title: 'Correct Device Sequence',
            type: 'question',
            order: 3,
            question: {
              id: 'q-3',
              type: 'ordering',
              prompt: 'Place the LOTO steps in the correct order:',
              options: [
                { id: 'o1', text: 'Notify affected employees' },
                { id: 'o2', text: 'Identify all energy sources' },
                { id: 'o3', text: 'Apply lockout/tagout devices' },
                { id: 'o4', text: 'Release/restrain stored energy' },
                { id: 'o5', text: 'Verify isolation' },
              ],
              correctIndices: [1, 0, 3, 2, 4],
              points: 20,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mod-3',
    title: 'Assessment & Certification',
    description: 'Final assessment to validate understanding and earn LOTO certification.',
    order: 3,
    chapters: [
      {
        id: 'ch-3-1',
        title: 'Final Exam',
        order: 1,
        steps: [
          {
            id: 'step-3-1-1',
            title: 'Exam Instructions',
            type: 'info',
            order: 1,
            content:
              'This final exam consists of 10 questions covering all modules. You must score 80% or above to earn your LOTO certification. You have 3 attempts available.',
          },
          {
            id: 'step-3-1-2',
            title: 'Final Assessment',
            type: 'question',
            order: 2,
            question: {
              id: 'q-4',
              type: 'single',
              prompt: 'Who is responsible for removing a LOTO device at the end of a job?',
              options: [
                { id: 'o1', text: 'Supervisor' },
                { id: 'o2', text: 'The authorized employee who applied it' },
                { id: 'o3', text: 'Any available team member' },
                { id: 'o4', text: 'Safety officer on duty' },
              ],
              correctIndices: [1],
              points: 10,
            },
          },
        ],
      },
    ],
  },
]
