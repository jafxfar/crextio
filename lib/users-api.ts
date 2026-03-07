import { apiFetch } from './api'

// ─── Types ────────────────────────────────────────────────────────────────────

export type EmployeeRole = 'admin' | 'manager' | 'employee'

export interface CreateEmployeeRequest {
  email: string
  password: string
  name: string
  department_id: number
  role: EmployeeRole
}

export interface CreateEmployeeResponse {
  id: number
  email: string
  name: string
  department_id: number
  role: EmployeeRole
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
  return apiFetch<CreateEmployeeResponse>('/api/v0/employees/employee/create', {
    method: 'POST',
    body: data,
  })
}
