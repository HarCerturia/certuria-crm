<template>
  <header class="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
    <div class="flex h-16 items-center justify-between gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <!-- Mobile menu button -->
      <UButton
        variant="ghost"
        size="sm"
        class="lg:hidden"
        @click="$emit('toggle-sidebar')"
      >
        <UIcon name="i-lucide-menu" class="w-6 h-6" />
      </UButton>

      <!-- Left side: Breadcrumb -->
      <AppBreadcrumb />

      <!-- Right side: Userinfo -->
      <div class="flex items-center gap-x-4 lg:gap-x-6">
        <!-- Notifications -->
        <UButton variant="ghost" size="sm" class="relative">
          <UIcon name="i-lucide-bell" class="w-6 h-6" />
          <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"/>
        </UButton>

        <!-- Profile Dropdown -->
        <UserProfileDropdown />
      </div>
    </div>
  </header>
</template>

<script setup>
import UserProfileDropdown from "~/components/layout/UserProfileDropdown.vue";

defineEmits(['toggle-sidebar'])
</script>
