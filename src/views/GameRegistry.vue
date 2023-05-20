<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'
import {useRegistryStore} from '@/stores/RegistryStore'
import GameEntry from '@/components/registries/GameEntry.vue'
import {useGameStore} from '@/stores/GameStore'
import ActiveGameEntry from '@/components/registries/ActiveGameEntry.vue'
import {computed} from 'vue'
import {useEventStore} from "@/stores/EventStore";

const {t} = useI18n({
  messages: {
    en: {
      gameRegistryTitle: 'Game registry',
      gameRegistryEmpty: 'No games found in registry'
    },
    fr: {
      gameRegistryTitle: 'Registre des parties',
      gameRegistryEmpty: 'Aucune partie dans le registre'
    }
  }
})

const {getEvents} = storeToRefs(useEventStore())
const {getGamesFromRegistry} = storeToRefs(useRegistryStore())
const {getGame} = storeToRefs(useGameStore())

const isGameActive = computed(() => getEvents.value.length > 0)
const registryHasGames = computed(() => getGamesFromRegistry.value.length)

</script>

<template>
  <main class="registry">
    <div class="game-registry">
      <h2>{{ t('gameRegistryTitle') }}</h2>
      <el-row :gutter="10" v-if="registryHasGames || isGameActive">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
          <active-game-entry
              class="active-game"
              :active-game="getGame"/>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6"
                v-for="game in getGamesFromRegistry"
                :key="game.uuid">
          <game-entry
              class="registry-entry"
              :registry-game="game"/>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">{{ t('gameRegistryEmpty') }}</el-col>
      </el-row>
    </div>
  </main>
</template>

<style scoped lang="scss">
.registry {
  margin-bottom: 25em;

  .game-registry {
    margin-bottom: 2em;

    h2 {
      margin-bottom: 1em;
    }

    .active-game, .registry-entry {
      margin-bottom: 10px;
    }
  }
}
</style>