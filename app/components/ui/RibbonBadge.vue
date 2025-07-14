<template>
  <div 
    class="ribbon-badge"
    :class="[
      `ribbon-badge--${color}`,
      `ribbon-badge--${size}`,
      { 'ribbon-badge--corner': corner }
    ]"
  >
    <div class="ribbon-badge__content">
      <UIcon v-if="icon" :name="icon" class="ribbon-badge__icon" />
      <span class="ribbon-badge__text">{{ text }}</span>
    </div>
    <div v-if="!corner" class="ribbon-badge__tail ribbon-badge__tail--left"></div>
    <div v-if="!corner" class="ribbon-badge__tail ribbon-badge__tail--right"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
  color?: 'success' | 'error' | 'info' | 'warning' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  corner?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'info',
  size: 'md',
  corner: false
})
</script>

<style scoped>
.ribbon-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 6px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
}

.ribbon-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.ribbon-badge__content {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  position: relative;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.ribbon-badge__icon {
  flex-shrink: 0;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}

.ribbon-badge__text {
  line-height: 1.1;
  white-space: nowrap;
  font-variant: small-caps;
}

/* Ribbon tails with 3D effect */
.ribbon-badge__tail {
  position: absolute;
  top: 100%;
  width: 0;
  height: 0;
  border-style: solid;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.ribbon-badge__tail--left {
  left: 0;
}

.ribbon-badge__tail--right {
  right: 0;
}

/* Enhanced sizes with better proportions */
.ribbon-badge--sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  border-radius: 4px;
}

.ribbon-badge--sm .ribbon-badge__icon {
  width: 0.875rem;
  height: 0.875rem;
}

.ribbon-badge--sm .ribbon-badge__tail {
  border-width: 0.5rem;
}

.ribbon-badge--md {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  border-radius: 6px;
}

.ribbon-badge--md .ribbon-badge__icon {
  width: 1.125rem;
  height: 1.125rem;
}

.ribbon-badge--md .ribbon-badge__tail {
  border-width: 0.625rem;
}

.ribbon-badge--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
}

.ribbon-badge--lg .ribbon-badge__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.ribbon-badge--lg .ribbon-badge__tail {
  border-width: 0.75rem;
}

/* Corner ribbons with dark design for better text readability */
.ribbon-badge--corner.ribbon-badge--success {
  background: linear-gradient(135deg, #374151 0%, #1f2937 50%, #0f172a 100%);
  color: #10b981;
  border: 1px solid rgba(55, 65, 81, 0.3);
}

.ribbon-badge--corner.ribbon-badge--success::before,
.ribbon-badge--corner.ribbon-badge--success::after {
  border-color: #0f172a;
}

.ribbon-badge--corner.ribbon-badge--error {
  background: linear-gradient(135deg, #374151 0%, #1f2937 50%, #0f172a 100%);
  color: #f87171;
  border: 1px solid rgba(55, 65, 81, 0.3);
}

.ribbon-badge--corner.ribbon-badge--error::before,
.ribbon-badge--corner.ribbon-badge--error::after {
  border-color: #0f172a;
}

.ribbon-badge--corner.ribbon-badge--info {
  background: linear-gradient(135deg, #374151 0%, #1f2937 50%, #0f172a 100%);
  color: #60a5fa;
  border: 1px solid rgba(55, 65, 81, 0.3);
}

.ribbon-badge--corner.ribbon-badge--info::before,
.ribbon-badge--corner.ribbon-badge--info::after {
  border-color: #0f172a;
}

.ribbon-badge--corner.ribbon-badge--warning {
  background: linear-gradient(135deg, #374151 0%, #1f2937 50%, #0f172a 100%);
  color: #fbbf24;
  border: 1px solid rgba(55, 65, 81, 0.3);
}

.ribbon-badge--corner.ribbon-badge--warning::before,
.ribbon-badge--corner.ribbon-badge--warning::after {
  border-color: #0f172a;
}

.ribbon-badge--corner.ribbon-badge--neutral {
  background: linear-gradient(135deg, #374151 0%, #1f2937 50%, #0f172a 100%);
  color: #9ca3af;
  border: 1px solid rgba(55, 65, 81, 0.3);
}

.ribbon-badge--corner.ribbon-badge--neutral::before,
.ribbon-badge--corner.ribbon-badge--neutral::after {
  border-color: #0f172a;
}

/* All ribbons with darker design like rejected for better text readability */
.ribbon-badge--success {
  background: linear-gradient(135deg, #374151 0%, #1f2937 35%, #111827 70%, #0f172a 100%);
  color: #10b981;
  border: 1px solid rgba(55, 65, 81, 0.4);
}

.ribbon-badge--success .ribbon-badge__tail--left {
  border-color: transparent #0f172a transparent transparent;
}

.ribbon-badge--success .ribbon-badge__tail--right {
  border-color: transparent transparent transparent #0f172a;
}

.ribbon-badge--error {
  background: linear-gradient(135deg, #374151 0%, #1f2937 35%, #111827 70%, #0f172a 100%);
  color: #f87171;
  border: 1px solid rgba(55, 65, 81, 0.4);
}

.ribbon-badge--error .ribbon-badge__tail--left {
  border-color: transparent #0f172a transparent transparent;
}

.ribbon-badge--error .ribbon-badge__tail--right {
  border-color: transparent transparent transparent #0f172a;
}

.ribbon-badge--info {
  background: linear-gradient(135deg, #374151 0%, #1f2937 35%, #111827 70%, #0f172a 100%);
  color: #60a5fa;
  border: 1px solid rgba(55, 65, 81, 0.4);
}

.ribbon-badge--info .ribbon-badge__tail--left {
  border-color: transparent #0f172a transparent transparent;
}

.ribbon-badge--info .ribbon-badge__tail--right {
  border-color: transparent transparent transparent #0f172a;
}

.ribbon-badge--warning {
  background: linear-gradient(135deg, #374151 0%, #1f2937 35%, #111827 70%, #0f172a 100%);
  color: #fbbf24;
  border: 1px solid rgba(55, 65, 81, 0.4);
}

.ribbon-badge--warning .ribbon-badge__tail--left {
  border-color: transparent #0f172a transparent transparent;
}

.ribbon-badge--warning .ribbon-badge__tail--right {
  border-color: transparent transparent transparent #0f172a;
}

.ribbon-badge--neutral {
  background: linear-gradient(135deg, #374151 0%, #1f2937 35%, #111827 70%, #0f172a 100%);
  color: #9ca3af;
  border: 1px solid rgba(55, 65, 81, 0.4);
}

.ribbon-badge--neutral .ribbon-badge__tail--left {
  border-color: transparent #0f172a transparent transparent;
}

.ribbon-badge--neutral .ribbon-badge__tail--right {
  border-color: transparent transparent transparent #0f172a;
}

/* Horizontal corner ribbon that adapts to text length */
.ribbon-badge--corner {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  line-height: 1.2;
  border-radius: 0 0 0 12px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 10;
  backdrop-filter: blur(8px);
  white-space: nowrap;
}

.ribbon-badge--corner .ribbon-badge__content {
  gap: 0.25rem;
}

/* Remove pseudo-elements for horizontal design */
.ribbon-badge--corner::before,
.ribbon-badge--corner::after {
  display: none;
}

/* No hover effects for better stability */

/* Pulse animation only for pending status */
@keyframes ribbon-pulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 1; 
  }
  50% { 
    transform: scale(1.05); 
    opacity: 0.9; 
  }
}

.ribbon-badge--warning {
  animation: ribbon-pulse 2s ease-in-out infinite;
}

.ribbon-badge--corner.ribbon-badge--warning {
  animation: ribbon-pulse 2s ease-in-out infinite;
}

/* No hover effects - removed for better stability */
</style>