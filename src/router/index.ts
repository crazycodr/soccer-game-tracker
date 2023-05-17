import { createRouter, createWebHistory } from 'vue-router'
import GameView from '@/views/GameView.vue'
import GameConfigView from '@/views/GameTeamsAndRosters.vue'
import GameOperations from '@/views/GameOperations.vue'
import OptionsView from '@/views/OptionsView.vue'
import GameMenu from '@/views/GameMenu.vue'
import PlayerRegistry from '@/views/PlayerRegistry.vue'
import GameLog from "@/views/GameLog.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/menu',
      name: 'menu',
      component: GameMenu
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
    {
      path: '/game/log',
      name: 'game-log',
      component: GameLog
    },
    {
      path: '/operations',
      name: 'operations',
      component: GameOperations
    },
    {
      path: '/config',
      name: 'config',
      component: GameConfigView
    },
    {
      path: '/registry/players',
      name: 'player-registry',
      component: PlayerRegistry
    },
    {
      path: '/options',
      name: 'options',
      component: OptionsView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/game'
    }
  ]
})

export default router
