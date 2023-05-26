<script setup lang="ts">
import {computed, ref} from "vue";
import type {PropType} from "vue";
import type {Team} from "@/stores/models/Team";
import {usePlayerStore} from "@/stores/PlayerStore";
import {each, filter, first, includes, map, reject} from "lodash";
import type {Player} from "@/stores/models/Player";
import {PlayerStatusEnum} from "@/stores/models/Player";
import {useEventStore} from "@/stores/EventStore";
import {useTimeout} from "@vueuse/core";

const props = defineProps({
  editedTeam: {
    type: Object as PropType<Team>,
    required: true
  }
})

const selectablePlayers = computed(() => {
  return filter(usePlayerStore().getPlayers, (player: Player) => player.team === props.editedTeam.uuid)
})

const currentGoalie = first(filter(usePlayerStore().getPlayers, (player: Player) => {
  return player.status === PlayerStatusEnum.goaling
      && player.team === props.editedTeam.uuid
}))

const currentPlayers = map(filter(usePlayerStore().getPlayers, (player: Player) => {
  return player.status === PlayerStatusEnum.playing
      && player.team === props.editedTeam.uuid
}), 'uuid')

const currentBenchers = map(filter(usePlayerStore().getPlayers, (player: Player) => {
  return player.status === PlayerStatusEnum.benching
      && player.team === props.editedTeam.uuid
}), 'uuid')

const selectedGoalie = ref(currentGoalie ? currentGoalie.uuid : "")
const selectedPlayers = ref(currentPlayers)
const completed = ref(false)

function sendPlayersToBenchIfNotPlayingOrGoalingAndNotBenchingAlready() {
  const {sendPlayerToBench} = useEventStore()
  const unselectedPlayers = reject(selectablePlayers.value, (player: Player) => {
    return includes(selectedPlayers.value, player.uuid) || selectedGoalie.value === player.uuid
  })
  each(unselectedPlayers, (player: Player) => {
    if (!includes(currentBenchers, player.uuid)) {
      sendPlayerToBench(new Date(), props.editedTeam, player)
    }
  })
}

function sendPlayersToFieldIfNotAlreadyPlaying() {
  const {sendPlayerToField} = useEventStore()
  each(selectedPlayers.value, (uuid: string) => {
    if (!includes(currentPlayers, uuid)) {
      sendPlayerToField(new Date(), props.editedTeam, usePlayerStore().getPlayerByUuid(uuid))
    }
  })
}

function sendNewGoalTenderInIfNotAlreadyGoaling() {
  const {sendPlayerToGoal} = useEventStore()
  if (!selectedGoalie.value) {
    return
  }
  if (!currentGoalie) {
    sendPlayerToGoal(new Date(), props.editedTeam, usePlayerStore().getPlayerByUuid(selectedGoalie.value))
  } else if (currentGoalie.uuid !== selectedGoalie.value) {
    sendPlayerToGoal(new Date(), props.editedTeam, usePlayerStore().getPlayerByUuid(selectedGoalie.value))
  }
}

function assignPlayerPositions() {
  sendNewGoalTenderInIfNotAlreadyGoaling();
  sendPlayersToFieldIfNotAlreadyPlaying();
  sendPlayersToBenchIfNotPlayingOrGoalingAndNotBenchingAlready();
  completed.value = true
  useTimeout(2000, {controls: true, callback: () => completed.value = false})
}
</script>

<template>
  <el-card class="roster-setup">
    <el-alert type="success" v-if="completed">Players have been assigned!</el-alert>
    <el-row>
      <el-col>
        <h1>
          {{ editedTeam.name }}
          <span v-if="editedTeam.color" class="color-pin" :style="{'background-color': editedTeam.color}"/>
        </h1>
        <p>Selecting a goal tender or player disables the player in the other list. All non selected players will be sent to
          the bench.</p>
      </el-col>
    </el-row>
    <el-row class="selection-section">
      <el-col>
        <h2>Select goal tender</h2>
        <el-radio-group v-model="selectedGoalie">
          <el-radio label="">No one</el-radio>
          <el-radio v-for="player in selectablePlayers"
                    :key="player.uuid"
                    :disabled="includes(selectedPlayers, player.uuid)"
                    :label="player.uuid">{{ player.name }}
          </el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="selection-section">
      <el-col>
        <h2 class="sub-title">Select players</h2>
        <el-checkbox-group v-model="selectedPlayers">
          <el-checkbox v-for="player in selectablePlayers"
                       :key="player.uuid"
                       :disabled="selectedGoalie === player.uuid"
                       :label="player.uuid">{{ player.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button @click="assignPlayerPositions" type="primary">Assign</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.roster-setup {
  margin-bottom: 1em;

  .selection-section {
    margin-bottom: 1em;
  }

  .color-pin {
    display: inline-block;
    vertical-align: middle;
    width: 0.75em;
    height: 0.75em;
    border-radius: 50%;
  }
}
</style>