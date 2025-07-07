import { defineStore } from 'pinia'

interface AuthState {
  user: {
    $id: string
    name: string
    email: string
    emailVerification: boolean
    prefs: Record<string, unknown>
  } | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false
  }),
  
  persist: true,

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const { data } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        
        this.user = data.user
        this.isAuthenticated = true
        
        await navigateTo('/dashboard')
        
        return { success: true }
      } catch (error: unknown) {
        const errorData = error as { data?: { message?: string }; message?: string }
        const errorMsg = errorData.data?.message || errorData.message || 'Login failed'
        console.error('Login error:', error)
        return { success: false, error: errorMsg }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST'
        })
        
        this.user = null
        this.isAuthenticated = false
        
        await navigateTo('/')
        
        return { success: true }
      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : 'Logout failed'
        console.error('Logout error:', error)
        this.user = null
        this.isAuthenticated = false
        await navigateTo('/')
        return { success: false, error: errorMsg }
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      // Don't reload if already authenticated
      if (this.isAuthenticated && this.user) {
        return true
      }
      
      this.loading = true
      try {
        const { data } = await $fetch('/api/auth/me')
        
        this.user = data.user
        this.isAuthenticated = true
        
        return true
      } catch (error: unknown) {
        const errorWithStatus = error as { statusCode?: number }
        // Only log error if it's not a 401 (expected when not logged in)
        if (errorWithStatus.statusCode !== 401) {
          console.error('Auth check failed:', error)
        }
        this.user = null
        this.isAuthenticated = false
        return false
      } finally {
        this.loading = false
      }
    },

    async register(email: string, password: string, name: string) {
      this.loading = true
      try {
        const { data } = await $fetch('/api/auth/register', {
          method: 'POST',
          body: { email, password, name }
        })
        
        this.user = data.user
        this.isAuthenticated = true
        
        await navigateTo('/dashboard')
        
        return { success: true }
      } catch (error: unknown) {
        const errorData = error as { data?: { message?: string }; message?: string }
        const errorMsg = errorData.data?.message || errorData.message || 'Registration failed'
        console.error('Registration error:', error)
        return { success: false, error: errorMsg }
      } finally {
        this.loading = false
      }
    }
  }
})