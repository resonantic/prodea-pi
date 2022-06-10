<script setup lang="ts">
import { useAuthStore } from "@/stores";
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";
import AnalysingDisplay from "../components/AnalysingDisplay.vue";

const $router = useRouter();
const $auth = useAuthStore();

const isLoggedIn = computed(() => $auth.isLoggedIn);
const canAccess = computed(() => $auth.isAdmin || $auth.isAutorizado);
const displayName = computed(() => $auth.currentUserInfo?.nome || "");

const logout = async () => {
  await $auth.logout();
  $router.push("/");
};
</script>

<template>
  <div v-if="isLoggedIn">
    <nav
      class="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
      v-if="canAccess"
    >
      <div class="container-fluid">
        <div class="navbar-brand">
          <img src="@/assets/logo.svg" alt="" width="30" height="24" />
          PRODEA
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link
                to="/_/doador"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isDoador"
              >
                Doar
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/_/doador"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isDoador"
              >
                Minhas Doações
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/_/consumidor"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isConsumidor"
              >
                Doações Disponíveis
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/_/consumidor"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isConsumidor"
              >
                Doações Recebidas
              </router-link>
            </li>
            <li class="nav-item"></li>
          </ul>

          <ul class="navbar-nav mb-2 mb-md-0">
            <li class="nav-item navbar-text me-3 fst-italic fw-bold">
              {{ displayName }}
            </li>
            <li class="nav-item">
              <a class="nav-link pointer" @click="logout"> Sair </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container pt-5 mt-5" v-if="canAccess">
      <router-view />
    </main>

    <div v-if="!canAccess">
      <AnalysingDisplay />
    </div>
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
