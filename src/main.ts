import { createApp, type App as VueApp } from "vue";
import { createPinia } from "pinia";
import "bootstrap";

import App from "./App.vue";
import router from "./router";
import { auth } from "./firebase";

let app: VueApp;

const unsubscribe = auth.onAuthStateChanged(() => {
  if (!app) {
    const app = createApp(App);

    app.use(createPinia());
    app.use(router);

    app.mount("#app");

    unsubscribe();
  }
});
