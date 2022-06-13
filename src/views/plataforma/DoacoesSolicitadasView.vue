<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import type { Donation } from "@/models/donation";
import { useDonationRepo } from "@/repositories/donation-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { useLoadingStore } from "@/stores/loading-store";
import moment from "moment";
import { computed, ref } from "vue";

const $donationRepo = useDonationRepo();
const $userInfoRepo = useUserInfoRepo();
const $loading = useLoadingStore();

const donors = $userInfoRepo.donorsInfo$;
const donations = $donationRepo.receivedDonations$;

const filter = ref<string>("");
const filteredDonations = computed<Donation[]>(() =>
  filter.value == ""
    ? donations.value
    : donations.value.filter((donation) => {
        if (!donation.donorId) return false;
        return donorCityById(donation.donorId)
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

const donorNameById = (id: string) => {
  const donor = donors.value.find((c) => c.id == id);
  return donor?.name;
};

const donorCityById = (id: string) => {
  const donor = donors.value.find((c) => c.id == id);
  return donor?.city;
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
  return "Aguardando retirada ou entrega";
};

const canDefineAsDelivered = (donation: Donation) => {
  if (donation.cancellation) return false;
  if (donation.isDelivered) return false;
  const expiration = moment(`${donation.expiration} 23:59`, "DD/MM/YYYY HH:mm");
  if (expiration.diff(moment()) < 0) return false;
  return true;
};

const defineAsDelivered = async (donation: Donation) => {
  $loading.startLoading();
  await $donationRepo.setAsDelivered(donation);
  $loading.stopLoading();
};

const canDefineAsUnrequested = (donation: Donation) => {
  if (donation.cancellation) return false;
  if (donation.isDelivered) return false;
  const expiration = moment(`${donation.expiration} 23:59`, "DD/MM/YYYY HH:mm");
  if (expiration.diff(moment()) < 0) return false;
  return true;
};

const defineAsUnrequested = async (donation: Donation) => {
  $loading.startLoading();
  await $donationRepo.setAsUnrequested(donation);
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
    <p v-if="donations.length == 0">No momento não há doaçoes solicitadas...</p>
    <div
      class="card mb-3"
      v-for="donation in filteredDonations"
      :key="donation.id"
    >
      <div class="row g-0">
        <AsyncImg
          v-if="donation.photoUrl"
          :src="() => $donationRepo.getPhotoUrl(donation.photoUrl!)"
          class="col-md-4 img-fluid rounded-top rounded-md-start"
        />
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ donation.description }}</h5>
            <h6 class="card-text">
              Data da Doação: {{ donation.createdAt?.toLocaleDateString() }}
            </h6>
            <h6 v-if="!donation.isDelivered" class="card-text">
              Validade: {{ donation.expiration }}
            </h6>
            <h6 v-if="donation.donorId" class="card-text">
              Doador: {{ donorNameById(donation.donorId) }}
            </h6>
            <h6 v-if="donation.donorId" class="card-text">
              Cidade: {{ donorCityById(donation.donorId) }}
            </h6>
            <h6 class="card-text">Situação: {{ donationStatus(donation) }}</h6>
            <div class="d-grid gap-2 d-md-block">
              <a
                @click="() => defineAsDelivered(donation)"
                class="btn btn-success me-md-2"
                v-if="canDefineAsDelivered(donation)"
              >
                Marcar como Recebida
              </a>
              <a
                @click="() => defineAsUnrequested(donation)"
                v-if="canDefineAsUnrequested(donation)"
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
