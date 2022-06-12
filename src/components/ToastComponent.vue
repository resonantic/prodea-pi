<script setup lang="ts">
import { useToastStore } from "@/stores/toast-store";
import { onMounted, ref, type VNodeRef } from "vue";
import { Toast } from "bootstrap";

const props = defineProps<{
  id: string;
  type: "success" | "danger";
  message: string;
}>();

const el = ref<VNodeRef | null>(null);

const $toast = useToastStore();

onMounted(() => {
  if (el.value) {
    const toast = new Toast(el.value);
    toast.show();
    el.value.addEventListener("hidden.bs.toast", () => {
      $toast.removeToast(props.id);
    });
  }
  setTimeout(() => {
    dismiss();
  }, 3500);
});

const dismiss = () => {
  if (el.value) {
    const toast = new Toast(el.value);
    toast.hide();
  }
};
</script>

<template>
  <div
    :class="`toast align-items-center text-white bg-${props.type} border-0`"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    ref="el"
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
