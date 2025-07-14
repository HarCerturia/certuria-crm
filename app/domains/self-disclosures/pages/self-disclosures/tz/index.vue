<template>
  <div class="space-y-8">
    <!-- Page header with integrated search and filters -->
    <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg text-white">
      <div class="px-8 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Left side: Title and description -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">Selbstauskünfte zur Trägerzulassung</h1>
            <p class="text-green-100 text-lg">Ausschließlich signierte Anträge werden hier angezeigt.</p>
          </div>

          <!-- Right side: Search and filters -->
          <div class="flex-shrink-0 lg:max-w-4xl lg:w-1/2">
            <div class="space-y-4">
              <!-- Search Input -->
              <UInput
                v-model="searchQuery"
                placeholder="Nach Träger suchen..."
                size="lg"
                icon="i-lucide-search"
                :ui="{
                  base: 'transition-all duration-200',
                }"
              />

              <!-- Status Filter -->
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <label
                    v-for="option in statusOptions"
                    :key="option.value"
                    class="flex items-center space-x-2 cursor-pointer group bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition-colors"
                  >
                    <input
                      v-model="selectedStatusValue"
                      :value="option.value"
                      type="radio"
                      name="statusFilter"
                      class="text-green-600"
                    />
                    <div class="flex items-center space-x-2">
                      <UIcon
                        :name="option.icon"
                        class="w-4 h-4 text-white"
                      />
                      <span class="text-sm font-medium text-white">{{ option.label }}</span>
                      <UBadge
                        v-if="option.value"
                        color="neutral"
                        variant="solid"
                        size="sm"
                        class="ml-1"
                      >
                        {{ getFilterCount(option.value) }}
                      </UBadge>
                      <UBadge
                        v-else
                        color="neutral"
                        variant="solid"
                        size="sm"
                        class="ml-1"
                      >
                        {{ getFilterCount('') }}
                      </UBadge>
                    </div>
                  </label>
                </div>

                <!-- Clear Filters -->
                <div v-if="searchQuery || selectedStatusValue" class="mt-3 flex justify-end">
                  <UButton
                    variant="solid"
                    color="neutral"
                    size="sm"
                    @click="clearFilters"
                  >
                    <UIcon name="i-lucide-x" class="w-4 h-4 mr-2" />
                    Zurücksetzen
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Results Info -->
        <div v-if="searchQuery || selectedStatusValue" class="mt-6 pt-4 border-t border-white/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-sm text-green-100">
              <UIcon name="i-lucide-info" class="w-4 h-4" />
              <span>
                {{ filteredData.length }} von {{ data.length }} Einträgen
                <span v-if="searchQuery">für "<strong class="text-white">{{ searchQuery }}</strong>"</span>
                <span v-if="selectedStatusValue"> mit Status "<strong class="text-white">{{ statusOptions.find(opt => opt.value === selectedStatusValue)?.label }}</strong>"</span>
              </span>
            </div>
            <div v-if="filteredData.length === 0" class="text-sm text-yellow-200">
              <span v-if="status === 'pending'">Suche...</span>
              <span v-else>Keine Ergebnisse gefunden</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <UAlert v-if="error" color="error" icon="i-lucide-alert-circle" :title="error.message" />

    <!-- Responsive Card Grid -->
    <div class="relative">
      <!-- Loading Overlay -->
      <div
        v-if="status === 'pending' || isNavigating"
        class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin text-info-600" />
          <span class="text-sm font-medium text-gray-600">
            {{ isNavigating ? 'Lade Seite...' : 'Lade Selbstauskünfte...' }}
          </span>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
        <div
          v-for="(row, index) in filteredData"
          :key="index"
          class="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-info-300 transition-all duration-300 overflow-hidden relative"
        >
          <!-- Corner Ribbon Badge -->
          <RibbonBadge
            :text="getStatusText(row)"
            :color="getStatusConfig(row).color"
            :icon="getStatusIcon(row)"
            size="sm"
            corner
          />
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-info-50 to-primary-50 px-6 py-4 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-info-100 rounded-lg flex items-center justify-center group-hover:bg-info-200 transition-colors">
                  <UIcon name="i-lucide-file-text" class="w-5 h-5 text-info-600" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900">Selbstauskunft</h3>
                  <p class="text-xl text-gray-500">Trägerzulassung</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-6 space-y-4">
            <!-- Submission ID -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <UIcon name="i-lucide-hash" class="w-4 h-4 text-gray-400" />
                <span class="text-xl text-gray-600">ID</span>
              </div>
              <UBadge
                variant="subtle"
                color="info"
                size="lg"
                class="font-mono tracking-wide text-xl"
              >
                {{ row.submissionId }}
              </UBadge>
            </div>

            <!-- Träger -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <UIcon name="i-lucide-building-2" class="w-4 h-4 text-gray-400" />
                <span class="text-xl text-gray-600">Träger</span>
              </div>
              <span class="text-xl font-medium text-gray-900 truncate max-w-64" :title="getCarrierName(row)">
                {{ getCarrierName(row) }}
              </span>
            </div>

            <!-- Signiert am -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-400" />
                <span class="text-3sm text-gray-600">Signiert am</span>
              </div>
              <div class="text-right">
                <NuxtTime
                  :datetime="row.$createdAt"
                  year="numeric"
                  month="short"
                  day="numeric"
                  hour="2-digit"
                  minute="2-digit"
                  class="text-3sm font-medium text-gray-700 block"
                />
              </div>
            </div>

          </div>

          <!-- Card Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
            <UButton
              v-if="getStatusConfig(row).component === 'UButton'"
              v-bind="getActionProps(row)"
              class="transform group-hover:scale-105 transition-transform duration-200 cursor-default min-w-32"
            >
              <UIcon :name="getActionIcon(row)" class="w-4 h-4 mr-2" />
              {{ getActionText(row) }}
            </UButton>
            <UBadge
              v-else
              v-bind="getActionProps(row)"
              class="transform group-hover:scale-105 transition-transform duration-200 cursor-default min-w-32 h-10 flex items-center justify-center"
            >
              <UIcon :name="getActionIcon(row)" class="w-4 h-4 mr-2" />
              {{ getActionText(row) }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredData.length === 0 && data.length > 0" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-lucide-search-x" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Keine Treffer gefunden</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-4">
          Ihre Suche ergab keine Ergebnisse. Versuchen Sie andere Suchbegriffe oder entfernen Sie Filter.
        </p>
        <UButton variant="outline" @click="clearFilters">
          <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 mr-2" />
          Filter zurücksetzen
        </UButton>
      </div>

      <!-- No Data State -->
      <div v-else-if="data.length === 0 && status !== 'pending'" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-lucide-inbox" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Keine Selbstauskünfte</h3>
        <p class="text-gray-500 max-w-md mx-auto">
          Es wurden noch keine signierten Anträge gefunden. Neue Anträge erscheinen hier automatisch nach der Signierung.
        </p>
      </div>
    </div>

    <!-- Card-Style Pagination -->
    <div v-if="pagination" class="mt-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Info Section -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <div class="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                <UIcon name="i-lucide-layers" class="w-4 h-4 text-info-600" />
              </div>
              <div>
                <span class="font-medium text-gray-900">
                  Seite {{ getCurrentPageInfo().currentPage }}
                </span>
                <span class="text-gray-400 mx-2">•</span>
                <span>{{ filteredData.length }} {{ filteredData.length === data.length ? 'Karten' : 'gefilterte Karten' }}</span>
                <span v-if="filteredData.length !== data.length" class="text-gray-400">
                  von {{ data.length }} geladen
                </span>
                <span v-else-if="pagination.total > 0" class="text-gray-400">
                  von {{ pagination.total }} insgesamt
                </span>
              </div>
            </div>
          </div>

          <!-- Navigation Section -->
          <div class="flex items-center space-x-3">
            <UButton
              :disabled="pageHistory.length === 0 || isNavigating"
              :loading="isNavigating"
              variant="outline"
              size="md"
              color="neutral"
              class="shadow-sm"
              @click="goToPrevPage"
            >
              <UIcon v-if="!isNavigating" name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
              Vorherige
            </UButton>

            <UButton
              :disabled="!pagination.hasNext || isNavigating"
              :loading="isNavigating"
              variant="solid"
              size="md"
              color="info"
              class="shadow-sm"
              @click="goToNextPage"
            >
              Nächste
              <UIcon v-if="!isNavigating" name="i-lucide-arrow-right" class="w-4 h-4 ml-2" />
            </UButton>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import RibbonBadge from '~/components/ui/RibbonBadge.vue'

// Define TypeScript interface for self-disclosure data
interface SelfDisclosureRecord {
  $id: string
  submissionId: string
  $createdAt: string
  documents: string // JSON string
  combinedDocumentUrl: string
  proposalStatus?: string
  bearerName?: string // Optional bearerName field
}

interface PaginationInfo {
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
  firstCursor: string | null
  lastCursor: string | null
}

interface ApiResponse {
  documents: SelfDisclosureRecord[]
  pagination: PaginationInfo
  statusCounts: Record<string, number>
}

definePageMeta({ middleware: 'auth' })

// Cursor-based pagination state
const currentCursor = ref<string | null>(null)
const direction = ref<'after' | 'before'>('after')
const pageSize = ref(20)
const pageHistory = ref<Array<{ cursor: string | null, documents: SelfDisclosureRecord[] }>>([])
const isNavigating = ref(false)

// Search and filter state
const searchQuery = ref('')
const selectedStatusValue = ref('')

// Status configuration types
interface StatusConfig {
  label: string
  icon: string
  color: 'info' | 'success' | 'error'
  actionText: string
  actionIcon: string
  actionColor: 'info' | 'success' | 'error'
  actionVariant: 'solid' | 'soft' | 'outline'
  component: 'UButton' | 'UBadge'
  disabled?: boolean
  getPath?: (row: SelfDisclosureRecord) => { path: string; query: Record<string, string> }
}

// Status configuration - single source of truth
const statusConfig: Record<string, StatusConfig> = {
  pending: {
    label: 'Ausstehend',
    icon: 'i-lucide-clock',
    color: 'info',
    actionText: 'Antrag prüfen',
    actionIcon: 'i-lucide-eye',
    actionColor: 'info',
    actionVariant: 'soft',
    component: 'UButton',
    getPath: (row: SelfDisclosureRecord) => ({ path: `/self-disclosures/${row.submissionId}`, query: { dId: row.$id } })
  },
  approved: {
    label: 'Genehmigt',
    icon: 'i-lucide-check-circle',
    color: 'success',
    actionText: 'Angebot erstellen',
    actionIcon: 'i-lucide-plus-circle',
    actionColor: 'success',
    actionVariant: 'soft',
    component: 'UButton',
    getPath: (row: SelfDisclosureRecord) => ({ path: '/offers/create', query: { sId: row.submissionId } })
  },
  rejected: {
    label: 'Abgelehnt',
    icon: 'i-lucide-x-circle',
    color: 'error',
    actionText: 'Antrag abgelehnt',
    actionIcon: 'i-lucide-x-circle',
    actionColor: 'error',
    actionVariant: 'soft',
    component: 'UButton',
    disabled: true
  }
}

// Optimized helper functions
const getCarrierName = (row: SelfDisclosureRecord) =>
  row.bearerName || parsedDocumentsMap.value.get(row.$id)?.[0]?.name || 'N/A'

const getStatusConfig = (row: SelfDisclosureRecord): StatusConfig => {
  const status = row.proposalStatus || 'pending'
  return statusConfig[status] || statusConfig.pending
}

// Derived helper functions
const getActionText = (row: SelfDisclosureRecord) => getStatusConfig(row).actionText
const getActionIcon = (row: SelfDisclosureRecord) => getStatusConfig(row).actionIcon
const getStatusText = (row: SelfDisclosureRecord) => getStatusConfig(row).label
const getStatusIcon = (row: SelfDisclosureRecord) => getStatusConfig(row).icon

const getActionProps = (row: SelfDisclosureRecord) => {
  const config = getStatusConfig(row)
  const props: Record<string, any> = {
    color: config.actionColor,
    variant: config.actionVariant,
    size: 'md'
  }

  if (config.disabled) {
    props.disabled = true
  } else if (config.getPath) {
    props.onClick = () => navigateTo(config.getPath!(row))
  }

  return props
}

// Status filter options
const statusOptions = [
  { label: 'Alle', value: '', icon: 'i-lucide-list', color: 'neutral' },
  ...Object.entries(statusConfig).map(([key, config]) => ({
    label: config.label,
    value: key,
    icon: config.icon,
    color: config.color
  }))
]

// Fetch data with typed response and cursor-based pagination
const { data: apiResponse, status, error, refresh } = await useFetch<ApiResponse>('/api/self-disclosures', {
  lazy: true,
  query: {
    cursor: currentCursor,
    direction: direction,
    limit: pageSize,
    search: searchQuery,
    statusFilter: selectedStatusValue
  }
})

// Extract data from API response
const data = computed(() => apiResponse.value?.documents || [])
const pagination = computed(() => apiResponse.value?.pagination)
const filteredData = computed(() => data.value) // Server-side filtering
const statusCounts = computed(() => apiResponse.value?.statusCounts || {})

// Clear all filters and reset pagination
const clearFilters = () => {
  searchQuery.value = ''
  selectedStatusValue.value = ''
  currentCursor.value = null
  pageHistory.value = []
  refresh()
}

// Watch for filter changes to reset pagination and refresh data
watch([searchQuery, selectedStatusValue], () => {
  currentCursor.value = null
  pageHistory.value = []
  refresh()
})

const getFilterCount = (statusValue: string) => {
  if (!statusValue) {
    return statusCounts.value?.grandTotal || 0
  }
  return statusCounts.value?.[statusValue] || 0
}


// Memoized JSON parsing for better performance
const parsedDocumentsMap = shallowRef(new Map())

// Update parsed documents when API response changes
watchEffect(() => {
  if (!apiResponse.value?.documents) {
    parsedDocumentsMap.value = new Map()
    return
  }

  const newMap = new Map()
  for (const record of apiResponse.value.documents) {
    try {
      newMap.set(record.$id, JSON.parse(record.documents))
    } catch {
      newMap.set(record.$id, [])
    }
  }
  parsedDocumentsMap.value = newMap
})


// Cursor-based pagination handlers
const goToNextPage = async () => {
  if (pagination.value?.hasNext && pagination.value?.lastCursor) {
    isNavigating.value = true

    try {
      pageHistory.value.push({
        cursor: currentCursor.value,
        documents: [...data.value]
      })

      currentCursor.value = pagination.value.lastCursor
      direction.value = 'after'
      await refresh()
    } finally {
      isNavigating.value = false
    }
  }
}

const goToPrevPage = async () => {
  if (pageHistory.value.length > 0) {
    isNavigating.value = true

    try {
      const previousPage = pageHistory.value.pop()
      if (previousPage) {
        currentCursor.value = previousPage.cursor
        direction.value = 'after'
        await refresh()
      }
    } finally {
      isNavigating.value = false
    }
  }
}

// Helper function to get current page info for cursor-based pagination
const getCurrentPageInfo = () => {
  if (!pagination.value) return { currentPage: 1, totalLoaded: 0 }

  const currentPage = pageHistory.value.length + 1
  const totalLoaded = currentPage * pagination.value.limit

  return { currentPage, totalLoaded }
}
</script>
