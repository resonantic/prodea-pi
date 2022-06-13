import { auth, db } from "@/firebase";
import type { AuthorizationStatus, UserInfo } from "@/models/user-info";
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

const collectionRef = collection(db, "userInfo");

export const useUserInfoRepo = () => ({
  get donorsInfo$() {
    const donators = ref<UserInfo[]>([]);
    const q = query(
      collectionRef,
      where("isDonor", "==", true),
      where("status", "==", 1),
      orderBy("name")
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

  get beneficiariesInfo$() {
    const beneficiaries = ref<UserInfo[]>([]);
    const q = query(
      collectionRef,
      where("isbeneficiary", "==", true),
      where("status", "==", 1),
      orderBy("name")
    );
    const close = onSnapshot(q, (snapshot) => {
      beneficiaries.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as UserInfo),
      }));
    });
    onUnmounted(close);
    return beneficiaries;
  },

  get usersInfo$() {
    const users = ref<UserInfo[]>([]);
    const q = query(
      collectionRef,
      where("isAdmin", "==", false),
      orderBy("name")
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

  async getCurrentUserInfo() {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const docRef = doc(collectionRef, userId);
      const userInfoDoc = await getDoc(docRef);

      if (!userInfoDoc.exists()) {
        throw Error("Usuário não possui dados cadastrais.");
      }

      return userInfoDoc.data() as UserInfo;
    } else {
      throw Error("Usuário não autenticado.");
    }
  },

  async create(userInfo: UserInfo) {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const docRef = doc(collectionRef, userId);
      return await setDoc(docRef, userInfo);
    } else {
      throw Error("Usuário não autenticado.");
    }
  },

  async setStatus(userInfo: UserInfo, status: AuthorizationStatus) {
    const docRef = doc(collectionRef, userInfo.id);
    userInfo.status = status;
    setDoc(docRef, userInfo);
  },
});
