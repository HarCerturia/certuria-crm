<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-50 lg:hidden"
      @click="$emit('close-sidebar')"
    >
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"/>
      <aside class="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out">
        <div class="flex h-full flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 shadow-2xl">
          <!-- Logo section -->
          <div class="flex h-20 flex-shrink-0 items-center px-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
            <div class="flex items-center space-x-3 w-full">
              <!-- Certuria Logo -->
              <div class="p-3 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20">
                <NuxtImg
                    width="250px"
                    src="/certuria-logo-2025.svg"
                    format="webp"
                    alt="Certuria"
                    class="order-1 xs:order-1"
                />
              </div>
            </div>

            <!-- Close button for mobile -->
            <UButton
              variant="ghost"
              size="sm"
              class="ml-auto lg:hidden"
              @click="$emit('close-sidebar')"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </UButton>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-3 px-4 py-8 overflow-y-auto">
            <!-- Dashboard Section -->
            <div class="mb-6">
              <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-blue-100/80 mb-4 drop-shadow-sm">
                Übersicht
              </h3>
              <NuxtLink
                to="/dashboard"
                class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
                :class="$route.path === '/dashboard'
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg backdrop-blur-sm'
                  : 'text-blue-100/90 hover:text-white hover:bg-white/15 hover:shadow-md'"
                @click="$emit('close-sidebar')"
              >
                <svg
                  class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300"
                  :class="$route.path === '/dashboard' ? 'text-white drop-shadow-sm' : 'text-blue-200/80 group-hover:text-white'"
                  fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span class="drop-shadow-sm">Dashboard</span>
              </NuxtLink>
            </div>

            <!-- CRM Section -->
            <div class="mb-6">
              <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-blue-100/80 mb-4 drop-shadow-sm">
                CRM
              </h3>
              <!-- Offers Section -->
              <NuxtLink
                to="/offers"
                class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
                :class="$route.path.startsWith('/offers')
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg backdrop-blur-sm'
                  : 'text-blue-100/90 hover:text-white hover:bg-white/15 hover:shadow-md'"
                @click="$emit('close-sidebar')"
              >
                <svg
                  class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300"
                  :class="$route.path.startsWith('/offers') ? 'text-white drop-shadow-sm' : 'text-blue-200/80 group-hover:text-white'"
                  fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span class="drop-shadow-sm">Angebote</span>
              </NuxtLink>
            </div>

            <!-- Admin Section -->
            <div class="mb-6">
              <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-blue-100/80 mb-4 drop-shadow-sm">
                Administration
              </h3>
              <NuxtLink
                to="/admin"
                class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
                :class="$route.path.startsWith('/admin')
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg backdrop-blur-sm'
                  : 'text-blue-100/90 hover:text-white hover:bg-white/15 hover:shadow-md'"
                @click="$emit('close-sidebar')"
              >
                <svg
                  class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300"
                  :class="$route.path.startsWith('/admin') ? 'text-white drop-shadow-sm' : 'text-blue-200/80 group-hover:text-white'"
                  fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.932 6.932 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span class="drop-shadow-sm">Administration</span>
              </NuxtLink>
            </div>
          </nav>

          <!-- Bottom section -->
          <div class="flex flex-shrink-0 border-t border-white/20 bg-white/5 backdrop-blur-sm p-6">
            <div class="flex w-full items-center justify-between">
              <div>
                <p class="text-xs font-medium text-blue-100/70 drop-shadow-sm">Version 1.0.0</p>
                <p class="text-xs font-medium text-blue-100/80 drop-shadow-sm">© {{ currentYear }} Certuria</p>
              </div>
              <div class="flex items-center space-x-2">
                <div class="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-sm"/>
                <span class="text-xs font-medium text-blue-100/70 drop-shadow-sm">Live</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Desktop sidebar -->
    <aside class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
      <div class="flex h-full flex-col bg-gradient-to-b from-white via-slate-200 to-gray-600 shadow-2xl">
        <!-- Logo section -->
        <div class="flex h-20 flex-shrink-0 items-center px-6 border-b border-gray-300/30 bg-white/70 backdrop-blur-sm">
          <div class="flex items-center space-x-3 w-full">
            <!-- Certuria Logo -->
            <NuxtImg
                width="250px"
                src="/certuria-logo-2025.svg"
                format="webp"
                alt="Certuria"
                class="order-1 xs:order-1"
            />
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-2 px-4 py-8 overflow-y-auto">
          <!-- Dashboard Section -->
          <div class="mb-6">
            <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-gray-800 mb-4 drop-shadow-sm">
              Übersicht
            </h3>
            <NuxtLink
              to="/dashboard"
              class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
              :class="$route.path === '/dashboard'
                ? 'bg-blue-600 text-white border border-blue-500 shadow-lg'
                : 'text-gray-700 hover:text-white hover:bg-blue-600 hover:shadow-md'"
            >
              <UIcon name="i-lucide-home" class="mr-3 h-5 w-5 flex-shrink-0" />
              <span>Dashboard</span>
            </NuxtLink>
          </div>

          <!-- CRM Section -->
          <div class="mb-6">
            <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-gray-700 mb-4 drop-shadow-sm">
              CRM
            </h3>

            <!-- Selbstauskünfte mit Submenu -->
            <div class="mb-2">
              <button
                class="group flex items-center w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
                :class="$route.path.startsWith('/self-disclosures')
                  ? 'bg-blue-600 text-white border border-blue-500 shadow-lg'
                  : 'text-gray-700 hover:text-white hover:bg-blue-600 hover:shadow-md'"
                @click="toggleSelfDisclosures"
              >
                <UIcon name="i-lucide-file-text" class="mr-3 h-5 w-5 flex-shrink-0" />
                <span class="flex-1 text-left">Selbstauskünfte</span>
                <UIcon
                  name="i-lucide-chevron-right"
                  class="h-4 w-4 transition-transform duration-200"
                  :class="{ 'rotate-90': selfDisclosuresOpen }"
                />
              </button>

              <!-- Submenu -->
              <div
                v-if="selfDisclosuresOpen"
                class="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4"
              >
                <NuxtLink
                  to="/self-disclosures/tz"
                  class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300"
                  :class="$route.path.startsWith('/self-disclosures/tz')
                    ? 'bg-blue-100 text-blue-800 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'"
                >
                  <UIcon name="i-lucide-shield-check" class="mr-2 h-4 w-4" />
                  <span>Trägerzulassungen</span>
                </NuxtLink>

                <NuxtLink
                  to="/self-disclosures/mz"
                  class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300"
                  :class="$route.path.startsWith('/self-disclosures/mz')
                    ? 'bg-blue-100 text-blue-800 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'"
                >
                  <UIcon name="i-lucide-clipboard-check" class="mr-2 h-4 w-4" />
                  <span>Maßnahmenzulassungen</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Angebote -->
            <NuxtLink
                to="/offers"
                class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
                :class="$route.path.startsWith('/offers')
                ? 'bg-blue-600 text-white border border-blue-500 shadow-lg'
                : 'text-gray-700 hover:text-white hover:bg-blue-600 hover:shadow-md'"
            >
              <UIcon name="i-lucide-file-plus" class="mr-3 h-5 w-5 flex-shrink-0" />
              <span>Angebote</span>
            </NuxtLink>
          </div>

          <!-- Admin Section -->
          <div class="mb-6">
            <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-gray-600 mb-4 drop-shadow-sm">
              Administration
            </h3>
            <NuxtLink
              to="/admin"
              class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
              :class="$route.path.startsWith('/admin')
                ? 'bg-blue-600 text-white border border-blue-500 shadow-lg'
                : 'text-gray-600 hover:text-white hover:bg-blue-600 hover:shadow-md'"
            >
              <UIcon name="i-lucide-settings" class="mr-3 h-5 w-5 flex-shrink-0" />
              <span>Administration</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Bottom section -->
        <div class="flex flex-shrink-0 border-t border-gray-400/30 bg-gray-500/20 backdrop-blur-sm p-4">
          <div class="flex w-full items-center justify-between">
            <div>
              <p class="text-xs text-white font-medium drop-shadow-sm">Version 1.0.0</p>
              <p class="text-xs text-white/90 drop-shadow-sm">© {{ currentYear }} Certuria</p>
            </div>
            <div class="flex items-center space-x-2">
              <div class="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-sm"/>
              <span class="text-xs text-white font-medium drop-shadow-sm">Live</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close-sidebar'])

const selfDisclosuresOpen = ref(false)

// Toggle function for self-disclosures menu
const toggleSelfDisclosures = () => {
  selfDisclosuresOpen.value = !selfDisclosuresOpen.value
}

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())
</script>