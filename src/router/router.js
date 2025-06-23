const router = [
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/account/register.vue"),
  },
];

export default router;