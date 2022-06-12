import { useToastStore } from "@/stores/toast-store";

const notifySuccess = (message: string) => {
  const $toast = useToastStore();
  $toast.addToast(message, "success");
};

const notifyError = (message: string) => {
  const $toast = useToastStore();
  $toast.addToast(message, "danger");
};

export { notifySuccess, notifyError };
