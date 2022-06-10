import { auth, db } from "@/firebase";
import type { UserInfo } from "@/models/user-info";
import { setDoc, collection, doc, getDoc } from "firebase/firestore";

const userInfoCollectionRef = collection(db, "userInfo");

export const useUserInfoRepo = () => ({
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
