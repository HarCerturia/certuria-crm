<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const props = defineProps<{
  auditData: object,
}>()

// Slot 1: Kundendaten
const customerData = [
  { label: 'Auftragsnr.', value: props?.auditData.submissionId || '??????' },
  { label: 'Bezeichnung', value: props?.auditData.name + " " + props?.auditData.legalForm },
  { label: 'Geschäftssitz', value: props?.auditData.streetAndHouseNumber + ', ' + props?.auditData.postalCode + ' ' + props?.auditData.place },
  { label: 'Kontakt', value: props?.auditData.salutation + ' ' + props?.auditData.firstName + ' ' + props?.auditData.lastName },
  { label: 'Telefon', value: props?.auditData.telephone },
  { label: 'E-Mail', value: props?.auditData.email },
  { label: 'Homepage', value: /*props?.auditData.homepage*/ '!Feld nicht in der Selbstauskunft!' }
]

// Slot 2: Beschreibung
const descriptionData = [
  { label: 'Betreff', value: 'Erteilung der Trägerzulassung' },
  { label: 'Auditdauer', value: props?.auditData.auditDuration + ' Tagewerke' },
  { label: 'Standards', value: 'AZAV (Akkreditierungs- und Zulassungsverordnung Arbeitsförderung)' },
  { label: 'Zahlweise', value: 'Rechnung' },
]

// Slot 3: Standorte
const createLocationAddressCell = ({ row }: any) => {
  const { streetAndHouseNumber, postalCode, place } = row.getValue('locationAddress')
  return `${streetAndHouseNumber}, ${postalCode} ${place}`
}

const locationColumns: TableColumn<any>[] = [
  { accessorKey: 'locationAddress', header: 'Standort', cell: createLocationAddressCell },
  { accessorKey: 'locationType', header: 'Typ' },
  { accessorKey: 'employees', header: 'MA (VZÄ)' },
  { accessorKey: 'departments', header: 'Fachbereiche'}
]
// Slot 4: Ablauf & Leistungen - Editable
const servicesData = ref([
  { id: 1, number: '1', service: 'Antragsbewertung', quantity: '1,000 Anträge', price: 175.00 },
  { id: 2, number: '2', service: 'Vor- und Nachbereitung', quantity: '0,250 Tagewerke', price: 562.50 },
  { id: 3, number: '3', service: 'Audit der Stufe 1', quantity: '0,250 Tagewerke', price: 562.50 },
  { id: 4, number: '4', service: 'Audit der Stufe 2 - Zentrale', quantity: '1,000 Tagewerke', price: 2250.00 },
  { id: 5, number: '5', service: 'Audit der Stufe 2 - virtuell', quantity: '0,250 Tagewerke', price: 562.50 },
  { id: 6, number: '6', service: 'Bewertung und Zertifizierungsentscheidung', quantity: '1,000', price: 195.00 },
  { id: 7, number: '7', service: 'Zertifikatserstellung', quantity: '1,000 Zertifikate', price: 30.00 }
])

const editingRow = ref(null)
const isAddingRow = ref(false)
const newRow = ref({ number: '', service: '', quantity: '', price: 0 })

// Helper functions
const startEdit = (id: number) => {
  editingRow.value = id
}

const saveEdit = () => {
  editingRow.value = null
}

const cancelEdit = () => {
  editingRow.value = null
}

const deleteRow = (id: number) => {
  servicesData.value = servicesData.value.filter(item => item.id !== id)
  calculateTotal()
}

const addNewRow = () => {
  isAddingRow.value = true
  newRow.value = {
    number: (servicesData.value.length + 1).toString(),
    service: '',
    quantity: '',
    price: 0
  }
}

const saveNewRow = () => {
  if (newRow.value.service && newRow.value.quantity) {
    const newId = Math.max(...servicesData.value.map(s => s.id)) + 1
    servicesData.value.push({
      id: newId,
      ...newRow.value
    })
    isAddingRow.value = false
    calculateTotal()
  }
}

const cancelNewRow = () => {
  isAddingRow.value = false
  newRow.value = { number: '', service: '', quantity: '', price: 0 }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const calculateTotal = () => {
  const total = servicesData.value.reduce((sum, item) => sum + item.price, 0)
  totalPrice.value = formatPrice(total)
}

const totalPrice = ref('')

// Calculate initial total
onMounted(() => {
  calculateTotal()
})

const { generateAuditPdf } = usePdfGenerator()
const generatePDF = async () => {
  const result = await generateAuditPdf(props.auditData, servicesData.value, true)

  if (result.success) {
    // Show success notification
    if (typeof useToast === 'function') {
      const toast = useToast()
      toast.add({
        title: 'PDF erfolgreich generiert',
        description: `Der Auditauftrag wurde als "${result.filename}" erstellt.`,
        icon: 'i-lucide-check-circle',
        color: 'success'
      })
    }
  }
}

const isDocuSealLoading = ref(false)

const sendToDocuSeal = async () => {
  isDocuSealLoading.value = true

  try {
    // Generate PDF
    const result = await generateAuditPdf(props.auditData, servicesData.value, false)

    if (!result.success) {
      if (typeof useToast === 'function') {
        const toast = useToast()
        toast.add({
          title: 'Fehler beim PDF-Export',
          description: 'Das PDF konnte nicht erstellt werden.',
          icon: 'i-lucide-x-circle',
          color: 'error'
        })
      }
      return
    }

    // Upload to DocuSeal
    await $fetch('/api/offers/docuseal/create-submission', {
      method: 'POST',
      body: {
        name: 'TESTSUBMISSION',
        file: result.base64Data,
        signerEmail: 'test@test.de',
        serviceEmail: 'harald.innetzberger@certuria.de',
      },
    })

    if (typeof useToast === 'function') {
      const toast = useToast()
      toast.add({
        title: 'DocuSeal erfolgreich',
        description: 'Das Dokument wurde zur Unterschrift versendet.',
        icon: 'i-lucide-check-circle',
        color: 'success'
      })
    }
  } catch (error) {
    console.error('DocuSeal Error:', error)
    if (typeof useToast === 'function') {
      const toast = useToast()
      toast.add({
        title: 'DocuSeal Fehler',
        description: 'Das Dokument konnte nicht versendet werden.',
        icon: 'i-lucide-x-circle',
        color: 'error'
      })
    }
  } finally {
    isDocuSealLoading.value = false
  }
}

</script>

<template>
  <div class="max-w-7xl mx-auto bg-gray-50 min-h-screen">

    <!-- Main Content Grid -->
    <div class="space-y-6">

      <!-- Customer & Description Row -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <!-- Kundendaten Card -->
        <UCard class="shadow-lg border-0 bg-white">
          <template #header>
            <div class="flex items-center gap-3 py-1">
              <div class="p-2 bg-blue-100 rounded-lg">
                <UIcon name="i-lucide-user-round" class="w-5 h-5 text-blue-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-800">Kundendaten</h3>
            </div>
          </template>

          <div class="space-y-3 text-sm">
            <div
v-for="item in customerData" :key="item.label"
                 class="flex flex-col sm:flex-row sm:items-center gap-5 rounded-lg hover:bg-gray-50 transition-colors">
              <dt class="font-semibold text-gray-600 uppercase tracking-wide sm:min-w-[120px]">
                {{ item.label }}
              </dt>
              <dd class="text-gray-900 font-medium flex-1">{{ item.value }}</dd>
            </div>
          </div>
        </UCard>

        <!-- Beschreibung Card -->
        <UCard class="shadow-lg border-0 bg-white">
          <template #header>
            <div class="flex items-center gap-3 py-1">
              <div class="p-2 bg-green-100 rounded-lg">
                <UIcon name="i-lucide-info" class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800">Beschreibung</h3>
              </div>
            </div>
          </template>

          <div class="space-y-3 text-sm">
            <div
v-for="item in descriptionData" :key="item.label"
                 class="flex flex-col sm:flex-row sm:items-center gap-5 rounded-lg hover:bg-gray-50 transition-colors">
              <dt class="font-semibold text-gray-600 uppercase tracking-wide sm:min-w-[120px]">
                {{ item.label }}
              </dt>
              <dd class="text-gray-900 font-medium flex-1">{{ item.value }}</dd>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Standorte Section -->
      <UCard class="shadow-lg border-0 bg-white">
        <template #header>
          <div class="flex items-center gap-3 py-2">
            <div class="p-2 bg-purple-100 rounded-lg">
              <UIcon name="i-lucide-map-pin-house" class="w-5 h-5 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-800">Standorte</h3>
          </div>
        </template>

        <div class="overflow-x-auto">
          <UTable
:columns="locationColumns" :data="auditData?.locations"
                  class="text-sm" />
        </div>
      </UCard>

      <!-- Services Section -->
      <UCard class="shadow-lg border-0 bg-white">
        <template #header>
          <div class="flex items-center gap-3 py-2">
            <div class="p-2 bg-orange-100 rounded-lg">
              <UIcon name="i-lucide-workflow" class="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">Ablauf & Leistungen</h3>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Service Table Header -->
          <div class="flex justify-between items-center">
            <h4 class="font-medium text-gray-700">Leistungsübersicht</h4>
            <UButton size="sm" color="success" :disabled="isAddingRow" @click="addNewRow">
              <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1" />
              Position hinzufügen
            </UButton>
          </div>

          <!-- Custom Editable Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titel & Beschreibung</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Menge</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Preis</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Aktionen</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
              <!-- Existing Rows -->
              <tr
v-for="item in servicesData" :key="item.id"
                  class="hover:bg-gray-50 transition-colors">
                <!-- Number Column -->
                <td class="px-4 py-3 text-sm font-medium text-gray-900 text-center">
                  {{ item.number }}
                </td>

                <!-- Service Column -->
                <td class="px-4 py-3 text-sm text-gray-900">
                  <input
v-if="editingRow === item.id"
                         v-model="item.service"
                         class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         @keyup.enter="saveEdit"
                         @keyup.esc="cancelEdit">
                  <span v-else class="block">{{ item.service }}</span>
                </td>

                <!-- Quantity Column -->
                <td class="px-4 py-3 text-sm text-gray-900">
                  <input
v-if="editingRow === item.id"
                         v-model="item.quantity"
                         class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         @keyup.enter="saveEdit"
                         @keyup.esc="cancelEdit">
                  <span v-else class="block">{{ item.quantity }}</span>
                </td>

                <!-- Price Column -->
                <td class="px-4 py-3 text-sm font-bold text-green-600">
                  <input
v-if="editingRow === item.id"
                         v-model.number="item.price"
                         type="number"
                         step="0.01"
                         class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         @keyup.enter="saveEdit"
                         @keyup.esc="cancelEdit"
                         @input="calculateTotal">
                  <span v-else class="block">{{ formatPrice(item.price) }}</span>
                </td>

                <!-- Actions Column -->
                <td class="px-4 py-3 text-sm">
                  <div v-if="editingRow === item.id" class="flex gap-1">
                    <UButton size="xs" color="success" @click="saveEdit">
                      <UIcon name="i-lucide-check" class="w-3 h-3" />
                    </UButton>
                    <UButton size="xs" color="error" @click="cancelEdit">
                      <UIcon name="i-lucide-x" class="w-3 h-3" />
                    </UButton>
                  </div>
                  <div v-else class="flex gap-1">
                    <UButton size="xs" color="info" @click="startEdit(item.id)">
                      <UIcon name="i-lucide-edit-2" class="w-3 h-3" />
                    </UButton>
                    <UButton size="xs" color="error" @click="deleteRow(item.id)">
                      <UIcon name="i-lucide-trash-2" class="w-3 h-3" />
                    </UButton>
                  </div>
                </td>
              </tr>

              <!-- New Row Input -->
              <tr v-if="isAddingRow" class="bg-blue-50 border-2 border-blue-200">
                <td class="px-4 py-3 text-sm font-medium text-gray-900 text-center">
                  <input
v-model="newRow.number"
                         class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                         placeholder="Nr.">
                </td>
                <td class="px-4 py-3 text-sm">
                  <input
v-model="newRow.service"
                         class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="Servicebeschreibung eingeben..."
                         @keyup.enter="saveNewRow"
                         @keyup.esc="cancelNewRow">
                </td>
                <td class="px-4 py-3 text-sm">
                  <input
v-model="newRow.quantity"
                         class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="z.B. 1.00 Tagewerke"
                         @keyup.enter="saveNewRow"
                         @keyup.esc="cancelNewRow">
                </td>
                <td class="px-4 py-3 text-sm">
                  <input
v-model.number="newRow.price"
                         type="number"
                         step="0.01"
                         class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="0.00"
                         @keyup.enter="saveNewRow"
                         @keyup.esc="cancelNewRow">
                </td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex gap-1">
                    <UButton size="xs" color="success" @click="saveNewRow">
                      <UIcon name="i-lucide-check" class="w-3 h-3" />
                    </UButton>
                    <UButton size="xs" color="error" @click="cancelNewRow">
                      <UIcon name="i-lucide-x" class="w-3 h-3" />
                    </UButton>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Price Banner -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div class="flex justify-between items-center">
              <div>
                <h4 class="text-lg font-semibold text-gray-700">Gesamtsumme</h4>
                <p class="text-sm text-gray-600">zzgl. MwSt.</p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-green-600">{{ totalPrice }}</div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Location Details Section -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-indigo-100 rounded-lg">
            <UIcon name="i-lucide-building-2" class="w-5 h-5 text-indigo-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Standortdetails</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UCard
v-for="(loc, index) in auditData?.locations" :key="index"
                 class="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
            <template #header>
              <div class="space-y-2">
                <UBadge color="primary" size="lg" class="px-3 py-1">
                  <UIcon name="i-lucide-map-pin" class="w-3 h-3 mr-1" />
                  {{ loc.locationAddress.streetAndHouseNumber + ', ' + loc.locationAddress.postalCode + ' ' + loc.locationAddress.place }}
                </UBadge>
                <h4 class="font-semibold text-gray-700">{{ loc.locationType }}</h4>
              </div>
            </template>

            <div class="space-y-3">
              <div class="grid grid-cols-1 gap-2 text-sm">

                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="font-medium text-gray-600">Fachbereiche:</span>
                  <span class="text-gray-900">{{ loc.departments.join(', ') }}</span>
                </div>

                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="font-medium text-gray-600">MA (VZÄ):</span>
                  <span class="text-gray-900 font-semibold">{{ loc.employees }}</span>
                </div>

                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="font-medium text-gray-600">Risikoklasse:</span>
                  <UBadge :color="loc.addRiskAssessment === 'gering' ? 'success' : loc.addRiskAssessment === 'mittel' ? 'warning' : loc.addRiskAssessment === 'hoch' ? 'error' : 'info'" size="sm">
                    {{ loc.addRiskAssessment }}
                  </UBadge>
                </div>

                <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span class="font-medium text-gray-600">Stichprobenfähig:</span>
                  <UBadge :color="loc.addSampleCapable ? 'success' : 'error'" size="sm">
                    {{ loc.addSampleCapable ? 'Ja' : 'Nein' }}
                  </UBadge>
                </div>

                <div class="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <span class="font-medium text-gray-600 text-xs uppercase tracking-wide">Beschreibung:</span>
                  <p class="text-gray-900 mt-1">{{ loc.addRemarks }}</p>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-2">
                  <div class="text-center p-2 bg-green-50 rounded">
                    <div class="text-xs text-gray-600">Auditdauer ZA</div>
                    <div class="font-bold text-green-600">{{ loc.certDuration }} TW</div>
                  </div>
                  <div class="text-center p-2 bg-blue-50 rounded">
                    <div class="text-xs text-gray-600">Auditdauer ÜA</div>
                    <div class="font-bold text-blue-600">{{ loc.monitDuration }} TW</div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>

  <div class="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl p-6 mt-5">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">Aktionen</h3>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      <UButton variant="solid" size="lg" color="primary" class="flex-col h-20" @click="generatePDF">
        <UIcon name="i-lucide-file-text" class="w-5 h-5 mb-2" />
        PDF Vorschau
      </UButton>

      <UButton
        variant="solid"
        color="info"
        size="lg"
        class="flex-col h-20"
        :loading="isDocuSealLoading"
        :disabled="isDocuSealLoading"
        @click="sendToDocuSeal">
        <UIcon name="i-lucide-file-signature" class="w-5 h-5 mb-2" />
        {{ isDocuSealLoading ? 'Wird versendet...' : 'Zur Unterschrift an DocuSeal senden' }}
      </UButton>

    </div>
  </div>
</template>
