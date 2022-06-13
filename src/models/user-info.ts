export interface UserInfo {
  id?: string;
  email: string;

  cnpj: string;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  about: string;
  responsibleName: string;
  responsibleCpf: string;

  isDonor: boolean;
  isBeneficiary: boolean;
  isAdmin: boolean;

  status: AuthorizationStatus;
}

export enum AuthorizationStatus {
  waiting = 0,
  authorized = 1,
  denied = 2,
}
