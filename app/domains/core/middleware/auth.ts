import {useAuthStore} from "~/domains/core/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) {
    const authStore = useAuthStore()

    // Check auth on page load if not authenticated
    if (!authStore.isAuthenticated) {
      const isAuthenticated = await authStore.checkAuth()
      if (!isAuthenticated) {
        return navigateTo('/')
      }
    }
  }
})
