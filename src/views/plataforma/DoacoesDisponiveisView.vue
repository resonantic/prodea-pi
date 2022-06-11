<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import type { Doacao } from "@/models/doacao";
import { useDoacaoRepo } from "@/repositories/doacao-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";

const $doacaoRepo = useDoacaoRepo();
const $userInfoRepo = useUserInfoRepo();

const donators = $userInfoRepo.useDonatorsInfo();
const doacoes = $doacaoRepo.useDoacoesDisponiveis();

const donatorNameById = (id: string) => {
  const donator = donators.value.find((c) => c.id == id);
  return donator?.nome;
};

const defineAsSolicited = async (doacao: Doacao) => {
  await $doacaoRepo.setDoacaoSolicitada(doacao);
};
</script>

<template>
  <div>
    <h3 class="pb-3">Doações Disponíveis</h3>
    <p v-if="doacoes.length == 0">
      Infelizmente não há doaçoes disponíveis no momento...
    </p>
    <div class="card mb-3" v-for="doacao in doacoes" :key="doacao.id">
      <div class="row g-0">
        <div class="col-md-4">
          <AsyncImg
            v-if="doacao.linkFoto"
            :src="() => $doacaoRepo.getFotoLink(doacao.linkFoto!)"
            class="img-fluid rounded-start"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ doacao.descricao }}</h5>
            <h6 class="card-text">
              Data da Doação: {{ doacao.dataDoacao?.toLocaleDateString() }}
            </h6>
            <h6 v-if="!doacao.entregue" class="card-text">
              Validade: {{ doacao.validade }}
            </h6>
            <h6 v-if="doacao.idDoador" class="card-text">
              Doador: {{ donatorNameById(doacao.idDoador) }}
            </h6>
            <a @click="() => defineAsSolicited(doacao)" class="btn btn-success">
              Solicitar Doação
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
