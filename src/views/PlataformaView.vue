<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";
import AnalysingDisplay from "../components/AnalysingDisplay.vue";
import DeniedDisplay from "../components/DeniedDisplay.vue";

const $router = useRouter();
const $auth = useAuthStore();

const isLoggedIn = computed(() => $auth.isLoggedIn);
const isWaiting = computed(
  () => !$auth.isAdmin && !$auth.isAuthorized && !$auth.isDenied
);
const isDenied = computed(() => !$auth.isAdmin && $auth.isDenied);
const displayName = computed(() => $auth.currentUserInfo?.name || "");

const logout = async () => {
  await $auth.logout();
  $router.push("/");
};
</script>

<template>
  <div v-if="isLoggedIn">
    <nav
      class="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
      v-if="!isWaiting && !isDenied"
    >
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">
          <img src="@/assets/logo.svg" alt="" width="30" height="24" />
          PRODEA
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#platformNavbar"
          aria-controls="platformNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="platformNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link
                active-class="active"
                to="/_/doar"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isDonor"
              >
                Doar
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                active-class="active"
                to="/_/minhas-doacoes"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isDonor"
              >
                Minhas Doações
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                active-class="active"
                to="/_/doacoes-disponiveis"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isBeneficiary"
              >
                Doações Disponíveis
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                active-class="active"
                to="/_/doacoes-solicitadas"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isBeneficiary"
              >
                Doações Solicitadas
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                active-class="active"
                to="/_/admin"
                class="nav-link"
                aria-current="page"
                v-if="$auth.isAdmin"
              >
                Administração
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

    <main class="container pt-5 mt-5" v-if="!isWaiting && !isDenied">
      <router-view />
    </main>

    <div v-if="isWaiting">
      <AnalysingDisplay />
    </div>

    <div v-if="isDenied">
      <DeniedDisplay />
    </div>
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
