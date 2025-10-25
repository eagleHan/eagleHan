import request from '@/utils/request'

export interface UserListParams {
  page: number
  pageSize: number
  username?: string
  email?: string
}

export interface UserItem {
  id: number
  username: string
  email: string
  avatar?: string
  roles: string[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface UserListResponse {
  list: UserItem[]
  total: number
}

export interface CreateUserParams {
  username: string
  email: string
  password: string
  roles: string[]
}

export interface UpdateUserParams {
  id: number
  username?: string
  email?: string
  roles?: string[]
  status?: 'active' | 'inactive'
}

// 获取用户列表
export function getUserList(params: UserListParams): Promise<UserListResponse> {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

// 创建用户
export function createUser(data: CreateUserParams): Promise<UserItem> {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data: UpdateUserParams): Promise<UserItem> {
  return request({
    url: `/users/${data.id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id: number): Promise<void> {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}