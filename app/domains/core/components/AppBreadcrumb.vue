<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li>
        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </li>
      <li v-for="(item, index) in items" :key="index">
        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </li>
      <li>
        <span class="text-sm font-medium text-gray-900">{{ currentPageName }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items?: BreadcrumbItem[]
  currentPage?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  currentPage: ''
})

const route = useRoute()

const currentPageName = computed(() => {
  if (props.currentPage) return props.currentPage
  
  const routeMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/offers': 'Angebote',
    '/self-disclosures': 'Selbstauskünfte',
    '/admin': 'Administration'
  }
  
  return routeMap[route.path] || 'Unbekannt'
})
</script>