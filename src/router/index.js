import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/List.vue";
import EditEmployee from "../views/Edit.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Add",
    name: "Add",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Form.vue"),
  },
  {
    path: "/edit/:employee_id",
    name: "Edit",
    component: EditEmployee,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
