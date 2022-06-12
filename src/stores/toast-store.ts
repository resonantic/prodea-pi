import { uuid } from "@/helpers/uuid";
import type { Toast } from "@/models/toast";
import { defineStore } from "pinia";

interface State {
  toasts: Toast[];
}

export const useToastStore = defineStore("toast", {
  state: (): State => ({
    toasts: [],
  }),

  actions: {
    addToast(message: string, type: "success" | "danger") {
      this.toasts.push({
        id: uuid(),
        message,
        type,
      });
    },

    removeToast(id: string) {
      const index = this.toasts.findIndex((toast) => toast.id === id);
      this.toasts.splice(index, 1);
    },
  },
});
