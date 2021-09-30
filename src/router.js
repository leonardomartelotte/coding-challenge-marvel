import Vue from "vue";
import VueRouter from "vue-router";
import CharacterDetails from "./components/CharacterDetails.vue";
import MainPage from "./components/MainPage.vue";

Vue.use(VueRouter);

export const router = new VueRouter({

  mode: "history",
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },

  linkExactActiveClass: "active",
  
  routes: [
    {
      path: "/",
      name: "main page",
      components: { default: MainPage },
    },
    {
      path: "/details",
      name: "details",
      components: { default: CharacterDetails },
    },
  ],
});
