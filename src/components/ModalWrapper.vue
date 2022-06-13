<script setup lang="ts">
import { computed } from "vue";
import { useModalStore } from "@/stores/modal-store";
import CancelDonationModalComponent from "./CancelDonationModalComponent.vue";
import UserInfoModalComponent from "./UserInfoModalComponent.vue";
import type { CancelDonationModal, UserInfoModal } from "@/models/modal";

const $modal = useModalStore();

const hasModal = computed<boolean>(() => $modal.modalType != null);
const isCancelDonationModal = computed<boolean>(
  () => $modal.modalType == "cancelDonationModal"
);
const isUserInfoModal = computed<boolean>(
  () => $modal.modalType == "userInfoModal"
);
</script>

<template>
  <div v-if="hasModal">
    <CancelDonationModalComponent
      v-if="isCancelDonationModal"
      :onSubmit="($modal.modal as CancelDonationModal).onSubmit"
    />
    <UserInfoModalComponent
      v-if="isUserInfoModal"
      :userInfo="($modal.modal as UserInfoModal).userInfo"
    />
  </div>
</template>
