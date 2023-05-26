<script setup lang="ts">
import {computed, ref} from "vue";
import {useTeamStore} from "@/stores/TeamStore";
import {usePlayerStore} from "@/stores/PlayerStore";
import {filter} from "lodash";
import {Player, PlayerStatusEnum} from "@/stores/models/Player";
import {useTimeout} from "@vueuse/core";
import {useEventStore} from "@/stores/EventStore";

const currentStep = ref(0)
const selectedTeamRef = ref("")
const selectedPlayerRef = ref("")
const selectedContributorRef = ref("")
const confirmed = ref(false)

const selectedTeam = computed({
  get() {
    return selectedTeamRef.value
  },
  set(uuid: string) {
    selectedTeamRef.value = uuid
    selectedPlayerRef.value = ""
    selectedContributorRef.value = ""
    currentStep.value = 1
  }
})

const selectedPlayer = computed({
  get() {
    return selectedPlayerRef.value
  },
  set(uuid: string) {
    selectedPlayerRef.value = uuid
    selectedContributorRef.value = ""
    currentStep.value = 2
  }
})

const selectedContributor = computed({
  get() {
    return selectedContributorRef.value
  },
  set(uuid: string) {
    selectedContributorRef.value = uuid
    currentStep.value = 3
  }
})

const playersThatCanScoreAGoalInSelectedTeam = computed(() => {
  return filter(
      usePlayerStore().getPlayers,
      (player: Player) => {
        return player.team === selectedTeamRef.value
            && (player.status === PlayerStatusEnum.goaling || player.status === PlayerStatusEnum.playing)
      }
  )
})

const playersThatCanContributeToAGoalInSelectedTeam = computed(() => {
  return filter(
      playersThatCanScoreAGoalInSelectedTeam.value,
      (player: Player) => {
        return player.uuid !== selectedPlayerRef.value
      }
  )
})

function confirmGoal() {

  const {addGoal, addPass} = useEventStore()
  const team = useTeamStore().getTeamByUuid(selectedTeamRef.value)
  const player = usePlayerStore().getPlayerByUuid(selectedPlayerRef.value)
  addGoal(new Date(), team, player)

  if (selectedContributorRef.value !== 'none') {
    const contributor = usePlayerStore().getPlayerByUuid(selectedContributorRef.value)
    addPass(new Date(), team, contributor)
  }

  confirmed.value = true
  useTimeout(5000, {
    callback: () => {
      confirmed.value = false
      currentStep.value = 0
    }
  })
}
</script>

<template>
  <el-card class="goal-report">
    <h2>Report a goal</h2>

    <div class="steps">
      <el-steps :active="currentStep">
        <el-step title="Team"/>
        <el-step title="Player"/>
        <el-step title="Contribution"/>
        <el-step title="Confirm"/>
      </el-steps>
    </div>

    <el-alert type="success" v-if="confirmed">
      Goal reported!
    </el-alert>

    <template v-if="!confirmed">
      <div class="step" v-if="currentStep >= 0">
        <h3>Which team scored a goal?</h3>
        <el-radio-group v-model="selectedTeam">
          <el-radio-button v-for="team in useTeamStore().getTeams"
                           :key="team.uuid"
                           :label="team.uuid">{{ team.name }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="step" v-if="currentStep >= 1">
        <h3>Who scored the goal</h3>
        <el-alert type="warning" v-if="playersThatCanScoreAGoalInSelectedTeam.length === 0">
          No one is playing on this team right now!
        </el-alert>
        <el-radio-group v-model="selectedPlayer">
          <el-radio-button v-for="player in playersThatCanScoreAGoalInSelectedTeam"
                           :key="player.uuid"
                           :label="player.uuid">{{ player.name }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="step" v-if="currentStep >= 2">
        <h3>Anyone contributed a decisive pass?</h3>
        <el-alert type="warning" v-if="playersThatCanContributeToAGoalInSelectedTeam.length === 0">
          No one is playing on this team right now!
        </el-alert>
        <el-radio-group v-model="selectedContributor">
          <el-radio-button label="none">No one</el-radio-button>
          <el-radio-button v-for="player in playersThatCanContributeToAGoalInSelectedTeam"
                           :key="player.uuid"
                           :label="player.uuid">{{ player.name }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="step" v-if="currentStep >= 3">
        <el-button type="primary" @click="confirmGoal">Confirm</el-button>
      </div>
    </template>
  </el-card>
</template>

<style lang="scss" scoped>
.goal-report {
  margin-bottom: 1em;

  h2 {
    margin-bottom: 1em;
  }

  .steps {
    margin-bottom: 1em;
  }

  h3 {
    margin-bottom: 1em;
  }

  .step {
    margin-bottom: 1em;
  }
}
</style>