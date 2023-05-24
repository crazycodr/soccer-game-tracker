import {defineStore} from 'pinia'
import {computed} from 'vue'
import {filter, find} from 'lodash'
import {TeamNotFoundException} from '@/stores/exceptions/TeamNotFoundException';
import {TeamAlreadyExistsException} from '@/stores/exceptions/TeamAlreadyExistsException';
import type {Team} from "@/stores/models/Team";
import {useGameStore} from "@/stores/GameStore";

export const useTeamStore = defineStore('team', () => {

  const getTeams = computed((): Team[] => {
    return useGameStore().getGame.teams
  })

  function getTeamByUuid(uuid: string): Team {
    const team = find(useGameStore().getGame.teams, (team: Team) => team.uuid === uuid)
    if (!team) {
      throw new TeamNotFoundException()
    }
    return team
  }

  function addTeam(addedTeam: Team) {
    const existingTeam = find(useGameStore().getGame.teams, (team: Team) => team.uuid === addedTeam.uuid)
    if (existingTeam) {
      throw new TeamAlreadyExistsException()
    }
    useGameStore().getGame.teams.push(addedTeam)
  }

  function updateTeam(uuid: string, name: string, color: string) {
    const team = find(useGameStore().getGame.teams, (team: Team) => {
      return team.uuid === uuid
    })
    if (!team) {
      throw new TeamNotFoundException()
    }
    team.name = name
    team.color = color
  }

  function removeTeamByUuid(name: string) {
    useGameStore().getGame.teams = filter(useGameStore().getGame.teams, (existingTeam: Team) => {
      return existingTeam.name !== name
    })
  }

  return {updateTeam, getTeams, getTeamByUuid, addTeam, removeTeamByUuid}
})

