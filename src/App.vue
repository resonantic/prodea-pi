<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores";

const $auth = useAuthStore();

onBeforeMount(async () => {
  await $auth.fetchUser();
});
</script>

<template>
  <RouterView />
</template>

<style>
@import "bootstrap";
</style>
