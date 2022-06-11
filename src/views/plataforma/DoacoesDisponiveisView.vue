<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import type { Doacao } from "@/models/doacao";
import { useDoacaoRepo } from "@/repositories/doacao-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const $doacaoRepo = useDoacaoRepo();
const $userInfoRepo = useUserInfoRepo();

const donators = $userInfoRepo.useDonatorsInfo();
const doacoes = $doacaoRepo.useDoacoesDisponiveis();

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

const defineAsSolicited = async (doacao: Doacao) => {
  await $doacaoRepo.setDoacaoSolicitada(doacao);
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col-md-7 col-lg-9">
        <h3 class="pb-3">Doações Disponíveis</h3>
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
    <p v-if="doacoes.length == 0">
      Infelizmente não há doaçoes disponíveis no momento...
    </p>
    <div class="card mb-3" v-for="doacao in filteredDoacoes" :key="doacao.id">
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
            <h6 v-if="doacao.idDoador" class="card-text">
              Cidade: {{ donatorCityById(doacao.idDoador) }}
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
