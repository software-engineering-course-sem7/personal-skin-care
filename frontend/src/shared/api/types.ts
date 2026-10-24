export type SkinType = 'oily' | 'dry' | 'normal' | 'combination'
export type AnalysisStatus = 'processing' | 'completed' | 'failed'
export type Gender = 'male' | 'female'

export interface ErrorResponse {
  message: string
  code?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  birth_date?: string | null
  gender?: Gender | null
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface LogoutRequest {
  refresh_token: string
}

export interface User {
  id: string
  email: string
  name: string
  birth_date: string | null
  gender: Gender | null
  created_at: string
  updated_at: string
}

export interface UpdateUserRequest {
  email?: string
  name?: string
  birth_date?: string | null
  gender?: Gender | null
}

export interface UpdatePasswordRequest {
  current_password: string
  new_password: string
}

export interface CreateAnalysisResponse {
  id: string
  photo_id: string
  file_url: string
  status: AnalysisStatus
  uploaded_at: string
}

export interface AnalysisListItem {
  id: string
  photo_id: string
  file_url: string
  status: AnalysisStatus
  skin_type: SkinType | null
  created_at: string
  updated_at: string
}

export interface AnalysisDetail {
  id: string
  photo_id: string
  file_url: string
  status: AnalysisStatus
  skin_type: SkinType | null
  analysis_data: Record<string, unknown> | null
  recommendations?: Recommendation[]
  ingredients?: Ingredient[]
  created_at: string
  updated_at: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
}

export interface Ingredient {
  id: string
  name: string
  description: string
}

export interface HealthStatus {
  status: string
}
