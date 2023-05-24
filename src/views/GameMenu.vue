<script setup lang="ts">

import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/stores/OptionStore";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";

const router = useRouter()

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      gameMenu: "In-progress game",
      trackingMenu: "Track",
      gameLog: "Event log",
      configureMenu: "Teams & rosters",
      registryMenu: "Registries",
      playerRegistryMenu: "Player registry",
      gameRegistryMenu: "Game registry",
      optionsMenu: "Options"
    },
    fr: {
      gameMenu: "Partie en cours",
      trackingMenu: "Suivi de la partie",
      gameLog: "Évènements",
      configureMenu: "Équipes & alignements",
      registryMenu: "Registres",
      playerRegistryMenu: "Registre des joueurs",
      gameRegistryMenu: "Registre des parties",
      optionsMenu: "Options"
    }
  }
})

const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value
</script>

<template>
  <main class="main-menu">
    <h2 class="section-title">{{ t('gameMenu') }}</h2>
    <div>
      <el-button class="section-option" icon="Memo" @click="router.push({name: 'game'})">{{
          t('trackingMenu')
        }}
      </el-button>
    </div>
    <div>
      <el-button class="section-option" icon="Reading" @click="router.push({name: 'game-log'})">{{
          t('gameLog')
        }}
      </el-button>
    </div>
    <div>
      <el-button class="section-option" icon="List" @click="router.push({name: 'config'})">{{
          t('configureMenu')
        }}
      </el-button>
    </div>

    <h2 class="section-title">{{ t('registryMenu') }}</h2>
    <div>
      <el-button class="section-option" icon="Management" @click="router.push({name: 'game-registry'})">
        {{ t('gameRegistryMenu') }}
      </el-button>
    </div>
    <div>
      <el-button class="section-option" icon="Management" @click="router.push({name: 'player-registry'})">
        {{ t('playerRegistryMenu') }}
      </el-button>
    </div>

    <h2 class="section-title">{{ t('optionsMenu') }}</h2>
    <div>
      <el-button class="section-option" icon="Setting" @click="router.push({name: 'options'})">{{
          t('optionsMenu')
        }}
      </el-button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.main-menu {
  max-width: 480px;
  margin: 0 auto;
}

.section-title {
  margin-bottom: 1em;
}
.section-option {
  margin-bottom: 1em;
  width: 100%;
}
</style>