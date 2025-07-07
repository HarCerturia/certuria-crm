<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"/>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"/>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"/>
    </div>

    <!-- Login card -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo section -->
      <div class="text-center mb-8">
        <div class="flex justify-center">
          <NuxtImg
            src="/logo-certuria.png"
            alt="Certuria Logo"
            class="w-auto h-auto max-h-20 sm:max-h-24 md:max-h-32 lg:max-h-36 max-w-sm object-contain filter drop-shadow-sm"
            loading="eager"
          />
        </div>
      </div>

      <!-- Login form -->
      <div class="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Email field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                :disabled="loading"
                class="w-full pl-3 py-3 bg-white/50 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                placeholder="ihre.email@beispiel.de"
              >
            </div>
          </div>

          <!-- Password field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5A2.25 2.25 0 0 0 19.5 18v-7.5A2.25 2.25 0 0 0 17.25 8.25H6.75A2.25 2.25 0 0 0 4.5 10.5v7.5A2.25 2.25 0 0 0 6.75 19.5Z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="loading"
                class="w-full pl-3 py-3 bg-white/50 backdrop-blur border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                placeholder="••••••••"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="loading"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Password forgot -->
          <div class="flex items-center justify-between">
            <button
              type="button"
              class="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
              :disabled="loading"
            >
              Passwort vergessen?
            </button>
          </div>

          <!-- Error message -->
          <div v-if="error" class="rounded-xl bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading || !email || !password"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ loading ? 'Anmeldung läuft...' : 'Anmelden' }}
          </button>
        </form>

        <!-- Demo credentials -->
        <div class="mt-6 p-4 bg-blue-50/50 backdrop-blur border border-blue-200/50 rounded-xl">
          <p class="text-xs text-blue-600 font-medium mb-2">Demo-Zugangsdaten:</p>
          <div class="text-xs text-blue-500 space-y-1">
            <p>E-Mail: demo4@certuria.com</p>
            <p>Passwort: demo12345$i_</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          © {{ currentYear }} Certuria CRM. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/domains/core/stores/auth'
definePageMeta({
  middleware: 'guest',
  layout: false
})
const authStore = useAuthStore()

// Form data
const email = ref('')
const password = ref('')
const _rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Handle form submission
const handleLogin = async () => {
  if (!email.value || !password.value) return

  loading.value = true
  error.value = ''

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      await navigateTo('/dashboard')
    } else {
      error.value = result.error || 'Login fehlgeschlagen. Bitte versuchen Sie es erneut.'
    }
  } catch (err) {
    error.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())

// Auto-fill demo credentials on page load
onMounted(() => {
  email.value = 'demo4@certuria.com'
  password.value = 'demo12345$i_'
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
