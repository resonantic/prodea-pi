<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { computed } from "vue";

const $auth = useAuthStore();

const responsavelNome = computed(
  () => $auth.currentUserInfo?.nomeResponsavel || ""
);
</script>

<template>
  <div>
    <h3>Olá {{ responsavelNome }}! Bem vindo à Plataforma PRODEA.</h3>
  </div>
</template>
