AuthorizationStatus
<script setup lang="ts">
import { AuthorizationStatus, type UserInfo } from "@/models/user-info";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { useLoadingStore } from "@/stores/loading-store";

const $userInfoRepo = useUserInfoRepo();
const $loading = useLoadingStore();

const users = $userInfoRepo.usersInfo$;

const setAuthorized = async (userInfo: UserInfo) => {
  $loading.startLoading();
  await $userInfoRepo.setStatus(userInfo, AuthorizationStatus.authorized);
  $loading.stopLoading();
};

const setDenied = async (userInfo: UserInfo) => {
  $loading.startLoading();
  await $userInfoRepo.setStatus(userInfo, AuthorizationStatus.denied);
  $loading.stopLoading();
};
</script>

<template>
  <div>
    <h3 class="pb-3">Administração</h3>
    <div class="card mb-3" v-for="user in users" :key="user.id">
      <div class="card-body">
        <h5 class="card-title">{{ user.name }}</h5>
        <h5 class="card-title">CNPJ: {{ user.cnpj }}</h5>
        <p class="card-text mb-2">Endereço: {{ user.address }}</p>
        <p class="card-text mb-2">Cidade: {{ user.city }}</p>
        <p class="card-text mb-2">Email: {{ user.email }}</p>
        <p class="card-text mb-2">Telefone: {{ user.phoneNumber }}</p>
        <p class="card-text mb-2">
          Nome do Responsável: {{ user.responsibleName }}
        </p>
        <p class="card-text mb-2">
          CPF do Responsável:
          {{ user.responsibleCpf }}
        </p>
        <p class="card-text mb-2">Sobre: {{ user.about }}</p>
        <p class="card-text mb-2" v-if="user.isDonor && user.isBeneficiary">
          Perfil: Doador(a) e Beneficiário(a)
        </p>
        <p class="card-text mb-2" v-else>
          Perfil: {{ user.isDonor ? "Doador(a)" : "Beneficiário(a)" }}
        </p>
        <p class="card-text mb-2">
          Situação:
          {{
            user.status == 0
              ? "Aguardando Verificação"
              : user.status == 1
              ? "Autorizado"
              : "Não Autorizado"
          }}
        </p>
        <div class="d-grid gap-2 d-md-block">
          <a
            v-if="user.status == 0 || user.status == 2"
            @click="() => setAuthorized(user)"
            class="btn btn-success me-md-2"
          >
            Autorizar
          </a>
          <a
            v-if="user.status == 0 || user.status == 1"
            @click="() => setDenied(user)"
            class="btn btn-danger"
          >
            Negar Autorização
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
