import {defineStore} from 'pinia'
import {computed} from 'vue'
import {each, filter, find} from 'lodash'
import {useStorage} from '@vueuse/core'
import {TeamNotFoundException} from '@/stores/exceptions/TeamNotFoundException';
import {TeamAlreadyExistsException} from '@/stores/exceptions/TeamAlreadyExistsException';
import type {Team} from "@/stores/models/Team";
import {v4, validate} from "uuid";

export const useTeamStore = defineStore('team', () => {

  const teams = useStorage<Team[]>('teams', [], localStorage, {mergeDefaults: true})
  each(teams.value, (team: Team) => {
    if (!validate(team.uuid) || team.uuid === undefined) {
      team.uuid = v4()
    }
  })

  const getTeams = computed((): Team[] => {
    return teams.value
  })

  function addTeam(addedTeam: Team) {
    const existingTeam = find(teams.value, (team: Team) => team.uuid === addedTeam.uuid)
    if (existingTeam) {
      throw new TeamAlreadyExistsException()
    }
    teams.value.push(addedTeam)
  }

  function updateTeam(uuid: string, name: string, color: string) {
    const team = find(teams.value, (team: Team) => {
      return team.uuid === uuid
    })
    if (!team) {
      throw new TeamNotFoundException()
    }
    team.name = name
    team.color = color
  }

  function setTeamColor(teamName: string, color: string) {
    const existingTeams: Team[] = filter(teams.value, (existingTeam: Team) => {
      return existingTeam.name === teamName
    })
    if (existingTeams.length === 0) {
      throw new TeamNotFoundException()
    }
    existingTeams[0].color = color
  }

  function removeTeamByUuid(name: string) {
    teams.value = filter(teams.value, (existingTeam: Team) => {
      return existingTeam.name !== name
    })
  }

  return {setTeamColor, updateTeam, getTeams, addTeam, removeTeamByUuid}
})

