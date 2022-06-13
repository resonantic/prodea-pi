<script setup lang="ts">
import { onMounted, ref, type VNodeRef } from "vue";
import { Modal } from "bootstrap";
import { useModalStore } from "@/stores/modal-store";

const props = defineProps<{
  onSubmit: (value: string) => void;
}>();

const el = ref<VNodeRef | null>(null);
const value = ref<string>("");

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
              <textarea v-model="value" class="form-control" id="motivoInput" />
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
            @click="() => props.onSubmit(value)"
            :disabled="value.length == 0"
          >
            Cancelar Doação
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
