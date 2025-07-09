<template>
  <div class="space-y-8">
    <!-- Page header -->
    <PageHeader
      title="Selbstauskünfte zur Trägerzulassung"
      description="Ausschließlich signierte Anträge werden hier angezeigt."
      variant="green"
    />

    <!-- Error State -->
    <UAlert v-if="error" color="error" icon="i-lucide-alert-circle" :title="error.message" />

    <UTable
        ref="table"
        sticky
        :data="data"
        :loading="status === 'pending'"
        loading-text="Lade Selbstauskünfte..."
        :columns="columns"
        :ui="{
          td: 'text-xl py-2 px-2',
          th: 'text-sm font-semibold text-gray-700 bg-gray-50 sticky top-0 px-2',
          tr: 'hover:bg-gray-50',
          tbody: 'divide-y divide-gray-200',
        }"
        class="w-full max-h-[600px]"
        size="sm"
      />

  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

// Define TypeScript interface for self-disclosure data
interface SelfDisclosureRecord {
  $id: string
  submissionId: string
  $createdAt: string
  documents: string // JSON string
  combinedDocumentUrl: string
}

definePageMeta({ middleware: 'auth' })

const table = useTemplateRef<ComponentPublicInstance>('table')

// Define columns with typed interface
const columns: TableColumn<SelfDisclosureRecord>[] = [
  {
    accessorKey: 'submissionId',
    header: 'Submission ID',
    cell: ({ row }) => {
      return h(resolveComponent('UBadge'), {
        variant: 'subtle',
        color: 'info',
        class: 'text-xl'
      }, () => row.getValue('submissionId'))
    }
  },
  {
    accessorKey: '$createdAt',
    header: 'Signiert am',
    cell: ({ row }) => h(resolveComponent('NuxtTime'), {
      datetime: row.getValue('$createdAt') ,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  },
  {
    accessorKey: 'documents',
    header: 'Träger',
    cell: ({ row }) => {
      const documents = JSON.parse(row.getValue('documents'))
      return documents[0]?.name || 'N/A'
    }
  },
  {
    accessorKey: 'proposalStatus',
    header: '#',
    cell: ({ row }) => {
      const proposalStatus = row.getValue('proposalStatus')

      if (proposalStatus === 'pending') {
        return h(resolveComponent('UButton'), {
          color: 'info',
          onClick: () => navigateTo({
            path: `/self-disclosures/${row.original.submissionId}`,
            query: {
              dId: row.original.$id
            }
          })
        }, () => 'Antrag prüfen')
      }

      if (proposalStatus === 'approved') {
        return h(resolveComponent('UButton'), {
          color: 'success',
          onClick: () => navigateTo({
            path: '/offers/create',
            query: { sId: row.original.submissionId }
          })
        }, () => 'Angebot erstellen')
      }

      if (proposalStatus === 'rejected') {
        return h(resolveComponent('UBadge'), {
          size: 'lg',
          color: 'error',
        }, () => 'Antrag abgelehnt')
      }

      return null
    }
  }
]

// Fetch data with typed response
const { data, status, error} = await useFetch<SelfDisclosureRecord[]>('/api/self-disclosures', {
  lazy: true
})
</script>
