import type { UserInfo } from "./user-info";

export interface UserInfoModal {
  userInfo: UserInfo;
}

export interface CancelDonationModal {
  onSubmit: (value: string) => void;
}
