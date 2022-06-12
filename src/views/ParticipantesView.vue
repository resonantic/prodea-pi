<script setup lang="ts">
import { useUserInfoRepo } from "@/repositories/user-info-repo";

const $userInfoRepo = useUserInfoRepo();
const donators = $userInfoRepo.useDonatorsInfo();
</script>

<template>
  <main class="mt-5 container">
    <h1>Quem participa do projeto?</h1>
    <div v-if="donators.length == 0">
      <p class="lead">Atualmente, o projeto não possui doadores...</p>
    </div>
    <div v-else>
      <p class="lead">Atualmente, o projeto conta com os seguintes doadores:</p>
      <div class="card mb-3" v-for="donator in donators" :key="donator.cnpj">
        <div class="card-body">
          <h5 class="card-title">{{ donator.nome }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">
            {{ donator.endereco }}, {{ donator.cidade }}
          </h6>
          <p class="card-text">{{ donator.sobre }}</p>
        </div>
      </div>
    </div>
    <p class="lead d-grid gap-2 d-md-block">
      <router-link to="/" class="btn btn-lg btn-secondary fw-bold">
        Voltar
      </router-link>
    </p>
  </main>
</template>
