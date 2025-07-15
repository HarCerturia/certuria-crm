<template>
  <div ref="profileDropdown" class="relative">
    <UButton
      variant="ghost"
      class="flex items-center space-x-3"
      @click="profileOpen = !profileOpen"
    >
      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {{ userInitials }}
      </div>
      <div class="hidden md:block text-left">
        <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
        <p class="text-xs text-gray-500">{{ userEmail }}</p>
      </div>
      <UIcon name="i-lucide-chevron-down" class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': profileOpen }" />
    </UButton>

    <!-- Dropdown menu -->
    <div
      v-if="profileOpen"
      class="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl py-2 z-50"
    >
      <!-- User info -->
      <div class="px-4 py-3 border-b border-gray-100">
        <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
        <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
      </div>

      <!-- Menu items -->
      <div class="py-1">
        <UButton variant="ghost" size="sm" class="w-full justify-start">
          <UIcon name="i-lucide-user" class="w-4 h-4 mr-3" />
          Profil anzeigen
        </UButton>

        <UButton variant="ghost" size="sm" class="w-full justify-start">
          <UIcon name="i-lucide-settings" class="w-4 h-4 mr-3" />
          Einstellungen
        </UButton>

        <hr class="my-1 border-gray-100">

        <UButton variant="ghost" size="sm" class="w-full justify-start">
          <UIcon name="i-lucide-help-circle" class="w-4 h-4 mr-3" />
          Hilfe & Support
        </UButton>

        <hr class="my-1 border-gray-100">

        <UButton
          variant="ghost"
          size="sm"
          color="error"
          :loading="logoutLoading"
          :disabled="logoutLoading"
          class="w-full justify-start"
          @click="handleLogout"
        >
          <UIcon name="i-lucide-log-out" class="w-4 h-4 mr-3" />
          {{ logoutLoading ? 'Abmelden...' : 'Abmelden' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/domains/core/stores/auth.js"

const profileOpen = ref(false)
const logoutLoading = ref(false)
const profileDropdown = ref(null)

// Get auth store
const authStore = useAuthStore()

// User info
const userName = computed(() => authStore.user?.name || 'Benutzer')
const userEmail = computed(() => authStore.user?.email || '')
const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
})

// Logout function
const handleLogout = async () => {
  logoutLoading.value = true
  profileOpen.value = false

  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
    // Force logout on client even if server fails
    authStore.user = null
    authStore.isAuthenticated = false
  } finally {
    logoutLoading.value = false
    await navigateTo('/')
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
      profileOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
