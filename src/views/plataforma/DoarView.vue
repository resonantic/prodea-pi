<script setup lang="ts">
import { notifySuccess } from "@/helpers/notify";
import type { Donation } from "@/models/donation";
import { useDonationRepo } from "@/repositories/donation-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { useLoadingStore } from "@/stores/loading-store";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();
const $userInfoRepo = useUserInfoRepo();
const $donationRepo = useDonationRepo();
const $loading = useLoadingStore();

const beneficiaries = $userInfoRepo.beneficiariesInfo$;

const photoBlob = ref<Blob | null>(null);
const donation = reactive<Donation>({
  description: "",
  photoUrl: null,
  beneficiaryId: null,
  expiration: "",
  cancellation: null,
  isDelivered: false,
});

const photoChanged = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.item(0);
  if (file) {
    const bytes = await file.arrayBuffer();
    const arrayBufferView = new Uint8Array(bytes);
    const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
    photoBlob.value = blob;
  } else {
    photoBlob.value = null;
  }
};

const onSubmit = async () => {
  $loading.startLoading();
  if (photoBlob.value) {
    donation.photoUrl = await $donationRepo.uploadPhoto(photoBlob.value);
  }
  donation.createdAt = new Date();
  const result = await $donationRepo.create(donation);
  if (result) {
    await $router.push("/_/minhas-doacoes");
    notifySuccess("Doação postada com sucesso.");
  }
  $loading.stopLoading();
};
</script>

<template>
  <div>
    <h3 class="pb-3">Doar</h3>
    <form @submit.prevent="onSubmit">
      <div class="row">
        <div class="mb-3">
          <label for="descriptionInput" class="form-label"> Descrição </label>
          <textarea
            v-model="donation.description"
            class="form-control"
            id="descriptionInput"
            placeholder="Descreva as condições do produto que será doado..."
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="photoInput" class="form-label">Foto</label>
          <input
            class="form-control"
            type="file"
            id="photoInput"
            @change="photoChanged"
            accept="image/jpeg"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="beneficiarySelect" class="form-label">
            Doar para uma entidade específica? Caso não seja selecionada nenhuma
            entidade específica, a doação ficará disponível para qualquer
            entidade cadastrada na plataforma.
          </label>
          <select
            v-model="donation.beneficiaryId"
            class="form-select"
            id="beneficiarySelect"
          >
            <option :value="null">Não</option>
            <option
              v-for="beneficiary in beneficiaries"
              :key="beneficiary.id"
              :value="beneficiary.id"
            >
              {{ beneficiary.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="expirationInput" class="form-label">
            Prazo de Validade da Doação
          </label>
          <input
            type="text"
            v-model="donation.expiration"
            class="form-control"
            id="expirationInput"
            v-maska="'##/##/####'"
          />
        </div>
      </div>

      <div class="d-grid gap-2 d-md-block">
        <button type="submit" class="btn btn-primary">Postar Doação</button>
      </div>
    </form>
  </div>
</template>
