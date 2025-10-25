import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  roles: string[]
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  
  const isLoggedIn = computed(() => !!token.value)
  const hasRole = (role: string) => user.value?.roles.includes(role) || false
  
  function setUser(userData: User) {
    user.value = userData
  }
  
  function setToken(tokenValue: string) {
    token.value = tokenValue
    localStorage.setItem('token', tokenValue)
  }
  
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { 
    user, 
    token, 
    isLoggedIn, 
    hasRole, 
    setUser, 
    setToken, 
    logout 
  }
})
