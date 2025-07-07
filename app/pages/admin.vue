<template>
  <div class="space-y-8">
    <!-- Page header -->
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-3xl"/>
      <div class="relative p-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Administration
        </h1>
        <p class="mt-2 text-lg text-gray-600">
          System-Verwaltung und Konfiguration
        </p>
      </div>
    </div>

    <!-- User Management Section -->
    <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Benutzerverwaltung</h2>
            <p class="text-sm text-gray-500">{{ users.length }} Benutzer registriert</p>
          </div>
        </div>
        <button
          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          @click="showAddUserModal = true"
        >
          <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Benutzer hinzufügen
        </button>
      </div>

      <!-- Users Table -->
      <div class="overflow-hidden shadow-lg ring-1 ring-gray-200 rounded-xl">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Benutzer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rolle
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Letzter Login
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Aktionen</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {{ user.initials }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="user.status === 'active' ? 'green' : 'red'"
                  variant="subtle"
                  class="inline-flex items-center"
                >
                  <div
:class="user.status === 'active' ? 'bg-green-400' : 'bg-red-400'"
                       class="h-1.5 w-1.5 rounded-full mr-1.5"/>
                  {{ user.status === 'active' ? 'Aktiv' : 'Inaktiv' }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="user.role === 'admin' ? 'purple' : 'gray'"
                  variant="subtle"
                >
                  {{ user.role === 'admin' ? 'Administrator' : 'Benutzer' }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lastLogin }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <UButton
                    icon="i-lucide-edit"
                    color="blue"
                    variant="ghost"
                    size="sm"
                    @click="editUser(user)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    color="red"
                    variant="ghost"
                    size="sm"
                    @click="deleteUser(user)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <UModal v-model:open="showAddUserModal" :ui="{ width: 'sm:max-w-lg' }" title="Neuen Benutzer hinzufügen">

        <template #body>
          <UForm class="space-y-4" @submit.prevent="addUser">
            <UFormField label="Name" required>
              <UInput
                v-model="newUser.name"
                placeholder="Vollständiger Name"
                required
              />
            </UFormField>

            <UFormField label="E-Mail" required>
              <UInput
                v-model="newUser.email"
                type="email"
                placeholder="benutzer@beispiel.de"
                required
              />
            </UFormField>

            <UFormField label="Passwort" required>
              <UInput
                v-model="newUser.password"
                type="password"
                placeholder="Mindestens 8 Zeichen"
                required
              />
            </UFormField>

            <UFormField label="Rolle">
              <USelect
                v-model="newUser.role"
                :options="[
                  { label: 'Benutzer', value: 'user' },
                  { label: 'Administrator', value: 'admin' }
                ]"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormField>

            <div class="flex items-center justify-end space-x-3 pt-4">
              <UButton
                color="gray"
                variant="solid"
                @click="showAddUserModal = false"
              >
                Abbrechen
              </UButton>
              <UButton
                type="submit"
                :loading="addingUser"
                :disabled="addingUser"
              >
                {{ addingUser ? 'Wird hinzugefügt...' : 'Benutzer hinzufügen' }}
              </UButton>
            </div>
          </UForm>
        </template>
    </UModal>


    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- System Status -->
      <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">System Status</h3>
          <div class="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <div class="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"/>
            Alle Systeme betriebsbereit
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"/>
              <span class="text-sm font-medium text-gray-900">Appwrite Backend</span>
            </div>
            <span class="text-sm text-green-600 font-medium">Online</span>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"/>
              <span class="text-sm font-medium text-gray-900">Datenbank</span>
            </div>
            <span class="text-sm text-green-600 font-medium">Verbunden</span>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"/>
              <span class="text-sm font-medium text-gray-900">API Services</span>
            </div>
            <span class="text-sm text-green-600 font-medium">Aktiv</span>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 bg-yellow-500 rounded-full animate-pulse"/>
              <span class="text-sm font-medium text-gray-900">Backup Service</span>
            </div>
            <span class="text-sm text-yellow-600 font-medium">Wartung</span>
          </div>
        </div>
      </div>

      <!-- Recent Admin Activities -->
      <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Admin-Aktivitäten</h3>
          <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200">
            Alle Logs anzeigen
            <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div class="flow-root">
          <ul role="list" class="-mb-8 space-y-4">
            <li v-for="(activity) in adminActivities" :key="activity.id">
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
                    <span
class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="activity.statusColor">
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

    <!-- Quick Admin Actions -->
    <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Schnelle Admin-Aktionen</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button class="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-blue-700 font-medium hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
          <svg class="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Benutzer hinzufügen
        </button>

        <button class="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-emerald-700 font-medium hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group">
          <svg class="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18.75 19.5H6.75Z" />
          </svg>
          Backup erstellen
        </button>

        <button class="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl text-purple-700 font-medium hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
          <svg class="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.932 6.932 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          System-Config
        </button>

        <button class="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-red-700 font-medium hover:from-red-100 hover:to-red-200 transition-all duration-200 group">
          <svg class="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          Sicherheits-Logs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

// User management state
const showAddUserModal = ref(false)
const addingUser = ref(false)

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'user'
})


const users = ref([
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@certuria.com',
    initials: 'DU',
    status: 'active',
    role: 'admin',
    lastLogin: 'vor 2 Min'
  },
  {
    id: 2,
    name: 'Max Mustermann',
    email: 'max.mustermann@beispiel.de',
    initials: 'MM',
    status: 'active',
    role: 'user',
    lastLogin: 'vor 1 Std'
  },
  {
    id: 3,
    name: 'Anna Weber',
    email: 'anna.weber@beispiel.de',
    initials: 'AW',
    status: 'active',
    role: 'user',
    lastLogin: 'vor 3 Std'
  },
  {
    id: 4,
    name: 'Peter Schmidt',
    email: 'peter.schmidt@beispiel.de',
    initials: 'PS',
    status: 'inactive',
    role: 'user',
    lastLogin: 'vor 2 Tagen'
  }
])

// User actions
const editUser = (user) => {
  console.log('Edit user:', user)
  // TODO: Implement edit functionality
}

const deleteUser = (user) => {
  console.log('Delete user:', user)
  // TODO: Implement delete functionality
}

// Add user function
const addUser = async () => {
  addingUser.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate initials
    const nameParts = newUser.value.name.split(' ')
    const initials = nameParts.map(part => part[0]).join('').toUpperCase()

    // Add user to list
    const newUserData = {
      id: users.value.length + 1,
      name: newUser.value.name,
      email: newUser.value.email,
      initials: initials,
      status: 'active',
      role: newUser.value.role,
      lastLogin: 'Noch nie'
    }

    users.value.unshift(newUserData)

    // Reset form
    newUser.value = {
      name: '',
      email: '',
      password: '',
      role: 'user'
    }

    showAddUserModal.value = false
  } catch (error) {
    console.error('Error adding user:', error)
  } finally {
    addingUser.value = false
  }
}

const adminActivities = ref([
  {
    id: 1,
    description: 'Neuer Benutzer erstellt',
    details: 'Admin hat Benutzer "Max Weber" hinzugefügt',
    time: 'vor 1h',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconPath: 'M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z',
    statusColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 2,
    description: 'System-Backup durchgeführt',
    details: 'Automatisches Backup erfolgreich abgeschlossen',
    time: 'vor 3h',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    iconPath: 'M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18.75 19.5H6.75Z',
    statusColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 3,
    description: 'Konfiguration geändert',
    details: 'API-Einstellungen wurden aktualisiert',
    time: 'vor 5h',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    iconPath: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.932 6.932 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z',
    statusColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 4,
    description: 'Sicherheits-Scan durchgeführt',
    details: 'Keine Bedrohungen gefunden - System sicher',
    time: 'gestern',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
    iconPath: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
    statusColor: 'bg-red-100 text-red-800'
  }
])
</script>
