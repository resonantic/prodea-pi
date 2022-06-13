import type { UserInfoModal, CancelDonationModal } from "@/models/modal";
import type { UserInfo } from "@/models/user-info";
import { defineStore } from "pinia";

interface State {
  modalType: "userInfoModal" | "cancelDonationModal" | null;
  modal: UserInfoModal | CancelDonationModal | null;
}

export const useModalStore = defineStore("modal", {
  state: (): State => ({
    modalType: null,
    modal: null,
  }),

  actions: {
    openUserInfoModal(userInfo: UserInfo) {
      this.modal = {
        userInfo,
      };
      this.modalType = "userInfoModal";
    },

    openCancelDonationModal(onSubmit: (value: string) => void) {
      this.modal = {
        onSubmit,
      };
      this.modalType = "cancelDonationModal";
    },

    closeModal() {
      this.modal = null;
      this.modalType = null;
    },
  },
});
