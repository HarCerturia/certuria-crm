<script lang="ts" setup>
import type { RadioGroupItem } from '@nuxt/ui'
import type { FormSubmitEvent } from "#ui/types";
import { z } from 'zod';

import { storeToRefs } from 'pinia'
import {useAuthStore} from "~/domains/core/stores/auth";

const route = useRoute()
const { dId } = route.query

if (!dId) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Document ID required'
  })
}

// Constants moved outside for better performance
const questionItems: RadioGroupItem[] = ['Ja', 'Nein']
const riskItems: RadioGroupItem[] = ['Gering', 'Mittel', 'Hoch']

const userStore = useAuthStore();
const { user } = storeToRefs(userStore);

const props = defineProps<{
  equivalentCount: number,
  locationsCount: number
}>()

// Form Schema
const approvalFormSchema = z.object({
  editor: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  questions: (z.object({
    q1: z.string().min(1, { message: 'Ja oder Nein auswählen'}),
    q2: z.string().min(1, { message: 'Ja oder Nein auswählen'}),
    q3: z.string().min(1, { message: 'Ja oder Nein auswählen'}),
    q4: z.string().min(1, { message: 'Ja oder Nein auswählen'}),
  })),
  riskClass: z.string().min(1, { message: 'Risikoklasse (Einstufung) auswählen' }),
  remarks: z.object({
    fullTimeEquivalent: z.number().or( z.string() ).pipe( z.coerce.number() ).optional(),
    numberOfLocations: z.number(),
  }),
  isApproved: z.boolean(),
  isApprovedFalseReason: z.string(),
});

// TypeScript type from the schema
type IApprovalForm = z.infer<typeof approvalFormSchema>;

const formState = ref<IApprovalForm>({
  editor: { id: user.value?.$id as string, name: user.value?.name as string, email: user.value?.email as string },
  questions: {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
  },
  riskClass: '',
  remarks: { fullTimeEquivalent: props.equivalentCount, numberOfLocations: props.locationsCount },
  isApproved: false,
  isApprovedFalseReason: ''
})

const isApproved = computed(() => {
  const questions = formState.value.questions
  return questions.q1 === 'Ja' && questions.q2 === 'Ja' && questions.q3 === 'Ja' && questions.q4 === 'Ja'
})

const fulfilled = computed(() => {
  const questions = formState.value.questions
  return Object.values(questions).reduce((count, answer) =>
    answer === 'Ja' ? count + 1 : count, 0
  )
})

const onSubmit = async (event: FormSubmitEvent<IApprovalForm>) => {

  // Validate form data before processing
  if (!event.data) {
    throw new Error('No form data available')
  }

  try {

    formState.value.isApproved = isApproved.value // comes from computed dynamic property

    const response = await $fetch(`/api/self-disclosures/${dId}`, {
      method: 'PUT',
      body: {
        data: event.data
      },
    })

    if (response.success) {
      const toast = useToast();
      toast.add({
        title: 'Antrag geprüft'
      })
      await navigateTo('/self-disclosures')
    }

  } catch (error) {
    console.log(error);
  }
}
</script>

<template>

  <UForm :state="formState" :schema="approvalFormSchema" @submit.prevent="onSubmit">

    <div class="max-w-3xl mx-auto bg-slate-50 min-h-screen">
      <div class="bg-white shadow-lg rounded-2xl mb-8">
        <div class="space-y-5">
          <UCard class="bg-gray-50">
            <div class="flex items-start mb-3">
            <span class="font-medium">
              Liegen ausreichende Informationen über das antragstellende Unternehmen vor?
            </span>
            </div>
            <UFormField name="questions.q1">
              <URadioGroup v-model="formState.questions.q1" orientation="horizontal" indicator="start" variant="card" :items="questionItems" />
            </UFormField>
          </UCard>
          <UCard class="bg-gray-50">
            <div class="flex items-start mb-3">
            <span class="font-medium">
              Sind die Anforderungen an die Zulassung eindeutig definiert?
            </span>
            </div>
            <UFormField name="questions.q2">
              <URadioGroup v-model="formState.questions.q2" orientation="horizontal" indicator="start" variant="card" :items="questionItems" />
            </UFormField>
          </UCard>
          <UCard class="bg-gray-50">
            <div class="flex items-start mb-3">
            <span class="font-medium">
              Verfügt die Zertifizierungsgesellschaft über die Kompetenz?
            </span>
            </div>
            <UFormField name="questions.q3">
              <URadioGroup v-model="formState.questions.q3" orientation="horizontal" indicator="start" variant="card" :items="questionItems" />
            </UFormField>
          </UCard>
          <UCard class="bg-gray-50">
            <div class="flex items-start mb-3">
            <span class="font-medium">
              Ist die Unparteilichkeit gewährleistet?
            </span>
            </div>
            <UFormField name="questions.q4">
              <URadioGroup v-model="formState.questions.q4" orientation="horizontal" indicator="start" variant="card" :items="questionItems" />
            </UFormField>
          </UCard>

          <!-- Risikoklasse -->
          <UCard class="bg-gray-50">
            <div class="flex items-start mb-3">
              <label class="font-medium text-gray-800">Risikoklasse</label>
            </div>
            <div class="flex gap-3">
              <UFormField name="riskClass">
                <URadioGroup v-model="formState.riskClass" orientation="horizontal" indicator="start" variant="card" :items="riskItems" />
              </UFormField>
            </div>
          </UCard>

          <!-- Bemerkungen -->
          <UCard class="bg-gray-50">
            <h2 class="font-medium text-gray-800 mb-4">Bemerkungen</h2>
            <div class="space-y-4">
              <div>
                <div class="flex items-center mb-2">
                  <UIcon name="lucide:users" class="w-5 h-5 text-gray-500 mr-2" />
                  <label class="text-sm text-gray-600">Mitarbeiterzahl</label>
                </div>
                <UInput
                    v-model="formState.remarks.fullTimeEquivalent"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    disabled
                />
              </div>
              <div>
                <div class="flex items-center mb-2">
                  <UIcon name="lucide:map-pin" class="w-5 h-5 text-gray-500 mr-2" />
                  <label class="text-sm text-gray-600">Standorte (ohne Zentrale)</label>
                </div>
                <UInput
                    v-model="formState.remarks.numberOfLocations"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    disabled
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Prüfungsstatus -->
      <UCard class="bg-gray-200 shadow-lg rounded-2xl">
        <h2 class="text-lg font-semibold mb-4">Prüfungsstatus</h2>
        <div class="flex items-center">
          <UIcon v-if="isApproved" name="lucide:check-circle" class="w-6 h-6 text-green-500 mr-3" />
          <UIcon v-else name="lucide:x-circle" class="w-6 h-6 text-red-500 mr-3" />
          <div>
            <p class="font-medium text-sm">{{ isApproved ? 'Alle erforderlichen Kriterien sind erfüllt.' : `${ fulfilled } von 4 Kriterien sind erfüllt.` }}</p>
          </div>
        </div>
        <div class="flex items-center">
          <UIcon name="lucide:triangle-alert" class="w-6 h-6 text-warning mr-3" />
          <p class="font-medium text-sm">{{ 'Risikoklasse: ' + formState.riskClass }}</p>
        </div>
        <UTextarea
            v-if="!isApproved"
            v-model="formState.isApprovedFalseReason"
            class="w-full border-gray-300 rounded-lg focus:ring-2 min-h-20"
            placeholder="Grund der Ablehnung"
            autoresize
        />
        <div class="flex items-center">
          <UButton
              type="submit"
              :class="`mt-4 px-6 py-2 rounded-lg font-medium ${isApproved ? 'bg-primary-600 hover:bg-primary-700' : 'bg-red-600 hover:bg-red-700'} text-white`"
              :label="`${isApproved ? 'Antrag genehmigen' : 'Antrag ablehnen'}`"
          />
        </div>
      </UCard>
    </div>
  </UForm>
</template>

