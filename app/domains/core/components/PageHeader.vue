<template>
  <div class="relative">
    <div class="absolute inset-0 rounded-3xl" :class="backgroundClass"/>
    <div class="relative p-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {{ title }}
          </h1>
          <p v-if="description" class="mt-2 text-lg text-gray-600">
            {{ description }}
          </p>
        </div>
        <div v-if="$slots.actions" class="flex-shrink-0 ml-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  variant?: 'blue' | 'teal' | 'purple' | 'gradient' | 'green' | yellow
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  variant: 'blue'
})

const backgroundClass = computed(() => {
  switch (props.variant) {
    case 'teal':
      return 'bg-gradient-to-r from-teal-200 to-teal-500'
    case 'purple':
      return 'bg-gradient-to-r from-purple-600/10 to-purple-600/10'
    case 'gradient':
      return 'bg-gradient-to-r from-emerald-500 to-teal-500'
    case 'green':
      return 'bg-gradient-to-r from-green-500/10 to-green-600/10'
    case 'yellow':
      return 'bg-gradient-to-r from-yellow-200 to-yellow-500'
    default:
      return 'bg-gradient-to-r from-blue-600/10 to-purple-600/10'
  }
})
</script>
