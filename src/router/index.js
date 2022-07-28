import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      layout: "main",
    },
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/players",
    name: "Players",
    meta: {
      layout: "main",
    },
    component: () => import("../views/Players.vue"),
  },
  {
    path: "/player/:nick",
    name: "Player",
    meta: {
      layout: "main",
    },
    component: () => import("../views/Player.vue"),
  },
  {
    path: "/squads",
    name: "Squads",
    meta: {
      layout: "main",
    },
    component: () => import("../views/Squads.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    meta: {
      layout: "main",
    },
    component: () => import("../views/Settings.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
