<template>
  <div class="space-y-8">
    <!-- Page header -->
    <PageHeader
      title="Dashboard"
      description="Willkommen zurück! Hier ist eine Übersicht Ihrer wichtigsten KPIs."
      variant="teal"
    />

    <!-- Modern Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Revenue Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"/>
        <div class="relative">
          <div class="flex items-center justify-between">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">+12.3%</div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-blue-100">Gesamtumsatz</h3>
            <p class="text-2xl font-bold text-white">€125,430</p>
          </div>
        </div>
      </div>

      <!-- Offers Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"/>
        <div class="relative">
          <div class="flex items-center justify-between">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">+5</div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-emerald-100">Angebote</h3>
            <p class="text-2xl font-bold text-white">23</p>
          </div>
        </div>
      </div>

      <!-- Customers Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"/>
        <div class="relative">
          <div class="flex items-center justify-between">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">+8</div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-purple-100">Kunden</h3>
            <p class="text-2xl font-bold text-white">156</p>
          </div>
        </div>
      </div>

      <!-- Conversion Card -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"/>
        <div class="relative">
          <div class="flex items-center justify-between">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
            </div>
            <div class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">+2.1%</div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-medium text-amber-100">Conversion</h3>
            <p class="text-2xl font-bold text-white">24.8%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Recent Activities -->
      <div class="lg:col-span-2">
        <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Letzte Aktivitäten</h3>
            <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
              Alle anzeigen
              <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          <div class="flow-root">
            <ul role="list" class="-mb-8 space-y-6">
              <li v-for="activity in recentActivities" :key="activity.id">
                <div class="relative flex space-x-4">
                  <div
class="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                       :class="activity.iconBg">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="activity.iconPath" />
                    </svg>
                  </div>
                  <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                      <p class="text-sm text-gray-500">{{ activity.details }}</p>
                    </div>
                    <div class="whitespace-nowrap text-right text-sm text-gray-500">
                      <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {{ activity.time }}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Quick Actions and Tasks -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
          <div class="space-y-3">
            <button class="w-full flex items-center justify-start px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-blue-700 font-medium hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
              <svg class="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Neuer Kontakt
            </button>
            <button class="w-full flex items-center justify-start px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-emerald-700 font-medium hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group">
              <svg class="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Angebot erstellen
            </button>
            <button class="w-full flex items-center justify-start px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl text-purple-700 font-medium hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
              <svg class="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-4.5-6.75h.008v.008H16.5V12Zm-3.75 0h.008v.008H12.75V12Zm-3.75 0h.008v.008H9V12Zm-3.75 0h.008v.008H5.25V12Z" />
              </svg>
              Termin planen
            </button>
          </div>
        </div>

        <!-- Upcoming Tasks -->
        <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Anstehende Aufgaben</h3>
            <div class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              {{ upcomingTasks.length }} offen
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="task in upcomingTasks" :key="task.id" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ task.title }}</p>
                <p class="text-xs text-gray-500">{{ task.dueDate }}</p>
              </div>
              <div class="h-2 w-2 rounded-full" :class="task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const recentActivities = ref([
  {
    id: 1,
    description: 'Neuer Kontakt hinzugefügt',
    details: 'Max Mustermann wurde zum System hinzugefügt',
    time: 'vor 2h',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconPath: 'M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
  },
  {
    id: 2,
    description: 'Angebot versendet',
    details: 'Angebot #2024-001 an ABC GmbH gesendet',
    time: 'vor 4h',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    iconPath: 'M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
  },
  {
    id: 3,
    description: 'Meeting abgeschlossen',
    details: 'Kundengespräch mit XYZ AG erfolgreich beendet',
    time: 'vor 6h',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    iconPath: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z'
  },
  {
    id: 4,
    description: 'Rechnung bezahlt',
    details: 'Rechnung #INV-2024-045 wurde beglichen',
    time: 'gestern',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    iconPath: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z'
  }
])

const upcomingTasks = ref([
  {
    id: 1,
    title: 'Follow-up Call mit Kunde XYZ',
    dueDate: 'Heute, 14:00',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Angebot für Projekt ABC finalisieren',
    dueDate: 'Morgen',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Quartalsbericht erstellen',
    dueDate: 'Diese Woche',
    priority: 'low'
  }
])
</script>
