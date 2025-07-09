<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { usePtCalc } from '~/domains/offers/composables/usePtCalc'
import AuditOfferPreview from "~/domains/offers/components/AuditOfferPreview.vue";

const route = useRoute()
const id = parseInt(route.query.sId as string)
const { data, status, error } = await useFetch(`/api/offers/create/${id}`)

const roundToQuarter = (num: number) => Math.ceil(num * 4) / 4
const calcMetrics = (base: number) => ({
  base: roundToQuarter(base),
  duration: roundToQuarter(base * 0.8),
  time30: roundToQuarter(base * 0.7),
  duration30: roundToQuarter(base * 0.56),
})

const createLocation = (locationData: any, isCentral = false) => {
  const central = locationData.central
  const dept = isCentral ? central.centralMeasuresDepartments : locationData.department
  const total = isCentral ? central.employees.total : locationData.employees.total
  const isDepartmentUnique = dept?.some((d: string) => data.value.uniqueDeps?.includes(d))

  return {
    locationAddress: isCentral
      ? { ...central, streetAndHouseNumber: `[Zentrale] ${central.streetAndHouseNumber}` }
      : locationData.locationAddress,
    employees: total,
    departments: dept,
    locationType: isCentral ? 'Zentrale' : locationData.locationType,
    addSampleCapable: !isCentral && !isDepartmentUnique,
    addCertAudit: isCentral,
    addMonitAuditOne: isCentral,
    addMonitAuditSecond: isCentral,
    addMonitAuditThird: isCentral,
    addMonitAuditFourth: isCentral,
    addRiskAssessment: null,
    addRemarks: null,
    select: false,
    certTime: 0,
    certDuration: 0,
    certTime30: 0,
    certDuration30: 0,
    monitTime: 0,
    monitDuration: 0,
    monitTime30: 0,
    monitDuration30: 0,
  }
}

const allLocations = ref([
  createLocation(data.value, true),
  ...(data.value.otherLocations || []).map(item => createLocation(item))
])

// Statistics
const sampleCapableCount = computed(() => allLocations.value.filter(loc => loc.addSampleCapable).length)
const randomPartsCount = computed(() => Math.ceil(sampleCapableCount.value / 4))
const shuffledIndices = ref<number[]>([])

const shuffleIndices = () => {
  const indices = allLocations.value.reduce((acc, loc, idx) =>
    loc.addSampleCapable ? [...acc, idx] : acc, [] as number[])
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  shuffledIndices.value = indices
}

onMounted(shuffleIndices)

const randomIds = computed(() => shuffledIndices.value.slice(0, randomPartsCount.value))
const selectedLocations = computed(() => allLocations.value.filter(loc => loc.select))
const certDurationComplete = computed(() =>
  Math.round(selectedLocations.value.reduce((sum, loc) => sum + (loc.certDuration || 0), 0) * 100) / 100)
const monitDurationComplete = computed(() =>
  Math.round(selectedLocations.value.reduce((sum, loc) => sum + (loc.monitDuration || 0), 0) * 100) / 100)
const completeDuration = computed(() => ((certDurationComplete.value + monitDurationComplete.value) * 100) / 100)

const handleRowSelection = (location: any, value: boolean) => {
  location.select = value
  if (value) {
    const certTime = usePtCalc(location.employees) ?? 0
    const cert = calcMetrics(certTime)
    const monit = calcMetrics(certTime / 3)

    Object.assign(location, {
      certTime: cert.base,
      certDuration: cert.duration,
      certTime30: cert.time30,
      certDuration30: cert.duration30,
      monitTime: monit.base,
      monitDuration: monit.duration,
      monitTime30: monit.time30,
      monitDuration30: monit.duration30,
    })
  } else {
    Object.assign(location, {
      certTime: 0, certDuration: 0, certTime30: 0, certDuration30: 0,
      monitTime: 0, monitDuration: 0, monitTime30: 0, monitDuration30: 0
    })
  }
}

// Columns
const auditConfig = [
  { key: 'addCertAudit', header: 'ZA' },
  { key: 'addMonitAuditOne', header: '1. ÜA' },
  { key: 'addMonitAuditSecond', header: '2. ÜA' },
  { key: 'addMonitAuditThird', header: '3. ÜA' },
  { key: 'addMonitAuditFourth', header: '4. ÜA' }
]

const columns: TableColumn<any[]>[] = [
  {
    id: 'select',
    header: '✓',
    size: 40,
    cell: ({ row }: any) => {
      const isRandom = randomIds.value.includes(parseInt(row.id))
      const isFirst = row.id === '0'
      const shouldAutoSelect = isRandom || isFirst

      if (shouldAutoSelect && !row.original.select) {
        handleRowSelection(row.original, true)
      }

      return h(resolveComponent('UCheckbox'), {
        modelValue: !!row.original.select,
        'onUpdate:modelValue': (v: boolean) => handleRowSelection(row.original, v),
        disabled: shouldAutoSelect,
        color: isRandom ? 'success' : 'neutral',
        class: isFirst ? 'invisible' : ''
      })
    }
  },
  {
    accessorKey: 'locationAddress',
    header: 'Standort',
    size: 200,
    cell: ({ row }: any) => {
      const { streetAndHouseNumber, postalCode, place } = row.getValue('locationAddress')
      const text = `${streetAndHouseNumber}, ${postalCode} ${place}`
      return h('div', { class: 'text-sm max-w-48 truncate', title: text }, text)
    }
  },
  { accessorKey: 'employees', header: 'MA', size: 60 },
  {
    accessorKey: 'departments',
    header: 'Fachbereiche',
    size: 140,
    cell: ({ row }: any) => {
      const text = Array.isArray(row.getValue('departments')) ? row.getValue('departments').join(', ') : ''
      return h('div', { class: 'text-sm max-w-32 truncate', title: text }, text)
    }
  },
  { accessorKey: 'locationType', header: 'Typ', size: 80 },
  {
    accessorKey: 'addSampleCapable',
    header: 'Stichp.',
    size: 70,
    cell: ({ row }: any) => {
      const value = row.getValue('addSampleCapable')
      return h(resolveComponent('USelect'), {
        modelValue: value,
        'onUpdate:modelValue': (v: boolean) => row.original.addSampleCapable = v,
        items: [{ label: 'Ja', value: true }, { label: 'Nein', value: false }],
        valueKey: 'value',
        size: 'sm',
        class: `w-16 ${value ? 'text-success' : 'text-error'}`,
        disabled: row.id === '0',
      })
    }
  },
  ...auditConfig.map(({ key, header }) => ({
    accessorKey: key,
    header,
    size: 50,
    cell: ({ row }: any) => {
      const isRandom = randomIds.value.includes(parseInt(row.id))
      const isFirst = row.id === '0'
      const shouldAutoSelect = isRandom || isFirst

      if (shouldAutoSelect && !row.original[key]) {
        row.original[key] = true
      }

      return h(resolveComponent('UCheckbox'), {
        modelValue: !!row.original[key],
        'onUpdate:modelValue': (v: boolean) => row.original[key] = v,
        disabled: shouldAutoSelect,
        color: isRandom ? 'success' : 'neutral'
      })
    }
  })),
  {
    header: 'Zert.-A',
    size: 70,
    cell: ({ row }: any) => {
      if (!row.original.select) return null
      return h(resolveComponent('UInput'), {
        modelValue: row.original.certDuration,
        'onUpdate:modelValue': (v: number) => row.original.certDuration = Math.max(v, row.original.certDuration30),
        onInput: (e: any) => {
          if (e.target.value < row.original.certDuration30) {
            e.target.value = row.original.certDuration30
          }
        },
        type: 'number',
        step: '0.25',
        min: row.original.certDuration30,
        class: 'w-16',
        size: 'sm'
      })
    }
  },
  {
    header: 'Überw.-A',
    size: 70,
    cell: ({ row }: any) => {
      if (!row.original.select) return null
      return h(resolveComponent('UInput'), {
        modelValue: row.original.monitDuration,
        'onUpdate:modelValue': (v: number) => row.original.monitDuration = Math.max(v, row.original.monitDuration30),
        onInput: (e: any) => {
          if (e.target.value < row.original.monitDuration30) {
            e.target.value = row.original.monitDuration30
          }
        },
        type: 'number',
        step: '0.25',
        min: row.original.monitDuration30,
        class: 'w-16',
        size: 'sm'
      })
    }
  },
  {
    accessorKey: 'addRemarks',
    header: 'Bemerkung',
    size: 120,
    cell: ({ row }: any) => {
      if (!row.original.select) return null
      return h(resolveComponent('UTextarea'), {
        modelValue: row.original.addRemarks,
        'onUpdate:modelValue': (v: string) => row.original.addRemarks = v,
        placeholder: 'Bemerkung',
        size: 'sm',
        class: 'w-28',
        rows: 1
      })
    }
  },
  {
    accessorKey: 'addRiskAssessment',
    header: 'Risiko',
    size: 80,
    cell: ({ row }: any) => {
      if (!row.original.select) return null
      const value = row.getValue('addRiskAssessment')
      const options = [
        { label: 'Gering', value: 'gering' },
        { label: 'Mittel', value: 'mittel' },
        { label: 'Hoch', value: 'hoch' }
      ]
      const colorClass = ({ gering: 'text-success', mittel: 'text-warning', hoch: 'text-error' } as Record<string, string>)[value] || ''
      return h(resolveComponent('USelect'), {
        modelValue: value,
        'onUpdate:modelValue': (v: string) => row.original.addRiskAssessment = v,
        items: options,
        valueKey: 'value',
        size: 'sm',
        class: `w-20 ${colorClass}`
      })
    }
  }
]

const auditData = computed(() => ({
  ...data.value.bearer,
  ...data.value.businessOwnership,
  ...data.value.contactPerson,
  auditDuration: completeDuration.value,
  locations: selectedLocations.value,
}))

const openPreview = ref(false)
</script>

<template>
  <div class="space-y-8">
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
          @click="openPreview = true"
        />
      </template>
    </PageHeader>

    <UAlert v-if="error" color="error" icon="i-lucide-alert-circle" :title="error.message" />

    <USlideover
      v-model:open="openPreview"
      title="Vorschau"
      description="Angebot Auditauftrag - Vorschau"
      :ui="{ content: 'w-screen max-w-sm sm:max-w-md md:max-w-lg lg:max-w-5xl xl:max-w-7xl max-h-screen overflow-y-auto' }"
    >
      <template #title>
          <h1 class="text-3xl font-bold">Angebot Auditauftrag - Vorschau</h1>
          <span class="text-xs"> vom <NuxtTime :datetime="data.createdAt" year="numeric" month="numeric" day="numeric" /></span>
      </template>
      <template #body>
        <AuditOfferPreview :audit-data="auditData" />
      </template>
    </USlideover>

    <OfferStatistics
      :stats="{
        stoComplete: allLocations.length - 1,
        sampleCapableItemsCount: sampleCapableCount,
        sampleCapableItemsCountRandomParts: randomPartsCount,
        notSampleCapableItemsCount: allLocations.length - 1 - sampleCapableCount,
        certDurationComplete,
        monitDurationComplete,
        completeDuration
      }"
    />

      <UTable
        sticky
        :data="allLocations"
        :columns="columns"
        :loading="status === 'pending'"
        loading-text="Lade Standorte..."
        :ui="{
          td: 'text-sm py-2 px-2',
          th: 'text-xs font-semibold text-gray-700 bg-gray-50 sticky top-0 px-2',
          tr: 'first:data-[selected=true]:bg-blue-50 hover:bg-gray-50',
          tbody: 'divide-y divide-gray-200',
        }"
        class="w-full max-h-[600px]"
        size="sm"
      />
  </div>
</template>
