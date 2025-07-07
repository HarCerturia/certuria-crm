export default defineNuxtPlugin({
  name: 'auth-init',
  dependsOn: ['pinia'],
  hooks: {
    'app:mounted': async () => {
      // Run after app is fully mounted and hydrated
      try {
        const { useAuthStore } = await import('~/domains/core/stores/auth')
        const authStore = useAuthStore()
        
        // Always check auth on app initialization to restore session from cookie
        await authStore.checkAuth()
      } catch (error) {
        console.warn('Auth initialization failed:', error)
      }
    }
  }
})
