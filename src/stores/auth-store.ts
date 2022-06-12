import {
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { defineStore } from "pinia";
import { auth } from "@/firebase";
import router from "@/router";
import type { FirebaseError } from "@firebase/util";
import { StatusAutorizacao, type UserInfo } from "@/models/user-info";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { notifyError } from "@/helpers/notify";

const $userInfoRepo = useUserInfoRepo();

interface State {
  currentUser: User | null;
  currentUserInfo: UserInfo | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): State => ({
    currentUser: null,
    currentUserInfo: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    isAdmin: (state) => !!state.currentUserInfo?.admin,
    isDoador: (state) => !!state.currentUserInfo?.doador,
    isConsumidor: (state) => !!state.currentUserInfo?.consumidor,
    isAutorizado: (state) =>
      state.currentUserInfo?.status == StatusAutorizacao.autorizado,
    isNegado: (state) =>
      state.currentUserInfo?.status == StatusAutorizacao.negado,
  },

  actions: {
    setCurrentUser(user: User | null) {
      this.currentUser = user;
    },
    setCurrentUserInfo(userInfo: UserInfo | null) {
      this.currentUserInfo = userInfo;
    },

    async login(email: string, password: string) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
      } catch (error: unknown) {
        switch ((error as FirebaseError).code) {
          case "auth/user-not-found":
            notifyError("Usuário não encontrado.");
            break;
          case "auth/wrong-password":
            notifyError("Senha incorreta.");
            break;
          default:
            notifyError("Ocorreu um erro inesperado.");
            break;
        }
      }
      return false;
    },

    async register(email: string, password: string, userInfo: UserInfo) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await $userInfoRepo.createUserInfo(userInfo);
        return true;
      } catch (error: unknown) {
        switch ((error as FirebaseError).code) {
          case "auth/email-already-in-use":
            notifyError("O email informado já está em uso.");
            break;
          case "auth/invalid-email":
            notifyError("O email informado possui um formato inválido.");
            break;
          case "auth/operation-not-allowed":
            notifyError("Operação não permitida.");
            break;
          case "auth/weak-password":
            notifyError("A senha informada é muito fraca.");
            break;
          default:
            notifyError("Ocorreu um erro inesperado.");
            break;
        }
      }

      return false;
    },

    async logout() {
      await signOut(auth);
    },

    async fetchUser(afterFirstLoad: () => void) {
      await auth.setPersistence(browserLocalPersistence);

      let firstLoad = true;

      auth.onAuthStateChanged(async (user) => {
        await router.isReady();

        if (user) {
          const userInfo = await $userInfoRepo.getUserInfo();
          this.setCurrentUser(user);
          this.setCurrentUserInfo(userInfo);
        } else {
          this.setCurrentUser(null);
          this.setCurrentUserInfo(null);
        }

        if (firstLoad) {
          afterFirstLoad();
          firstLoad = false;
        }

        if (user && router.currentRoute.value.path === "/login") {
          router.push("/_");
        } else if (!user && router.currentRoute.value.meta.requiresAuth) {
          router.push("/login");
        }
      });
    },
  },
});
