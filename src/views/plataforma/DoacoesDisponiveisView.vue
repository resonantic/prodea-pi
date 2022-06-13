<script setup lang="ts">
import AsyncImg from "@/components/AsyncImg.vue";
import type { Donation } from "@/models/donation";
import { useDonationRepo } from "@/repositories/donation-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { useLoadingStore } from "@/stores/loading-store";
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const $donationRepo = useDonationRepo();
const $userInfoRepo = useUserInfoRepo();
const $loading = useLoadingStore();

const donators = $userInfoRepo.donorsInfo$;
const donations = $donationRepo.availableDonations$;

const filter = ref<string>("");
const filteredDonations = computed<Donation[]>(() =>
  filter.value == ""
    ? donations.value
    : donations.value.filter((donation) => {
        if (!donation.donorId) return false;
        return donatorCityById(donation.donorId)
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
  return donator?.name;
};

const donatorCityById = (id: string) => {
  const donator = donators.value.find((c) => c.id == id);
  return donator?.city;
};

const defineAsRequested = async (donation: Donation) => {
  $loading.startLoading();
  await $donationRepo.setAsRequested(donation);
  $loading.stopLoading();
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
    <p v-if="donations.length == 0">
      Infelizmente não há doaçoes disponíveis no momento...
    </p>
    <div
      class="card mb-3"
      v-for="donation in filteredDonations"
      :key="donation.id"
    >
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
            <h6 v-if="donation.donorId" class="card-text">
              Doador: {{ donatorNameById(donation.donorId) }}
            </h6>
            <h6 v-if="donation.donorId" class="card-text">
              Cidade: {{ donatorCityById(donation.donorId) }}
            </h6>
            <div class="d-grid gap-2 d-md-block">
              <a
                @click="() => defineAsRequested(donation)"
                class="btn btn-success"
              >
                Solicitar Doação
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
