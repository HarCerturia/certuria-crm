<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { usePtCalc } from '~/domains/offers/composables/usePtCalc'
import { useInfiniteScroll } from '@vueuse/core'

//import PdfPreviewModal from "~/components/pdf/PdfPreviewModal.vue";

const route = useRoute();
const id = parseInt(route.query.sId as string)

const { data, status, error } = await useFetch(`/api/offers/create/${id}`)

const uniqueDeps = data.value.uniqueDeps;

const createLocation = (data: any, isCentral = false) => {
  const central = data.central;
  const dept = isCentral ? central.centralMeasuresDepartments : data.department;
  const total = isCentral ? central.employees.total : data.employees.total;
  const isDepartmentUnique = dept?.some((d: string) => uniqueDeps?.includes(d));

  const audits = isCentral
      ? {
        addCertAudit: true,
        addMonitAuditOne: true,
        addMonitAuditSecond: true,
        addMonitAuditThird: true,
        addMonitAuditFourth: true,
      }
      : ['addMonitAuditOne', 'addMonitAuditSecond', 'addMonitAuditThird', 'addMonitAuditFourth']
          .reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, { addCertAudit: false } as Record<string, boolean>);

  return {
    locationAddress: isCentral
        ? { ...central, streetAndHouseNumber: `[Zentrale] ${central.streetAndHouseNumber}` }
        : data.locationAddress,
    employees: total,
    departments: dept,
    locationType: isCentral ? 'Zentrale' : data.locationType,
    addSampleCapable: !isCentral && !isDepartmentUnique,
    ...audits,
    addRiskAssessment: null,
    addRemarks: null,
    // Add calculation properties directly
    select: false,
    certTime: 0,
    certTime30: 0,
    monitTime: 0,
    monitTime30: 0,
  };
};

const originalLocations = [
  createLocation(data.value, true),
  ...(data.value.otherLocations || []).map(item => createLocation(item))
];

// Infinite scroll setup
const pageSize = 10
const currentPage = ref(0)
// Todo, Bug: allLocations will be doubled if step back and forward ...
//const allLocations = useState('calcAuditTimeAndAuditDurationState', () => ref<any[]>([]))
const allLocations = ref<any[]>([])
const loading = ref(false)
const tableContainer = ref()

const hasMore = computed(() => currentPage.value * pageSize < originalLocations.length)

const loadMoreData = () => {
  if (loading.value || !hasMore.value) return
  loading.value = true

  const start = currentPage.value * pageSize
  const end = Math.min(start + pageSize, originalLocations.length)
  allLocations.value.push(...originalLocations.slice(start, end))
  currentPage.value++
  loading.value = false
}

useInfiniteScroll(tableContainer, loadMoreData, { distance: 10 })

// Statistics calculations
const stoComplete = originalLocations.length - 1
const sampleCapableItemsCount = originalLocations.filter(loc => loc.addSampleCapable).length
const notSampleCapableItemsCount = stoComplete - sampleCapableItemsCount
const sampleCapableItemsCountRandomParts = Math.ceil(sampleCapableItemsCount / 4)

// Random selection logic (memoized for performance)
const shuffledSampleCapableIndices = ref<number[]>([])

const shuffleSampleCapableIndices = () => {
  const indices = originalLocations.reduce((acc, loc, idx) =>
      loc.addSampleCapable ? [...acc, idx] : acc, [] as number[])
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  shuffledSampleCapableIndices.value = indices
}

onMounted(() => shuffleSampleCapableIndices());

const randomCalcedIds = computed(() => {
  return shuffledSampleCapableIndices.value.slice(0, sampleCapableItemsCountRandomParts)
})

const certDurationComplete = computed(() => {
  const complete = allLocations.value
      .filter(loc => loc.select)
      .reduce((sum, loc) => sum + parseFloat(loc.certDuration || 0), 0)
  return Math.round(complete * 100) / 100
})

const monitDurationComplete = computed(() => {
  const complete = allLocations.value
      .filter(loc => loc.select)
      .reduce((sum, loc) => sum + parseFloat(loc.monitDuration || 0), 0)
  return Math.round(complete * 100) / 100
})

const completeDuration = computed(() => (certDurationComplete.value ?? 0) + (monitDurationComplete.value ?? 0))

// Row selection handler
const handleRowSelection = (row: any, value: boolean) => {
  const location = allLocations.value.find(loc => loc === row.original)
  if (!location) return

  location.select = value

  if (value) {
    // Calculate times when selected
    const certTime = usePtCalc(location.employees) ?? 0

    // Function to round UP to next 0.25
    const roundToQuarter = (num: number) => Math.ceil(num * 4) / 4

    const calcMetrics = (base: number) => ({
      /* old
      base: Math.round(base * 100) / 100, // base
      duration: Math.round((base * 0.8) * 100) / 100,
      time30: Math.round((base * 0.7) * 100) / 100,
      duration30: Math.round((base * 0.56) * 100) / 100,
       */
      base: roundToQuarter(base), // base
      duration: roundToQuarter(base * 0.8),
      time30: roundToQuarter(base * 0.7),
      duration30: roundToQuarter(base * 0.56),
    })

    const cert = calcMetrics(certTime) // ZA
    const monit = calcMetrics(certTime / 3) // ÜWA

    location.certTime = cert.base
    location.certDuration = cert.duration
    location.certTime30 = cert.time30
    location.certDuration30 = cert.duration30

    location.monitTime = monit.base
    location.monitDuration = monit.duration
    location.monitTime30 = monit.time30
    location.monitDuration30 = monit.duration30
  } else {
    // Reset times when deselected
    location.certTime = 0
    location.certDuration = 0
    location.certTime30 = 0
    location.certDuration30 = 0
    location.monitTime = 0
    location.monitDuration = 0
    location.monitTime30 = 0
    location.monitDuration30 = 0
  }
}

// Cell factories
const createCheckboxCell = (key: string) => ({ row }: any) => {
  const isRandom = randomCalcedIds.value.includes(parseInt(row.id))
  const isFirstRow = row.id === '0'
  const shouldAutoSelect = isRandom || isFirstRow
  const isSelectKey = key === 'select'

  const handleChange = (value: boolean) => {
    row.original[key] = value
    if (isSelectKey) handleRowSelection(row, value)
  }

  if (shouldAutoSelect && !row.original[key]) handleChange(true)

  return h(resolveComponent('UCheckbox'), {
    modelValue: !!row.original[key],
    'onUpdate:modelValue': handleChange,
    disabled: shouldAutoSelect,
    color: isRandom ? 'success' : 'neutral',
    class: isSelectKey && isFirstRow ? 'invisible' : ''
  })
}

const createInputCell = (timeType: 'cert' | 'monit') => ({ row }: any) => {
  const location = allLocations.value.find(loc => loc === row.original)
  if (!location || !location.select) return

  const timeKey = `${timeType}Duration`
  const minKey = `${timeType}Duration30`

  return h(resolveComponent('UInput'), {
    modelValue: location[timeKey],
    'onUpdate:modelValue': (v: number) => location[timeKey] = Math.max(v, location[minKey]),
    onInput: (e: any) => {
      if (e.target.value < location[minKey]) e.target.value = location[minKey]
    },
    type: 'number',
    step: '0.25',
    min: location[minKey],
    class: 'w-16',
    size: 'sm'
  })
}

// Column configuration
const auditConfig = [
  { key: 'addCertAudit', header: 'ZA', label: 'Zertifizierung' },
  { key: 'addMonitAuditOne', header: '1. ÜA', label: '1. Überwachung' },
  { key: 'addMonitAuditSecond', header: '2. ÜA', label: '2. Überwachung' },
  { key: 'addMonitAuditThird', header: '3. ÜA', label: '3. Überwachung' },
  { key: 'addMonitAuditFourth', header: '4. ÜA', label: '4. Überwachung' }
]

// Cell renderers moved out for performance
const locationAddressCell = ({ row }: any) => {
  const { streetAndHouseNumber, postalCode, place } = row.getValue('locationAddress')
  return h('div', { 
    class: 'text-sm leading-tight max-w-48 truncate',
    title: `${streetAndHouseNumber}, ${postalCode} ${place}`
  }, `${streetAndHouseNumber}, ${postalCode} ${place}`)
}

const employeesCell = ({ row }: any) => row.getValue('employees')

const departmentsCell = ({ row }: any) => {
  const deps = toRaw(row.getValue('departments'))
  const text = Array.isArray(deps) ? deps.join(', ') : ''
  return h('div', { 
    class: 'text-sm leading-tight max-w-32 truncate',
    title: text
  }, text)
}

const addSampleCapableCell = ({ row }: any) => {
  const value = row.getValue('addSampleCapable') as boolean
  const isFirstRow = row.id === '0'
  const options = [{ label: 'Ja', value: true }, { label: 'Nein', value: false }]
  return h(resolveComponent('USelect'), {
    modelValue: value,
    'onUpdate:modelValue': (selected: boolean) => row.original.addSampleCapable = selected,
    items: options,
    valueKey: 'value',
    size: 'sm',
    class: `w-16 ${value ? 'text-success' : 'text-error'}`,
    disabled: isFirstRow,
  })
}

// Generic textarea cell factory
const createTextareaCell = (field: string, placeholder: string) => ({ row }: any) => {
  if (!row.original.select) return null

  return h(resolveComponent('UTextarea'), {
    modelValue: row.original[field],
    'onUpdate:modelValue': (v: string) => row.original[field] = v,
    placeholder,
    size: 'sm',
    class: 'w-28',
    rows: 1
  })
}
const addRiskAssessmentCell = ({ row }: any) => {
  if (!row.original.select) return null
  const value = row.getValue('addRiskAssessment') as string
  const options = [{ label: 'Gering', value: 'gering' }, { label: 'Mittel', value: 'mittel',  }, { label: 'Hoch', value: 'hoch'}]
  const getStatusClass = (value: string) => {
    switch(value) {
      case 'gering': return 'text-success'
      case 'mittel': return 'text-warning'
      case 'hoch': return 'text-error'
      default: return ''
    }
  }
  return h(resolveComponent('USelect'), {
    modelValue: value,
    'onUpdate:modelValue': (selected: string) => row.original.addRiskAssessment = selected,
    items: options,
    valueKey: 'value',
    size: 'sm',
    class: `w-20 ${getStatusClass(value)}`
  })
}
const columns: TableColumn<any[]>[] = [
  { 
    id: 'select', 
    accessorKey: 'select', 
    header: '✓',
    size: 40,
    cell: createCheckboxCell('select'),
    meta: { group: 'selection' }
  },
  { 
    accessorKey: 'locationAddress', 
    header: 'Standort',
    size: 200,
    cell: locationAddressCell,
    meta: { group: 'location' }
  },
  { 
    accessorKey: 'employees', 
    header: 'MA',
    size: 60,
    cell: employeesCell,
    meta: { group: 'location' }
  },
  { 
    accessorKey: 'departments', 
    header: 'Fachbereiche',
    size: 140,
    cell: departmentsCell,
    meta: { group: 'location' }
  },
  { 
    accessorKey: 'locationType', 
    header: 'Typ',
    size: 80,
    meta: { group: 'location' }
  },
  { 
    accessorKey: 'addSampleCapable', 
    header: 'Stichp.',
    size: 70,
    cell: addSampleCapableCell,
    meta: { group: 'config' }
  },
  ...auditConfig.map(({ key, header, label }) => ({
    accessorKey: key,
    header,
    size: 50,
    cell: createCheckboxCell(key),
    meta: { group: 'audits', tooltip: label }
  })),
  { 
    id: 'addCertAuditDurationStoComplete', 
    header: 'Zert.',
    size: 70,
    cell: createInputCell('cert'),
    meta: { group: 'duration' }
  },
  { 
    id: 'addMonitAuditDurationStoComplete', 
    header: 'Überw.',
    size: 70,
    cell: createInputCell('monit'),
    meta: { group: 'duration' }
  },
  { 
    accessorKey: 'addRemarks', 
    header: 'Bemerkung',
    size: 120,
    cell: createTextareaCell('addRemarks', 'Bemerkung'),
    meta: { group: 'assessment' }
  },
  { 
    accessorKey: 'addRiskAssessment', 
    header: 'Risiko',
    size: 80,
    cell: addRiskAssessmentCell,
    meta: { group: 'assessment' }
  }
]

const selSTOs = computed(() => {
  return allLocations.value.filter(l => l.select)
})


const auditData = {
  ...data.bearer,
  ...data.businessOwnership,
  ...data.contactPerson,
  auditDuration: completeDuration,
  locations: selSTOs,
}

const openPreview = ref(false);
const openOfferPreview = () => {
  openPreview.value = true
}
</script>

<template>

    <div class="space-y-8">
      <!-- Page header -->
      <PageHeader
        title="Angebotserstellung"
        :description="data?.bearer?.name + ' ' + data?.bearer?.legalForm || ''"
        variant="green"
      >
        <template #actions>
          <UButton
              color="info"
              size="lg"
              icon="i-lucide-eye"
              label="Vorschau"
              @click="openOfferPreview"
          />
        </template>
      </PageHeader>

      <!-- Error State -->
      <UAlert v-if="error" color="error" icon="i-lucide-alert-circle" :title="error.message" />

    <USlideover
        v-model:open="openPreview"
        title="Vorschau"
        description=" "
        :close="{
           color: 'primary',
           variant: 'outline',
           class: 'rounded-full'
        }"
        :ui="{
    content: 'w-screen max-w-sm sm:max-w-md md:max-w-lg lg:max-w-5xl xl:max-w-7xl max-h-screen overflow-y-auto'
  }">
      <template #title>
        <div class="bg-gradient-to-r bg-gray-400 rounded-xl p-4 text-white shadow-lg">
          <h1 class="text-3xl font-bold mb-2">Auditauftrag</h1>
          {{ data.bearer.name + ' (' +  data.bearer.legalForm + ')' }} -
          <NuxtTime :datetime="data.createdAt" year="numeric" month="numeric" day="numeric" />
        </div>
      </template>

      <template #body>
        <code class="text-xs">{{ auditData }}</code>
        <PdfPreviewModal
            :audit-data="auditData"
            :customer-data="{
              ...data.bearer,
              ...data.businessOwnership,
              ...data.contactPerson,
              auditDuration: completeDuration,
            }"
        />
      </template>
    </USlideover>

    <OfferStatistics
        :stats="
    {
      stoComplete,
      sampleCapableItemsCount,
      sampleCapableItemsCountRandomParts,
      notSampleCapableItemsCount,
      certDurationComplete,
      monitDurationComplete,
      completeDuration
    }"
    />
    <div ref="tableContainer" class="max-h-[700px] w-full overflow-auto border border-gray-300 rounded-lg shadow-sm">
      <UTable
          ref="table"
          sticky
          :data="allLocations"
          :columns="columns"
          :loading="status === 'pending'"
          :ui="{
            td: 'text-sm py-2 px-2',
            th: 'text-xs font-semibold text-gray-700 bg-gray-50 sticky top-0 px-2',
            tr: 'first:data-[selected=true]:bg-blue-50 hover:bg-gray-50',
            tbody: 'divide-y divide-gray-200',
            table: 'w-full table-fixed'
          }"
          class="flex-1"
          size="sm"
      />
    </div>
  </div>
</template>
