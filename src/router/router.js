const router = [
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/account/register.vue"),
  },
  {
    path: "/help",
    name: "help",
    component: () => import("@/views/navBar/help.vue"),
  },
  {
    path: "/feedback",
    name: "feedback",
    component: () => import("@/views/navBar/feedback.vue"),
  },
  {
    path: "/cooperation",
    name: "cooperation",
    component: () => import("@/views/navBar/cooperation.vue"),
  },
];

export default router;