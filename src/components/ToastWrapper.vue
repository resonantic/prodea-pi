<script setup lang="ts">
import type { Toast } from "@/models/toast";
import { useToastStore } from "@/stores/toast-store";
import { computed } from "vue";
import ToastComponent from "@/components/ToastComponent.vue";

const $toast = useToastStore();

const toasts = computed<Toast[]>(() => $toast.toasts);
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <ToastComponent
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
      :id="toast.id"
    />
  </div>
</template>
