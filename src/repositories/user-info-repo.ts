import { auth, db } from "@/firebase";
import type { UserInfo } from "@/models/user-info";
import {
  setDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { onUnmounted, ref } from "vue";

const userInfoCollectionRef = collection(db, "userInfo");

export const useUserInfoRepo = () => ({
  useDonatorsInfo() {
    const donators = ref<UserInfo[]>([]);
    const close = onSnapshot(userInfoCollectionRef, (snapshot) => {
      donators.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as UserInfo),
        }))
        .filter((donator) => donator.doador && donator.status === 1);
    });
    onUnmounted(close);
    return donators;
  },

  useConsumersInfo() {
    const consumers = ref<UserInfo[]>([]);
    const close = onSnapshot(userInfoCollectionRef, (snapshot) => {
      consumers.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as UserInfo),
        }))
        .filter((consumer) => consumer.consumidor && consumer.status === 1);
    });
    onUnmounted(close);
    return consumers;
  },

  async getUserInfo() {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const docRef = doc(userInfoCollectionRef, userId);
      const userInfoDoc = await getDoc(docRef);

      if (!userInfoDoc.exists()) {
        throw Error("Usuário não possui dados cadastrais.");
      }

      return userInfoDoc.data() as UserInfo;
    } else {
      throw Error("Usuário não autenticado.");
    }
  },

  async createUserInfo(userInfo: UserInfo) {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const docRef = doc(userInfoCollectionRef, userId);
      return await setDoc(docRef, userInfo);
    } else {
      throw Error("Usuário não autenticado.");
    }
  },
});
