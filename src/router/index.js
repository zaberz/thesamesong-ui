import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Layout from "../components/Layout";
import Room from "../views/Room";
import CreateRoom from "../views/CreateRoom";
import About from "../views/About";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: {
      name: "Index"
    },
    children: [
      {
        path: "index",
        name: "Index",
        component: Home
      },
      {
        path: "room/:id",
        name: "Room",
        component: Room
      },
      {
        path: "create",
        name: "CreateRoom",
        component: CreateRoom
      },
      {
        path: "about",
        name: "About",
        component: About
      }
    ]
  },
  {
    path: "*",
    redirect: "/index"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
