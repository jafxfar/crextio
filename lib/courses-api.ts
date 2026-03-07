import { apiFetch } from './api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateCourseRequest {
  title: string
  info: string
  badgeUrl: string
  imageUrl: string
  mainSourceUrl: string
}

export interface CreateCourseResponse {
  id: number
  title: string
  info: string
  maxPoints: number | null
  maxAttempts: number | null
  badgeUrl: string
  imageUrl: string
  mainSourceUrl: string
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function createCourse(data: CreateCourseRequest): Promise<number> {
  return apiFetch<number>('/api/v0/courses/course/create', {
    method: 'POST',
    body: data,
  })
}

export async function getCourse(courseId: number): Promise<CreateCourseResponse> {
  return apiFetch<CreateCourseResponse>(`/api/v0/courses/course/${courseId}`)
}
