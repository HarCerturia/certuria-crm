<template>

  <div class="max-w-7xl mx-auto px-4 py-2">

    <div class="flex flex-wrap gap-2 justify-center">
      <UBadge color="info" variant="soft" class="flex items-center px-3 py-1" size="lg">
        <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
        STO: {{ props.stats?.stoComplete + ' (ohne Zentrale)' }}
      </UBadge>

      <UBadge color="success" variant="soft" class="flex items-center px-3 py-1" size="lg">
        <UIcon name="i-lucide-pin" class="w-4 h-4" />
        Stichproben-fähig: {{ props.stats?.sampleCapableItemsCount }}
      </UBadge>

      <UBadge color="success" variant="soft" class="flex items-center px-3 py-1" size="lg">
        <UIcon name="i-lucide-shuffle" class="w-4 h-4" />
        per Zufall gesetzt: {{ props.stats?.sampleCapableItemsCountRandomParts }}
      </UBadge>

      <UBadge color="error" variant="soft" class="flex items-center px-3 py-1" size="lg">
        <UIcon name="i-lucide-pin-off" class="w-4 h-4" />
        Nicht Stichproben-fähig: {{ props.stats?.notSampleCapableItemsCount }}
      </UBadge>

      <UBadge color="neutral" variant="soft" class="flex items-center px-3 py-1" size="lg">
        <UIcon name="i-lucide-timer" class="w-4 h-4" />
        ZA: {{ props.stats?.certDurationComplete }}
      </UBadge>

      <UBadge color="neutral" variant="soft" class="flex items-center gap-1 px-3 py-1" size="lg">
        <UIcon name="i-lucide-timer" class="w-4 h-4" />
        ÜW: {{ props.stats?.monitDurationComplete }}
      </UBadge>

      <UBadge color="neutral" variant="soft" class="flex items-center gap-1 px-3 py-1" size="lg">
        <UIcon name="i-lucide-timer" class="w-4 h-4" />
        Gesamt: {{ props.stats?.completeDuration }}
      </UBadge>
    </div>
  </div>

</template>

<script setup lang="ts">
interface Stats {
  stoComplete: number,
  sampleCapableItemsCount: number,
  sampleCapableItemsCountRandomParts: number,
  notSampleCapableItemsCount: number,
  certDurationComplete: number,
  monitDurationComplete: number,
  completeDuration: number,
}

const props = defineProps<{
  stats: Stats | null
}>();
</script>
