<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import type { Doacao } from "@/models/doacao";
import { useDoacaoRepo } from "@/repositories/doacao-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { useLoadingStore } from "@/stores/loading-store";
import { Modal } from "bootstrap";
import moment from "moment";
import { onMounted, ref, type VNodeRef } from "vue";

const $doacaoRepo = useDoacaoRepo();
const $userInfoRepo = useUserInfoRepo();
const $loading = useLoadingStore();

const consumers = $userInfoRepo.useConsumersInfo();
const doacoes = $doacaoRepo.useMinhasDoacoes();

const modalEl = ref<VNodeRef | null>(null);
const motivoCancelamento = ref<string>("");
const modalDoacao = ref<Doacao | null>(null);

const consumerNameById = (id: string) => {
  const consumer = consumers.value.find((c) => c.id == id);
  return consumer?.nome;
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
  if (!doacao.idConsumidor) {
    return "Aguardando interessados";
  }
  if (doacao.idConsumidor) {
    return "Aguardando retirada ou entrega";
  }
};

const canDefineAsEntregue = (doacao: Doacao) => {
  if (doacao.cancelamento) return false;
  if (doacao.entregue) return false;
  const validade = moment(`${doacao.validade} 23:59`, "DD/MM/YYYY HH:mm");
  if (validade.diff(moment()) < 0) return false;
  if (!doacao.idConsumidor) return false;
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

onMounted(() => {
  if (modalEl.value) {
    modalEl.value.addEventListener("hidden.bs.modal", () => {
      motivoCancelamento.value = "";
      modalDoacao.value = null;
    });
  }
});

const showMotivoModal = (doacao: Doacao) => {
  motivoCancelamento.value = "";
  modalDoacao.value = doacao;
  if (modalEl.value) {
    const modal = new Modal(modalEl.value);
    modal.show();
  }
};

const defineAsCancelada = async () => {
  if (modalDoacao.value) {
    $loading.startLoading();
    await $doacaoRepo.setDoacaoCancelada(
      modalDoacao.value,
      motivoCancelamento.value
    );
    $loading.stopLoading();
  }
};
</script>

<template>
  <div>
    <h3 class="pb-3">Minhas Doações</h3>
    <p v-if="doacoes.length == 0">No momento não há doaçoes efetuadas...</p>
    <div class="card mb-3" v-for="doacao in doacoes" :key="doacao.id">
      <div class="row g-0">
        <div class="col-md-4">
          <AsyncImg
            v-if="doacao.linkFoto"
            :src="() => $doacaoRepo.getFotoLink(doacao.linkFoto!)"
            class="img-fluid rounded-top rounded-md-start"
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
            <h6 v-if="doacao.idConsumidor" class="card-text">
              Destino: {{ consumerNameById(doacao.idConsumidor) }}
            </h6>
            <h6 class="card-text">Situação: {{ doacaoSituacao(doacao) }}</h6>
            <div class="d-grid gap-2 d-md-block">
              <a
                @click="() => defineAsEntregue(doacao)"
                class="btn btn-success me-md-2"
                v-if="canDefineAsEntregue(doacao)"
              >
                Marcar como Entregue
              </a>
              <a
                @click="() => showMotivoModal(doacao)"
                v-if="canDefineAsCancelada(doacao)"
                class="btn btn-danger"
              >
                Cancelar Doação
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div ref="modalEl" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cancelar Doação</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="motivoInput" class="col-form-label">
                Escreva o motivo do cancelamento da doação.
              </label>
              <textarea
                v-model="motivoCancelamento"
                class="form-control"
                id="motivoInput"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Voltar
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="defineAsCancelada"
            :disabled="motivoCancelamento.length == 0"
          >
            Cancelar Doação
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
