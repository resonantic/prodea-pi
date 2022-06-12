<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "vue-router";

const $router = useRouter();
const $auth = useAuthStore();

const logout = async () => {
  await $auth.logout();
  $router.push("/");
};
</script>

<template>
  <div class="d-flex h-100 text-center">
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <div class="row">
        <p class="lead">Infelizmente seu cadastro foi negado.</p>
      </div>
      <div class="row">
        <p class="lead">Em breve entraremos em contato...</p>
      </div>
      <div class="row">
        <p class="lead">
          <a @click="logout" class="btn btn-lg btn-secondary fw-bold"> Sair </a>
        </p>
      </div>
    </div>
  </div>
</template>
