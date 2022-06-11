<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import type { Doacao } from "@/models/doacao";
import { useDoacaoRepo } from "@/repositories/doacao-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import moment from "moment";

const $doacaoRepo = useDoacaoRepo();
const $userInfoRepo = useUserInfoRepo();

const donators = $userInfoRepo.useDonatorsInfo();
const doacoes = $doacaoRepo.useDoacoesRecebidas();

const donatorNameById = (id: string) => {
  const donator = donators.value.find((c) => c.id == id);
  return donator?.nome;
};

const doacaoSituacao = (doacao: Doacao) => {
  if (doacao.cancelamento) {
    return `Cancelada. Motivo: ${doacao.cancelamento}`;
  }
  if (doacao.entregue) {
    return "Doação retirada ou entregue";
  }
  const validade = moment(`${doacao.validade} 23:59`, "DD/MM/YYYY HH:mm");
  if (validade.diff(moment()) < 0) {
    return "Validade expirada";
  }
  return "Aguardando retirada ou entrega";
};

const canDefineAsEntregue = (doacao: Doacao) => {
  if (doacao.cancelamento) return false;
  if (doacao.entregue) return false;
  const validade = moment(`${doacao.validade} 23:59`, "DD/MM/YYYY HH:mm");
  if (validade.diff(moment()) < 0) return false;
  return true;
};

const defineAsEntregue = async (doacao: Doacao) => {
  await $doacaoRepo.setDoacaoEntregue(doacao);
};

const canDefineAsCancelada = (doacao: Doacao) => {
  if (doacao.cancelamento) return false;
  if (doacao.entregue) return false;
  const validade = moment(`${doacao.validade} 23:59`, "DD/MM/YYYY HH:mm");
  if (validade.diff(moment()) < 0) return false;
  return true;
};

const defineAsCancelada = async (doacao: Doacao) => {
  await $doacaoRepo.setDoacaoNaoSolicitada(doacao);
};
</script>

<template>
  <div>
    <h3 class="pb-3">Doações Recebidas</h3>
    <div class="card mb-3" v-for="doacao in doacoes" :key="doacao.id">
      <div class="row g-0">
        <AsyncImg
          v-if="doacao.linkFoto"
          :src="() => $doacaoRepo.getFotoLink(doacao.linkFoto!)"
          class="col-md-4 img-fluid rounded-start"
        />
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
              Destino: {{ donatorNameById(doacao.idDoador) }}
            </h6>
            <h6 class="card-text">Situação: {{ doacaoSituacao(doacao) }}</h6>
            <a
              @click="() => defineAsEntregue(doacao)"
              class="btn btn-success me-2"
              v-if="canDefineAsEntregue(doacao)"
            >
              Marcar como Recebida
            </a>
            <a
              @click="() => defineAsCancelada(doacao)"
              v-if="canDefineAsCancelada(doacao)"
              class="btn btn-danger"
            >
              Cancelar Solicitação
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
