<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import { openCancelDonationModal, openUserInfoModal } from "@/helpers/modal";
import type { Donation } from "@/models/donation";
import { useDonationRepo } from "@/repositories/donation-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { useLoadingStore } from "@/stores/loading-store";
import moment from "moment";
import { onMounted, ref, type VNodeRef } from "vue";

const $donationRepo = useDonationRepo();
const $userInfoRepo = useUserInfoRepo();
const $loading = useLoadingStore();

const beneficiaries = $userInfoRepo.beneficiariesInfo$;
const donations = $donationRepo.myDonations$;

const modalEl = ref<VNodeRef | null>(null);
const cancelReason = ref<string>("");
const modalDonation = ref<Donation | null>(null);

const beneficiaryNameById = (id: string) => {
  const beneficiary = beneficiaries.value.find((c) => c.id == id);
  return beneficiary?.name;
};

const donationStatus = (donation: Donation) => {
  if (donation.cancellation) {
    return `Cancelada. Motivo: ${donation.cancellation}`;
  }
  if (donation.isDelivered) {
    return "Doação retirada ou entregue";
  }
  const expiration = moment(`${donation.expiration} 23:59`, "DD/MM/YYYY HH:mm");
  if (expiration.diff(moment()) < 0) {
    return "Validade expirada";
  }
  if (!donation.beneficiaryId) {
    return "Aguardando interessados";
  }
  if (donation.beneficiaryId) {
    return "Aguardando retirada ou entrega";
  }
};

const canDefineAsDelivered = (donation: Donation) => {
  if (donation.cancellation) return false;
  if (donation.isDelivered) return false;
  const expiration = moment(`${donation.expiration} 23:59`, "DD/MM/YYYY HH:mm");
  if (expiration.diff(moment()) < 0) return false;
  if (!donation.beneficiaryId) return false;
  return true;
};

const defineAsDelivered = async (donation: Donation) => {
  $loading.startLoading();
  await $donationRepo.setAsDelivered(donation);
  $loading.stopLoading();
};

const canDefineAsCanceled = (donation: Donation) => {
  if (donation.cancellation) return false;
  if (donation.isDelivered) return false;
  const expiration = moment(`${donation.expiration} 23:59`, "DD/MM/YYYY HH:mm");
  if (expiration.diff(moment()) < 0) return false;
  return true;
};

onMounted(() => {
  if (modalEl.value) {
    modalEl.value.addEventListener("hidden.bs.modal", () => {
      cancelReason.value = "";
      modalDonation.value = null;
    });
  }
});

const showCancelDonationModal = (donation: Donation) => {
  openCancelDonationModal(async (value) => {
    $loading.startLoading();
    await $donationRepo.setAsCanceled(donation, value);
    $loading.stopLoading();
  });
};

const showUserInfoModal = (id: string) => {
  const userInfo = beneficiaries.value.find((c) => c.id == id);
  if (userInfo) openUserInfoModal(userInfo);
};
</script>

<template>
  <div>
    <h3 class="pb-3">Minhas Doações</h3>
    <p v-if="donations.length == 0">No momento não há doaçoes efetuadas...</p>
    <div class="card mb-3" v-for="donation in donations" :key="donation.id">
      <div class="row g-0">
        <div class="col-md-4">
          <AsyncImg
            v-if="donation.photoUrl"
            :src="() => $donationRepo.getPhotoUrl(donation.photoUrl!)"
            class="img-fluid rounded-top rounded-md-start"
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ donation.description }}</h5>
            <h6 class="card-text">
              Data da Doação: {{ donation.createdAt?.toLocaleDateString() }}
            </h6>
            <h6 v-if="!donation.isDelivered" class="card-text">
              Validade: {{ donation.expiration }}
            </h6>
            <h6 v-if="donation.beneficiaryId" class="card-text">
              Destino: {{ beneficiaryNameById(donation.beneficiaryId) }}
              <a
                style="cursor: pointer"
                @click="() => showUserInfoModal(donation.beneficiaryId!)"
              >
                <i class="bi bi-info-circle"></i>
              </a>
            </h6>
            <h6 class="card-text">Situação: {{ donationStatus(donation) }}</h6>
            <div class="d-grid gap-2 d-md-block">
              <a
                @click="() => defineAsDelivered(donation)"
                class="btn btn-success me-md-2"
                v-if="canDefineAsDelivered(donation)"
              >
                Marcar como Entregue
              </a>
              <a
                @click="() => showCancelDonationModal(donation)"
                v-if="canDefineAsCanceled(donation)"
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
</template>
