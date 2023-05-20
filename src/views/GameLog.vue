<script setup lang="ts">

import {useI18n} from "vue-i18n";
import {useOptionStore} from "@/stores/OptionStore";
import {storeToRefs} from "pinia";
import LogEntry from "@/components/game/event-log/LogEntry.vue";
import {useEventStore} from "@/stores/EventStore";

const {t, locale} = useI18n({
  useScope: 'global',
  messages: {
    en: {
      gameLog: "Event log",
      emptyLog: "The log is empty"
    },
    fr: {
      gameLog: "Évènements",
      emptyLog: "Le journal est vide"
    }
  }
})

const {getEvents} = storeToRefs(useEventStore())
const {getLanguage} = storeToRefs(useOptionStore())

locale.value = getLanguage.value
</script>

<template>
  <main>
    <h2 class="section-title">{{ t('gameLog') }}</h2>
    <div v-if="getEvents.length">
      <LogEntry class="log-entry" v-for="event in getEvents" :key="event.uuid" :event="event" />
    </div>
    <div v-else>
      {{ t('emptyLog') }}
    </div>
  </main>
</template>

<style lang="scss" scoped>
.section-title {
  margin-bottom: 1em;
}

.log-entry {
  background-color: var(--vt-c-white-mute);
  padding: 0.5em;

  &:nth-child(odd) {
    background-color: transparent;
  }
}
</style>