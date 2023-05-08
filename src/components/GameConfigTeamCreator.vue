<script setup lang="ts">
import {computed, ref} from "vue"
import {TeamAlreadyExistsException} from "@/stores/exceptions/TeamAlreadyExistsException";
import {useTeamStore} from "@/stores/TeamStore";
import {Team} from "@/stores/models/Team";
import {ElButton, ElInput} from "element-plus";

const {addTeam} = useTeamStore();

const name = ref('')
const error = ref('')
const showDialog = ref(false)

function keyupHandler(key: KeyboardEvent) {
  error.value = ''
  if (key.key === 'Enter') {
    create()
  }
}

const isEmpty = computed((): boolean => {
  return name.value.trim() === ''
})

function create() {
  try {
    addTeam(new Team(name.value))
    name.value = ''
    showDialog.value = false
  } catch (exception) {
    console.log(exception)
    if (exception instanceof TeamAlreadyExistsException) {
      error.value = exception.message
    } else {
      error.value = 'An error occurred'
    }
  }
}
</script>

<template>
  <main>
    <el-dialog v-model="showDialog" title="Create team" @close="showDialog = false">
      <h3>Team name</h3>
      <el-input @keyup="keyupHandler" v-model="name" placeholder="Team name" />
      <div class="error" v-if="error">
        {{error}}
      </div>
      <template #footer>
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button :disabled="isEmpty" type="primary" @click="create">
          Create
        </el-button>
      </template>
    </el-dialog>
    <el-button @click="showDialog = true" icon="CirclePlusFilled">
      Create
    </el-button>
  </main>
</template>

<style scoped>
.error {
  color: red;
}
</style>