<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();
const $auth = useAuthStore();

const email = ref<string>("");
const password = ref<string>("");

const canSubmit = computed(() => email.value != "" && password.value != "");

const onSubmit = async () => {
  const result = await $auth.login(email.value, password.value);
  if (result) {
    $router.push("/_");
  }
};
</script>

<template>
  <main class="center d-flex justify-content-center align-items-center">
    <form @submit.prevent="onSubmit">
      <div class="text-center w-100">
        <img
          class="mb-4"
          src="@/assets/logo.svg"
          alt=""
          width="72"
          height="57"
        />
        <h1 class="h3 mb-3 fw-normal">Acessar Plataforma</h1>
      </div>

      <div class="mb-3">
        <label for="emailInput" class="form-label">Email</label>
        <input
          type="email"
          v-model="email"
          class="form-control"
          id="emailInput"
        />
      </div>
      <div class="mb-3">
        <label for="passwordInput" class="form-label">Senha</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="passwordInput"
        />
      </div>
      <button
        type="submit"
        class="w-100 btn btn-lg btn-primary"
        :disabled="!canSubmit"
      >
        Entrar
      </button>
    </form>
  </main>
</template>

<style scoped>
.center {
  height: 100vh;
}
form {
  max-width: 400px;
}
</style>
