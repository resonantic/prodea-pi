import { defineStore } from "pinia";

interface State {
  isLoading: boolean;
}

export const useLoadingStore = defineStore("loading", {
  state: (): State => ({
    isLoading: false,
  }),

  actions: {
    startLoading() {
      this.isLoading = true;
    },
    stopLoading() {
      this.isLoading = false;
    },
  },
});
