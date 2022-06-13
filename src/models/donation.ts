export interface Donation {
  id?: string;
  description: string;
  photoUrl: string | null;
  donorId?: string;
  beneficiaryId: null | string;
  expiration: string;
  cancellation: string | null;
  isDelivered: boolean;
  createdAt?: Date;
}
