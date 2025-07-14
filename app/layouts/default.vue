<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Sidebar -->
    <AppSidebar
      :sidebar-open="sidebarOpen"
      @close-sidebar="sidebarOpen = false"
    />

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Header -->
      <AppHeader @toggle-sidebar="sidebarOpen = true" />

      <!-- Page content -->
      <main class="p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from "~/components/layout/AppSidebar.vue";
import AppHeader from "~/components/layout/AppHeader.vue";

const sidebarOpen = ref(false)
</script>
