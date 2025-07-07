<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-50 lg:hidden"
      @click="sidebarOpen = false"
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
                  src="/logo-certuria.png"
                  alt="Certuria Logo"
                  class="h-8 w-auto max-w-[120px]"
                  loading="eager"
                />
              </div>
            </div>

            <!-- Close button for mobile -->
            <button
              class="ml-auto lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              @click="sidebarOpen = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
                @click="sidebarOpen = false"
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
                @click="sidebarOpen = false"
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
                @click="sidebarOpen = false"
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
                src="/logo-certuria.png"
                alt="Certuria Logo"
                class="h-14 w-auto max-w-[180px] filter brightness-100 contrast-110"
                loading="eager"
              />
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-3 px-4 py-8 overflow-y-auto">
          <!-- Dashboard Section -->
          <div class="mb-6">
            <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-gray-800 mb-4 drop-shadow-sm">
              Übersicht
            </h3>
            <NuxtLink
              to="/dashboard"
              class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
              :class="$route.path === '/dashboard'
                ? 'bg-gray-800 text-white border border-gray-700 shadow-lg'
                : 'text-gray-800 hover:text-white hover:bg-gray-700 hover:shadow-md'"
            >
              <svg
                class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300"
                :class="$route.path === '/dashboard' ? 'text-white' : 'text-gray-600 group-hover:text-white'"
                fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Dashboard</span>
            </NuxtLink>
          </div>

          <!-- CRM Section -->
          <div class="mb-6">
            <h3 class="px-3 text-xs font-bold uppercase tracking-widest text-gray-700 mb-4 drop-shadow-sm">
              CRM
            </h3>
            <NuxtLink
              to="/self-disclosures"
              class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
              :class="$route.path.startsWith('/self-disclosures')
                ? 'bg-gray-800 text-white border border-gray-700 shadow-lg'
                : 'text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md'"
            >
              <svg
                class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300"
                :class="$route.path.startsWith('/self-disclosures') ? 'text-white' : 'text-gray-600 group-hover:text-white'"
                fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span>Selbstauskünfte</span>
            </NuxtLink>
          <!-- Angebote -->
            <NuxtLink
                to="/offers"
                class="group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-sm"
                :class="$route.path.startsWith('/offers')
                ? 'bg-gray-800 text-white border border-gray-700 shadow-lg'
                : 'text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md'"
            >
              <svg
                  class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300"
                  :class="$route.path.startsWith('/offers') ? 'text-white' : 'text-gray-600 group-hover:text-white'"
                  fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
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
                ? 'bg-gray-800 text-white border border-gray-700 shadow-lg'
                : 'text-gray-600 hover:text-white hover:bg-gray-700 hover:shadow-md'"
            >
              <svg
                class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300"
                :class="$route.path.startsWith('/admin') ? 'text-white' : 'text-gray-500 group-hover:text-white'"
                fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.932 6.932 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
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

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Modern Header -->
      <header class="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">

        <div class="flex h-16 items-center justify-between gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <!-- Mobile menu button -->
          <button
            class="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
            @click="sidebarOpen = true"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <!-- Left side: Breadcrumb -->
            <div class="flex items-center">
              <nav class="flex" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2">
                  <li>
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </li>
                  <li>
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </li>
                  <li>
                    <span class="text-sm font-medium text-gray-900">{{ currentPageName }}</span>
                  </li>
                </ol>
              </nav>
            </div>

            <!-- Right side: Userinfo -->
            <div class="flex items-center gap-x-4 lg:gap-x-6">

              <!-- Notifications -->
              <button class="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-white/50 rounded-xl transition-all duration-200">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"/>
              </button>

              <!-- Profile Dropdown -->
              <div ref="profileDropdown" class="relative">
                <button
                  class="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200"
                  @click="profileOpen = !profileOpen"
                >
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {{ userInitials }}
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                    <p class="text-xs text-gray-500">{{ userEmail }}</p>
                  </div>
                  <svg class="h-4 w-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': profileOpen }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

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
                    <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      Profil anzeigen
                    </button>

                    <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.932 6.932 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      Einstellungen
                    </button>

                    <hr class="my-1 border-gray-100">

                    <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                      </svg>
                      Hilfe & Support
                    </button>

                    <hr class="my-1 border-gray-100">

                    <button
                      :disabled="logoutLoading"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                      @click="handleLogout"
                    >
                      <svg v-if="logoutLoading" class="animate-spin mr-3 h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <svg v-else class="mr-3 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                      </svg>
                      {{ logoutLoading ? 'Abmelden...' : 'Abmelden' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </header>

      <!-- Page content -->
      <main class="p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import {useAuthStore} from "~/domains/core/stores/auth.js";

const sidebarOpen = ref(false)
const profileOpen = ref(false)
const logoutLoading = ref(false)
const route = useRoute()

// Get auth store
const authStore = useAuthStore()

// Page name for breadcrumb
const currentPageName = computed(() => {
  const pageNames = {
    '/dashboard': 'Dashboard',
    '/self-disclosures': 'Selbstauskünfte zur Trägerzulassung',
    '/offers': 'Angebote',
    '/offers/create': 'Angebotserstellung',
    '/contacts': 'Kontakte',
    '/companies': 'Unternehmen',
    '/deals': 'Deals',
    '/tasks': 'Aufgaben',
    '/calendar': 'Kalender',
    '/reports': 'Berichte',
    '/settings': 'Einstellungen',
    '/admin': 'Administration'
  }
  return pageNames[route.path] || 'Dashboard'
})

// User info
const userName = computed(() => authStore.user?.name || 'Benutzer')
const userEmail = computed(() => authStore.user?.email || '')
const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
})

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())

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
const profileDropdown = ref(null)
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
