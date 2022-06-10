<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { computed } from "@vue/reactivity";
import AnalysingDisplay from "../components/AnalysingDisplay.vue";

const $auth = useAuthStore();

const canAccess = computed(() => $auth.isAdmin || $auth.isAutorizado);
</script>

<template>
  <main>
    <router-view v-if="canAccess" />
    <div v-else>
      <AnalysingDisplay />
    </div>
  </main>
</template>
