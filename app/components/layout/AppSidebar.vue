<template>
  <div>
    <!-- Mobile sidebar -->
    <MobileSidebar
      :sidebar-open="sidebarOpen"
      @close-sidebar="$emit('close-sidebar')"
    />

    <!-- Desktop sidebar -->
    <DesktopSidebar />
  </div>
</template>

<script setup lang="ts">
import MobileSidebar from "~/components/layout/MobileSidebar.vue";
import DesktopSidebar from "~/components/layout/DesktopSidebar.vue";

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close-sidebar'])
</script>
