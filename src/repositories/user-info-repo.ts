import { auth, db } from "@/firebase";
import type { StatusAutorizacao, UserInfo } from "@/models/user-info";
import {
  setDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { onUnmounted, ref } from "vue";

const userInfoCollectionRef = collection(db, "userInfo");

export const useUserInfoRepo = () => ({
  useDonatorsInfo() {
    const donators = ref<UserInfo[]>([]);
    const q = query(
      userInfoCollectionRef,
      where("doador", "==", true),
      where("status", "==", 1),
      orderBy("nome")
    );
    const close = onSnapshot(q, (snapshot) => {
      donators.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserInfo),
      }));
    });
    onUnmounted(close);
    return donators;
  },

  useConsumersInfo() {
    const consumers = ref<UserInfo[]>([]);
    const q = query(
      userInfoCollectionRef,
      where("consumidor", "==", true),
      where("status", "==", 1),
      orderBy("nome")
    );
    const close = onSnapshot(q, (snapshot) => {
      consumers.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserInfo),
      }));
    });
    onUnmounted(close);
    return consumers;
  },

  useUsersInfo() {
    const users = ref<UserInfo[]>([]);
    const q = query(
      userInfoCollectionRef,
      where("admin", "==", false),
      orderBy("nome")
    );
    const close = onSnapshot(q, (snapshot) => {
      users.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserInfo),
      }));
    });
    onUnmounted(close);
    return users;
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

  async setUserStatus(userInfo: UserInfo, status: StatusAutorizacao) {
    const docRef = doc(userInfoCollectionRef, userInfo.id);
    userInfo.status = status;
    setDoc(docRef, userInfo);
  },
});
