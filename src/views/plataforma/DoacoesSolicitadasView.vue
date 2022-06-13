<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import type { Doacao } from "@/models/doacao";
import { useDoacaoRepo } from "@/repositories/doacao-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { useLoadingStore } from "@/stores/loading-store";
import moment from "moment";
import { computed, ref } from "vue";

const $doacaoRepo = useDoacaoRepo();
const $userInfoRepo = useUserInfoRepo();
const $loading = useLoadingStore();

const donators = $userInfoRepo.useDonatorsInfo();
const doacoes = $doacaoRepo.useDoacoesRecebidas();

const filter = ref<string>("");
const filteredDoacoes = computed<Doacao[]>(() =>
  filter.value == ""
    ? doacoes.value
    : doacoes.value.filter((doacao) => {
        if (!doacao.idDoador) return false;
        return donatorCityById(doacao.idDoador)
          ?.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            filter.value
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
      })
);

const donatorNameById = (id: string) => {
  const donator = donators.value.find((c) => c.id == id);
  return donator?.nome;
};

const donatorCityById = (id: string) => {
  const donator = donators.value.find((c) => c.id == id);
  return donator?.cidade;
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
  $loading.startLoading();
  await $doacaoRepo.setDoacaoEntregue(doacao);
  $loading.stopLoading();
};

const canDefineAsCancelada = (doacao: Doacao) => {
  if (doacao.cancelamento) return false;
  if (doacao.entregue) return false;
  const validade = moment(`${doacao.validade} 23:59`, "DD/MM/YYYY HH:mm");
  if (validade.diff(moment()) < 0) return false;
  return true;
};

const defineAsCancelada = async (doacao: Doacao) => {
  $loading.startLoading();
  await $doacaoRepo.setDoacaoNaoSolicitada(doacao);
  $loading.stopLoading();
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col-md-7 col-lg-9">
        <h3 class="pb-3">Doações Solicitadas</h3>
      </div>
      <div class="d-flex col-md-5 col-lg-3 mb-3 text-center text-md-end">
        <div class="input-group">
          <span class="input-group-text"> <i class="bi bi-funnel"></i> </span>
          <input
            class="form-control"
            v-model="filter"
            placeholder="Filtrar por cidade..."
          />
        </div>
      </div>
    </div>
    <p v-if="doacoes.length == 0">No momento não há doaçoes solicitadas...</p>
    <div class="card mb-3" v-for="doacao in filteredDoacoes" :key="doacao.id">
      <div class="row g-0">
        <AsyncImg
          v-if="doacao.linkFoto"
          :src="() => $doacaoRepo.getFotoLink(doacao.linkFoto!)"
          class="col-md-4 img-fluid rounded-top rounded-md-start"
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
              Doador: {{ donatorNameById(doacao.idDoador) }}
            </h6>
            <h6 v-if="doacao.idDoador" class="card-text">
              Cidade: {{ donatorCityById(doacao.idDoador) }}
            </h6>
            <h6 class="card-text">Situação: {{ doacaoSituacao(doacao) }}</h6>
            <div class="d-grid gap-2 d-md-block">
              <a
                @click="() => defineAsEntregue(doacao)"
                class="btn btn-success me-md-2"
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
  </div>
</template>
