<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores";
import ToastWrapper from "@/components/ToastWrapper.vue";

const $auth = useAuthStore();
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
</template>

<style>
@import "bootstrap/dist/css/bootstrap.min.css";
@import "bootstrap-icons/font/bootstrap-icons.css";
</style>
