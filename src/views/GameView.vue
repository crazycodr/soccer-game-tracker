<script setup lang="ts">
import GameScore from "@/components/game/tracking/TeamScores.vue";
import GameRoster from "@/components/game/tracking/RosterList.vue";
import GameTimer from "@/components/game/tracking/GameTimer.vue";
import {useGameStore} from "@/stores/GameStore";
import {GameStatusEnum} from "@/stores/models/Game";
import {computed} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";
import {useOptionStore} from "@/stores/OptionStore";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      operationsMenu: "Operations",
    },
    fr: {
      operationsMenu: "Opérations",
    }
  }
})

const router = useRouter()

function redirectToOperations() {
  router.push({name: 'game-operations'})
}

const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value

const isPreGame = computed(() => useGameStore().getGame.status === GameStatusEnum.PRE_GAME)
const isInProgress = computed(() =>
    useGameStore().getGame.status === GameStatusEnum.PLAYING
    || useGameStore().getGame.status === GameStatusEnum.PAUSED
)
const isCompleted = computed(() => useGameStore().getGame.status === GameStatusEnum.COMPLETED)
</script>

<template>
  <main class="game-view">
    <template v-if="isPreGame">
      <h2>Pre-game state</h2>
      <p>Please visit the operations menu to setup the game and then it can be started!</p>
      <p>
        <el-button class="section-option" icon="Football" @click="redirectToOperations">{{
            t('operationsMenu')
          }}
        </el-button>
      </p>
    </template>
    <template v-if="isInProgress">
      <GameTimer />
      <GameScore />
      <GameRoster />
    </template>
    <template v-if="isCompleted">

    </template>
  </main>
</template>

<style scoped lang="scss">
.game-view {
  margin-bottom: 30em;
}
</style>