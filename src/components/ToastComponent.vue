<script setup lang="ts">
import { useToastStore } from "@/stores/toast-store";
import { onMounted } from "vue";

const props = defineProps<{
  id: string;
  type: "success" | "danger";
  message: string;
}>();

const $toast = useToastStore();

onMounted(() => {
  setTimeout(() => {
    dismiss();
  }, 5000);
});

const dismiss = () => {
  $toast.removeToast(props.id);
};
</script>

<template>
  <div
    :class="`toast fade show align-items-center text-white bg-${props.type} border-0`"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">
        {{ props.message }}
      </div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
        @click="dismiss"
      />
    </div>
  </div>
</template>
