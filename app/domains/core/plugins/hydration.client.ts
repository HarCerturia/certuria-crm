export default defineNuxtPlugin({
  name: 'auth-hydration',
  dependsOn: ['auth-init'],
  setup() {
    // Get SSR context data
    const nuxtApp = useNuxtApp()
    
    // If we have user data from SSR, hydrate the store
    if (nuxtApp.ssrContext?.event?.context?.user) {
      const authStore = useAuthStore()
      authStore.user = nuxtApp.ssrContext.event.context.user
      authStore.isAuthenticated = true
    }
  }
})