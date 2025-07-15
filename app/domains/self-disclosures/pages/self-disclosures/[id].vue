<template>
  <div class="space-y-8">
    <!-- Page header -->
    <PageHeader
      :title="data?.bearer?.name || 'Selbstauskunft Details'"
      :description="data?.bearer?.legalForm || 'Detailansicht der Selbstauskunft'"
      variant="green"
    >
      <template #actions>
        <UButton
          color="info"
          size="lg"
          icon="i-lucide-clipboard-check"
          label="Prüfung starten"
          @click="openCheckForm"
        />
      </template>
    </PageHeader>

    <!-- Check proposal sidebar form -->
    <USlideover
        v-model:open="showForm"
        title="Prüfung"
        description=" "
        :ui="{ footer: 'justify-end' }"
        :close="{
           color: 'primary',
           variant: 'outline',
           class: 'rounded-full'
        }"
    >
      <template #body>
        <CheckSubmission
            :submission-id="id"
            :equivalent-count="totalEmployees"
            :locations-count="data?.otherLocations?.length"
        />
      </template>
    </USlideover>

    <!-- Error State -->
    <UAlert v-if="error" color="error" icon="i-lucide-alert-circle" :title="error.message" />

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex justify-center py-12">
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"/>
        <span class="text-gray-600">Lade Selbstauskunft...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="data" class="space-y-6">
      <!-- First Row: Bearer Info + Business Ownership -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Bearer Information Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <Icon name="lucide:building" class="h-5 w-5 mr-2 text-blue-600" />
              Träger-Informationen
            </h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</h3>
                <p class="mt-1 text-xl font-semibold text-gray-900">{{ data.bearer?.name || 'N/A' }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Rechtsform</h3>
                <p class="mt-1 text-xl font-semibold text-gray-900">{{ data.bearer?.legalForm || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Business Ownership -->
        <div v-if="data.businessOwnership" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <Icon name="lucide:map-pin" class="h-5 w-5 mr-2 text-orange-600" />
              Geschäftssitz
            </h2>
          </div>
          <div class="p-6">
            <div class="bg-orange-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Adresse</h3>
              <p class="text-lg text-gray-900">
                {{ data.businessOwnership.streetAndHouseNumber }}<br>
                {{ data.businessOwnership.postalCode }} {{ data.businessOwnership.place }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row: Contact Person + Approval Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Contact Person -->
        <div v-if="data.contactPerson" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <Icon name="lucide:user-circle" class="h-5 w-5 mr-2 text-cyan-600" />
              Ansprechperson
            </h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 gap-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Person</h3>
                <p class="text-lg font-semibold text-gray-900">{{ data.contactPerson.salutation }} {{ data.contactPerson.firstName }} {{ data.contactPerson.lastName }}</p>
                <p class="text-sm text-gray-600">Geboren: <NuxtTime :datetime="data.contactPerson.birthday" day="numeric" month="long" year="numeric" /></p>
                <p class="text-sm text-gray-600">Geburtsort: {{ data.contactPerson.placeOfBirth }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Kontakt</h3>
                <div class="flex items-center gap-2">
                  <Icon name="lucide:mail" class="h-4 w-4 text-cyan-600" />
                  <p class="text-lg text-gray-900">{{ data.contactPerson.email }}</p>
                </div>
                <div v-if="data.contactPerson.homepage" class="flex items-center gap-2">
                  <Icon name="lucide:link" class="h-4 w-4 text-cyan-600" />
                  <p class="text-lg text-gray-900">{{ data.contactPerson.homepage }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <Icon name="lucide:phone" class="h-4 w-4 text-cyan-600" />
                  <p class="text-lg text-gray-900">{{ data.contactPerson.telephone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Approval Status -->
        <div v-if="data.approvalStatus" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <Icon name="lucide:check-circle" class="h-5 w-5 mr-2 text-rose-600" />
              Zulassungsstatus
            </h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 gap-6">
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Status</h3>
                <div v-if="data.approvalStatus.status === 'no'" class="space-y-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Nicht zugelassen
                  </span>
                  <p class="text-lg text-gray-900">{{ data.approvalStatus.reason }}</p>
                </div>
                <div v-else-if="data.approvalStatus.status === 'refused'" class="space-y-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Abgelehnt
                  </span>
                  <p class="text-lg text-gray-900">{{ data.approvalStatus.reason }}</p>
                </div>
                <div v-else-if="data.approvalStatus.status === 'withdrawn'" class="space-y-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Zurückgezogen
                  </span>
                  <p class="text-lg text-gray-900">{{ data.approvalStatus.reason }}</p>
                </div>
                <div v-else-if="data.approvalStatus.status === 'gotActualPermit'" class="space-y-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Zulassung erteilt
                  </span>
                  <p class="text-lg text-gray-900">{{ data.approvalStatus.reason }}</p>
                </div>
                <div v-else-if="data.approvalStatus.status === 'expiredRegularly'" class="space-y-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Regulär abgelaufen
                  </span>
                  <p class="text-lg text-gray-900">{{ data.approvalStatus.reason }}</p>
                </div>
                <div v-else class="space-y-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {{ data.approvalStatus.status }}
                  </span>
                  <p v-if="data.approvalStatus.reason" class="text-lg text-gray-900">{{ data.approvalStatus.reason }}</p>
                </div>
              </div>
              <div v-if="data.approvalStatus.actualPermitInfosValidUntil" class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Gültig bis</h3>
                <p class="text-xl font-semibold text-gray-900"><NuxtTime :datetime="data.approvalStatus.actualPermitInfosValidUntil" day="numeric" month="long" year="numeric" /></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Representatives (Full Width) -->
      <div v-if="data.legalRepresentatives && data.legalRepresentatives.length > 0" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <Icon name="lucide:users" class="h-5 w-5 mr-2 text-green-600" />
            Gesetzliche Vertreter ({{ data.legalRepresentatives.length }})
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(rep, index) in data.legalRepresentatives"
              :key="index"
              class="border border-gray-200 rounded-xl p-4"
            >
              <div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Person</h4>
                  <p class="text-lg font-semibold text-gray-900">{{ rep.salutation }} {{ rep.firstName }} {{ rep.lastName }}</p>
                  <p class="text-sm text-gray-600">Geboren: <NuxtTime :datetime="rep.birthday" day="numeric" month="long" year="numeric" /></p>
                  <p class="text-sm text-gray-600">Geburtsort: {{ rep.placeOfBirth }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Kontakt</h4>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:mail" class="h-4 w-4 text-green-600" />
                    <p class="text-lg text-gray-900">{{ rep.email }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:phone" class="h-4 w-4 text-green-600" />
                    <p class="text-lg text-gray-900">{{ rep.telephone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Central Location (Full Width) -->
      <div v-if="data.central" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <Icon name="lucide:building-2" class="h-5 w-5 mr-2 text-emerald-600" />
            Zentrale Niederlassung
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Address -->
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Adresse</h3>
              <p class="text-lg text-gray-900">
                {{ data.central.streetAndHouseNumber }}<br>
                {{ data.central.postalCode }} {{ data.central.place }}
              </p>
            </div>

            <!-- Employees -->
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Mitarbeiter</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Festangestellte:</span>
                  <span class="text-lg font-semibold text-gray-900">{{ data.central.employees?.permanent || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Freelancer:</span>
                  <span class="text-lg font-semibold text-gray-900">{{ data.central.employees?.freelance || 0 }}</span>
                </div>
                <div class="flex justify-between border-t pt-2">
                  <span class="text-gray-600 font-medium">Gesamt:</span>
                  <span class="text-lg font-bold text-emerald-600">{{ data.central.employees?.total || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Departments -->
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fachbereiche</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="dept in data.central.centralMeasuresDepartments"
                  :key="dept"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                >
                  {{ dept }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Planned Range of Measures (Full Width) -->
      <div v-if="data.plannedRangeOfMeasures" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <Icon name="lucide:clipboard-list" class="h-5 w-5 mr-2 text-violet-600" />
            Geplanter Maßnahmenumfang
          </h2>
        </div>
        <div class="p-6">
          <div class="bg-violet-50 rounded-xl p-4">
            <div class="prose prose-sm max-w-none">
              <div class="whitespace-pre-wrap text-gray-900 font-sans break-words overflow-hidden">{{ data.plannedRangeOfMeasures.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Third Row: Implementation + Unique Departments + Confirmation -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Implementation of Measures -->
        <div v-if="data.implementationOfMeasures" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <Icon name="lucide:settings" class="h-4 w-4 mr-2 text-amber-600" />
              Umsetzung
            </h2>
          </div>
          <div class="p-6">
            <div class="bg-amber-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fachbereiche</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="dept in data.implementationOfMeasures.department"
                  :key="dept"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                >
                  {{ dept }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Unique Departments Summary -->
        <div v-if="data.uniqueDeps && data.uniqueDeps.length > 0" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <Icon name="lucide:tag" class="h-4 w-4 mr-2 text-indigo-600" />
              Einzigartig
            </h2>
          </div>
          <div class="p-6">
            <div class="bg-indigo-50 rounded-xl p-4">
              <p class="text-sm text-gray-600 mb-3">Standort-spezifische Bereiche:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="dept in data.uniqueDeps"
                  :key="dept"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ dept }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation -->
        <div v-if="data.confirmation" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 flex items-center">
              <Icon name="lucide:check-square" class="h-4 w-4 mr-2 text-teal-600" />
              Bestätigung
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Ort und Datum</h3>
                <p class="text-lg text-gray-900">{{ data.confirmation.placeAndDate }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Bestätigt durch</h3>
                <p class="text-lg font-semibold text-gray-900">{{ data.confirmation.firstAndLastNameLegalRepresentative }}</p>
                <p class="text-sm text-gray-600">{{ data.confirmation.emailLegalRepresentative }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Locations -->
      <div v-if="data.otherLocations && data.otherLocations.length > 0" class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <Icon name="lucide:map-pin" class="h-5 w-5 mr-2 text-purple-600" />
            Weitere Standorte ({{ data.otherLocations.length }})
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(location, index) in data.otherLocations"
              :key="index"
              class="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div class="grid grid-cols-1 gap-4">
                <!-- Location Address -->
                <div class="bg-gray-50 rounded-lg p-3">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Adresse</h4>
                  <p class="text-lg text-gray-900">
                    {{ location.locationAddress?.streetAndHouseNumber || location.streetAndHouseNumber || '' }}<br>
                    {{ location.locationAddress?.postalCode || location.postalCode || '' }} {{ location.locationAddress?.place || location.place || '' }}
                  </p>
                </div>

                <!-- Location Employees -->
                <div class="bg-gray-50 rounded-lg p-3">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Mitarbeiter</h4>
                  <div class="space-y-1">
                    <div class="flex justify-between text-sm">
                      <span>Festangestellte:</span>
                      <span class="text-lg font-semibold">{{ location.employees?.permanent || 0 }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span>Freelancer:</span>
                      <span class="text-lg font-semibold">{{ location.employees?.freelance || 0 }}</span>
                    </div>
                    <div class="flex justify-between text-sm border-t pt-1">
                      <span class="font-medium">Gesamt:</span>
                      <span class="text-lg font-bold text-purple-600">{{ location.employees?.total || 0 }}</span>
                    </div>
                  </div>
                </div>

                <!-- Location Departments -->
                <div class="bg-gray-50 rounded-lg p-3">
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fachbereiche</h4>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="dept in location.department"
                      :key="dept"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {{ dept }}
                    </span>
                    <span v-if="!location.department || location.department.length === 0" class="text-sm text-gray-500">
                      Keine Fachbereiche
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Show section even when no other locations -->
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <Icon name="lucide:map-pin" class="h-5 w-5 mr-2 text-purple-600" />
            Weitere Standorte (0)
          </h2>
        </div>
        <div class="p-6">
          <div class="bg-purple-50 rounded-xl p-4 text-center text-gray-600">
            Keine weiteren Standorte vorhanden
          </div>
        </div>
      </div>

      <!-- Submission Info -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <Icon name="lucide:file-text" class="h-5 w-5 mr-2 text-gray-600" />
            Einreichungsdetails
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Submission ID</h3>
              <p class="text-xl font-semibold text-gray-900">{{ data.submissionId || 'N/A' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Erstellt am</h3>
              <p class="text-xl font-semibold text-gray-900"><NuxtTime :datetime="data.createdAt" day="numeric" month="long" year="numeric" /></p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Aktualisiert am</h3>
              <p class="text-xl font-semibold text-gray-900"><NuxtTime :datetime="data.updatedAt" day="numeric" month="long" year="numeric" /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const id = parseInt(route.params.id as string)

const showForm = ref(false)
const totalEmployees = ref(0)

// Fetch data with typed response
const { data, status, error } = await useFetch(`/api/self-disclosures/${id}`, {
  lazy: true
})

const openCheckForm = () => {
  // Calculate total employees across all locations
  const central = data.value?.central?.employees?.total || 0
  const others = data.value?.otherLocations?.reduce((sum: number, loc: number) => sum + (loc.employees?.total || 0), 0) || 0
  totalEmployees.value = Math.ceil((central + others) * 100) / 100
  showForm.value = true
}
</script>
