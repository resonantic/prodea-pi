import { auth } from "@/firebase";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/cadastro",
      name: "cadastro",
      component: () => import("../views/CadastroView.vue"),
    },
    {
      path: "/prodea",
      name: "prodea",
      component: () => import("../views/ProdeaView.vue"),
    },
    {
      path: "/participantes",
      name: "participantes",
      component: () => import("../views/ParticipantesView.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/_",
      name: "plataforma",
      component: () => import("../views/PlataformaView.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "main",
          component: () => import("../views/plataforma/MainView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login" && auth.currentUser) {
    next("/_");
    return;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!auth.currentUser) {
      next("/login");
      return;
    }
  }

  next();
});

export default router;
