<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useI18n} from 'vue-i18n'
import PlayerRegistryPlayerEntry from "@/components/registries/PlayerEntry.vue";
import {useRegistryStore} from "@/stores/RegistryStore";

const {t} = useI18n({
  messages: {
    en: {
      playersRegistryTitle: "Player registry"
    },
    fr: {
      playersRegistryTitle: "Registre des joueurs"
    }
  }
})

const {getPlayersFromRegistry} = storeToRefs(useRegistryStore());

</script>

<template>
  <main class="registry">
    <div class="player-registry">
      <h2>{{ t('playersRegistryTitle') }}</h2>
      <el-row gutter="10">
        <el-col v-for="player in getPlayersFromRegistry"
                :span="12"
                :key="player.uuid">
          <PlayerRegistryPlayerEntry
              class="registry-entry"
              :registry-player="player"/>
        </el-col>
      </el-row>
    </div>
  </main>
</template>

<style scoped lang="scss">
.registry {
  margin-bottom: 25em;

  .player-registry {
    margin-bottom: 2em;

    h2 {
      margin-bottom: 1em;
    }

    .registry-entry {
      margin-bottom: 10px;
    }
  }
}
</style>