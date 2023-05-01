import { createRouter, createWebHistory } from 'vue-router'
import GameView from "@/views/GameView.vue";
import GameConfigView from "@/views/GameConfigView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameView
    },
    {
      path: '/config',
      name: 'config',
      component: GameConfigView
    }
  ]
})

export default router
