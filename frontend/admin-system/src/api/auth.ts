import request from '@/utils/request'
import type { User } from '@/stores/counter'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// 登录
export function login(data: LoginParams): Promise<LoginResponse> {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo(): Promise<User> {
  return request({
    url: '/auth/user',
    method: 'get'
  })
}

// 登出
export function logout(): Promise<void> {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}