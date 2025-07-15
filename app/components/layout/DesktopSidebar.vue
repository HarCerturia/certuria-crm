<template>
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
            class="group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out"
            :class="$route.path === '/dashboard'
             ? 'bg-gradient-to-br from-blue-500 to-purple-600  text-white shadow-sm'
             : 'text-gray-700 hover:text-white hover:bg-gradient-to-br from-blue-500 to-purple-600 '"
          >
            <UIcon
              name="i-lucide-home"
              class="mr-3 h-4 w-4 transition-all duration-200"
            />
            <span class="font-medium">Dashboard</span>
          </NuxtLink>
        </div>

        <!-- CRM Section -->
        <div class="mb-6">
          <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-gray-700 mb-4 drop-shadow-sm">
            CRM
          </h3>

          <!-- Selbstauskünfte Trägerzulassung -->
          <NuxtLink
              to="/self-disclosures"
              class="group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out"
              :class="$route.path.startsWith('/self-disclosures')
              ? 'bg-gradient-to-br from-blue-500 to-purple-600  text-white shadow-sm'
              : 'text-gray-700 hover:text-white hover:bg-gradient-to-br from-blue-500 to-purple-600 '"
          >
            <UIcon
              name="i-lucide-file-text"
              class="mr-3 h-4 w-4 transition-all duration-200"
            />
            <span class="font-medium">Selbstauskünfte</span>
          </NuxtLink>

          <!-- Angebote -->
          <NuxtLink
              to="/offers"
              class="group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out"
              :class="$route.path.startsWith('/offers')
              ? 'bg-gradient-to-br from-blue-500 to-purple-600  text-white shadow-sm'
              : 'text-gray-700 hover:text-white hover:bg-gradient-to-br from-blue-500 to-purple-600 '"
          >
            <UIcon
              name="i-lucide-file-plus"
              class="mr-3 h-4 w-4 transition-all duration-200"
            />
            <span class="font-medium">Angebote</span>
          </NuxtLink>

          <!-- Auditoren -->
          <NuxtLink
              to="/auditors"
              class="group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out"
              :class="$route.path.startsWith('/auditors')
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-white hover:bg-gradient-to-br from-blue-500 to-purple-600 '"
          >
            <UIcon
                name="i-lucide-shield"
                class="mr-3 h-4 w-4 transition-all duration-200"
            />
            <span class="font-medium">Auditoren</span>
          </NuxtLink>
        </div>

        <!-- Admin Section -->
        <div class="mb-6">
          <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-gray-600 mb-4 drop-shadow-sm">
            Administration
          </h3>
          <NuxtLink
            to="/admin"
            class="group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-out"
            :class="$route.path.startsWith('/admin')
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-white hover:bg-gradient-to-br from-blue-500 to-purple-600 '"
          >
            <UIcon
              name="i-lucide-settings"
              class="mr-3 h-4 w-4 transition-all duration-200"
            />
            <span class="font-medium">Administration</span>
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
</template>

<script setup lang="ts">
const currentYear = computed(() => new Date().getFullYear())
</script>
