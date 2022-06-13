<script setup lang="ts">
import { onMounted, ref, type VNodeRef } from "vue";
import { Modal } from "bootstrap";
import { useModalStore } from "@/stores/modal-store";
import type { UserInfo } from "@/models/user-info";

const props = defineProps<{
  userInfo: UserInfo;
}>();

const el = ref<VNodeRef | null>(null);

const $modal = useModalStore();

onMounted(() => {
  if (el.value) {
    const modal = new Modal(el.value);
    el.value.addEventListener("hidden.bs.modal", () => {
      $modal.closeModal();
    });
    modal.show();
  }
  setTimeout(() => {
    dismiss();
  }, 3500);
});

const dismiss = () => {
  if (el.value) {
    const modal = new Modal(el.value);
    modal.hide();
  }
};
</script>

<template>
  <div ref="el" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.userInfo.name }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p class="mb-2">CNPJ: {{ props.userInfo.cnpj }}</p>
          <p class="mb-2">Endereço: {{ props.userInfo.address }}</p>
          <p class="mb-2">Cidade: {{ props.userInfo.city }}</p>
          <p class="mb-2">Email: {{ props.userInfo.email }}</p>
          <p class="mb-2">Telefone: {{ props.userInfo.phoneNumber }}</p>
          <p class="mb-2">
            Nome do Responsável: {{ props.userInfo.responsibleName }}
          </p>
          <p class="mb-2">Sobre: {{ props.userInfo.about }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
