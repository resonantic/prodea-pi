import { auth } from "@/firebase";
import { useAuthStore } from "@/stores";
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
        {
          path: "doar",
          name: "doar",
          component: () => import("../views/plataforma/DoarView.vue"),
          meta: { requiresDoador: true },
        },
        {
          path: "minhas-doacoes",
          name: "minhas-doacoes",
          component: () => import("../views/plataforma/MinhasDoacoesView.vue"),
          meta: { requiresDoador: true },
        },
        {
          path: "doacoes-disponiveis",
          name: "doacoes-disponiveis",
          component: () =>
            import("../views/plataforma/DoacoesDisponiveisView.vue"),
          meta: { requiresConsumidor: true },
        },
        {
          path: "doacoes-recebidas",
          name: "doacoes-recebidas",
          component: () =>
            import("../views/plataforma/DoacoesRecebidasView.vue"),
          meta: { requiresConsumidor: true },
        },
        {
          path: "admin",
          name: "admin",
          component: () => import("../views/plataforma/AdminView.vue"),
          meta: { requiresAdmin: true },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
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

  const $auth = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresDoador)) {
    if (!$auth.isDoador) {
      next("/_");
      return;
    }
  }
  if (to.matched.some((record) => record.meta.requiresConsumidor)) {
    if (!$auth.isConsumidor) {
      next("/_");
      return;
    }
  }
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (!$auth.isAdmin) {
      next("/_");
      return;
    }
  }

  next();
});

export default router;
