<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth-store";
import ToastWrapper from "@/components/ToastWrapper.vue";
import { useLoadingStore } from "./stores/loading-store";

const $auth = useAuthStore();
const $loading = useLoadingStore();

const isLoading = ref<boolean>(true);

onBeforeMount(async () => {
  await $auth.fetchUser(() => {
    isLoading.value = false;
  });
});
</script>

<template>
  <RouterView v-if="!isLoading" />
  <ToastWrapper v-if="!isLoading" />
  <div
    class="full-loader d-flex justify-content-center align-items-center"
    v-if="$loading.isLoading || isLoading"
  >
    <div
      class="spinner-border text-light"
      style="width: 3rem; height: 3rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style>
@import "bootstrap/dist/css/bootstrap.min.css";
@import "bootstrap-icons/font/bootstrap-icons.css";

.full-loader {
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 100;
  position: fixed;
  top: 0;
  opacity: 0.6 !important;
}
</style>
