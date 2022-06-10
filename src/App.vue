<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores";

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
</template>

<style>
@import "bootstrap";
</style>
