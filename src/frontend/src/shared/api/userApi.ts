import { api } from './client'
import { USE_MOCK_ANALYSIS } from './config'
import type { UpdatePasswordRequest, UpdateUserRequest, User } from './types'

const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  name: 'Имя Фамилия',
  birth_date: null,
  gender: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const userApi = {
  async getMe(): Promise<User> {
    if (USE_MOCK_ANALYSIS) {
      return MOCK_USER
    }

    const response = await api.get<User>('/users/me')
    return response.data
  },

  async updateMe(data: UpdateUserRequest): Promise<User> {
    if (USE_MOCK_ANALYSIS) {
      return {
        ...MOCK_USER,
        email: data.email ?? MOCK_USER.email,
        name: data.name ?? MOCK_USER.name,
        birth_date: data.birth_date ?? MOCK_USER.birth_date,
        gender: data.gender ?? MOCK_USER.gender,
        updated_at: new Date().toISOString(),
      }
    }

    const response = await api.patch<User>('/users/me', data)
    return response.data
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    await api.patch('/users/me/password', data)
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/users/me')
  },
}
