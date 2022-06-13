import { auth } from "@/firebase";
import { useAuthStore } from "@/stores/auth-store";
import { createRouter, createWebHistory } from "vue-router";
import { Collapse } from "bootstrap";

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
          meta: { requiresDonorStatus: true },
        },
        {
          path: "minhas-doacoes",
          name: "minhas-doacoes",
          component: () => import("../views/plataforma/MinhasDoacoesView.vue"),
          meta: { requiresDonorStatus: true },
        },
        {
          path: "doacoes-disponiveis",
          name: "doacoes-disponiveis",
          component: () =>
            import("../views/plataforma/DoacoesDisponiveisView.vue"),
          meta: { requiresBeneficiaryStatus: true },
        },
        {
          path: "doacoes-solicitadas",
          name: "doacoes-solicitadas",
          component: () =>
            import("../views/plataforma/DoacoesSolicitadasView.vue"),
          meta: { requiresBeneficiaryStatus: true },
        },
        {
          path: "admin",
          name: "admin",
          component: () => import("../views/plataforma/AdminView.vue"),
          meta: { requiresAdminStatus: true },
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const navbarEl = document.getElementById("platformNavbar");
  if (navbarEl && navbarEl.classList.contains("show")) {
    const collapse = new Collapse(navbarEl);
    collapse.hide();
  }

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

  if (to.matched.some((record) => record.meta.requiresDonorStatus)) {
    if (!$auth.isDonor) {
      next("/_");
      return;
    }
  }
  if (to.matched.some((record) => record.meta.requiresBeneficiaryStatus)) {
    if (!$auth.isBeneficiary) {
      next("/_");
      return;
    }
  }
  if (to.matched.some((record) => record.meta.requiresAdminStatus)) {
    if (!$auth.isAdmin) {
      next("/_");
      return;
    }
  }

  next();
});

export default router;
