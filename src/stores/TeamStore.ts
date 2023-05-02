import {defineStore} from 'pinia'
import {computed} from 'vue'
import {filter} from 'lodash'
import {useLocalStorage} from '@vueuse/core'
import {TeamNotFoundException} from '@/stores/exceptions/TeamNotFoundException';
import {TeamAlreadyExistsException} from '@/stores/exceptions/TeamAlreadyExistsException';
import type {Team} from "@/stores/models/Team";

export const useTeamStore = defineStore('team', () => {

  const teams = useLocalStorage('teams', [] as Team[])

  const getTeams = computed((): Team[] => {
    return teams.value
  })

  function addTeam(addedTeam: Team) {
    const existingTeams: Team[] = filter(teams.value, (existingTeam: Team) => {
      return existingTeam.name === addedTeam.name
    })
    if (existingTeams.length) {
      throw new TeamAlreadyExistsException()
    }
    teams.value.push(addedTeam)
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

  function removeTeamByName(name: string) {
    teams.value = filter(teams.value, (existingTeam: Team) => {
      return existingTeam.name !== name
    })
  }

  return {setTeamColor, getTeams, addTeam, removeTeamByName}
})

