import type { UserInfo } from "@/models/user-info";
import { useModalStore } from "@/stores/modal-store";

const openCancelDonationModal = (onSubmit: (value: string) => void) => {
  const $modal = useModalStore();
  $modal.openCancelDonationModal(onSubmit);
};

const openUserInfoModal = (userInfo: UserInfo) => {
  const $modal = useModalStore();
  $modal.openUserInfoModal(userInfo);
};

export { openCancelDonationModal, openUserInfoModal };
