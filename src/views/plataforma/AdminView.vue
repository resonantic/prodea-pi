<script setup lang="ts">
import { StatusAutorizacao, type UserInfo } from "@/models/user-info";
import { useUserInfoRepo } from "@/repositories/user-info-repo";

const $userInfoRepo = useUserInfoRepo();

const users = $userInfoRepo.useUsersInfo();

const setAutorizado = async (userInfo: UserInfo) => {
  await $userInfoRepo.setUserStatus(userInfo, StatusAutorizacao.autorizado);
};

const setNaoAutorizado = async (userInfo: UserInfo) => {
  await $userInfoRepo.setUserStatus(userInfo, StatusAutorizacao.negado);
};
</script>

<template>
  <div>
    <h3 class="pb-3">Administração</h3>
    <div class="card mb-3" v-for="user in users" :key="user.id">
      <div class="card-body">
        <h5 class="card-title">{{ user.nome }}</h5>
        <h5 class="card-title">CNPJ: {{ user.cnpj }}</h5>
        <p class="card-text mb-2">Endereço: {{ user.endereco }}</p>
        <p class="card-text mb-2">Cidade: {{ user.cidade }}</p>
        <p class="card-text mb-2">Email: {{ user.email }}</p>
        <p class="card-text mb-2">Telefone: {{ user.telefone }}</p>
        <p class="card-text mb-2">
          Nome do Responsável: {{ user.nomeResponsavel }}
        </p>
        <p class="card-text mb-2">
          CPF do Responsável:
          {{ user.cpfResponsavel }}
        </p>
        <p class="card-text mb-2">Sobre: {{ user.sobre }}</p>
        <p class="card-text mb-2" v-if="user.doador && user.consumidor">
          Perfil: Doador e Consumidor
        </p>
        <p class="card-text mb-2" v-else>
          Perfil: {{ user.doador ? "Doador" : "Consumidor" }}
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
        <a
          v-if="user.status == 0 || user.status == 2"
          @click="() => setAutorizado(user)"
          class="btn btn-success me-2"
        >
          Autorizar
        </a>
        <a
          v-if="user.status == 0 || user.status == 1"
          @click="() => setNaoAutorizado(user)"
          class="btn btn-danger"
        >
          Negar Autorização
        </a>
      </div>
    </div>
  </div>
</template>
