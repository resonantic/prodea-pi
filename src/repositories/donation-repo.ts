import { auth, db, storage } from "@/firebase";
import { uuid } from "@/helpers/uuid";
import type { Donation } from "@/models/donation";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { onUnmounted, ref } from "vue";
import moment from "moment";
import { notifyError } from "@/helpers/notify";

const collectionRef = collection(db, "donation");

export const useDonationRepo = () => ({
  async uploadPhoto(file: Blob | Uint8Array | ArrayBuffer) {
    const photoId = uuid();
    const photoRef = storageRef(storage, "donation/" + photoId + ".jpg");

    try {
      const result = await uploadBytes(photoRef, file);
      return result.ref.fullPath;
    } catch {
      notifyError("Ocorreu um erro ao enviar a foto.");
      return null;
    }
  },

  async getPhotoUrl(path: string) {
    const photoRef = storageRef(storage, path);
    return await getDownloadURL(photoRef);
  },

  async create(donation: Donation) {
    donation.donorId = auth.currentUser?.uid;

    if (donation.donorId) {
      return await addDoc(collectionRef, donation);
    } else {
      throw Error("Usuário não autenticado.");
    }
  },

  async setAsDelivered(donation: Donation) {
    const docRef = doc(collectionRef, donation.id);
    donation.isDelivered = true;
    setDoc(docRef, donation);
  },

  async setAsCanceled(donation: Donation, reason: string) {
    const docRef = doc(collectionRef, donation.id);
    donation.cancellation = reason;
    setDoc(docRef, donation);
  },

  async setAsRequested(donation: Donation) {
    donation.beneficiaryId = auth.currentUser?.uid || null;

    if (donation.beneficiaryId) {
      const docRef = doc(collectionRef, donation.id);
      setDoc(docRef, donation);
    } else {
      throw Error("Usuário não autenticado.");
    }
  },

  async setAsUnrequested(donation: Donation) {
    donation.beneficiaryId = null;
    const docRef = doc(collectionRef, donation.id);
    setDoc(docRef, donation);
  },

  get availableDonations$() {
    const donations = ref<Donation[]>([]);
    const q = query(
      collectionRef,
      where("beneficiaryId", "==", null),
      where("cancellation", "==", null),
      orderBy("createdAt", "desc")
    );
    const close = onSnapshot(q, (snapshot) => {
      donations.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Donation),
          createdAt: doc.data().createdAt.toDate(),
        }))
        .filter((donation) => {
          const expiration = moment(
            `${donation.expiration} 23:59`,
            "DD/MM/YYYY HH:mm"
          );
          return expiration.diff(moment()) >= 0;
        });
    });
    onUnmounted(close);
    return donations;
  },

  get myDonations$() {
    const userId = auth.currentUser?.uid;
    const donations = ref<Donation[]>([]);
    const q = query(
      collectionRef,
      where("donorId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const close = onSnapshot(q, (snapshot) => {
      donations.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Donation),
        createdAt: doc.data().createdAt.toDate(),
      }));
    });
    onUnmounted(close);
    return donations;
  },

  get receivedDonations$() {
    const userId = auth.currentUser?.uid;
    const donations = ref<Donation[]>([]);
    const q = query(
      collectionRef,
      where("beneficiaryId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const close = onSnapshot(q, (snapshot) => {
      donations.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Donation),
          createdAt: doc.data().createdAt.toDate(),
        }))
        .filter((donation) => donation.beneficiaryId == userId);
    });
    onUnmounted(close);
    return donations;
  },
});
