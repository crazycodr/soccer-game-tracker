<script setup lang="ts">
import {computed, ref} from "vue"
import {PlayerAlreadyExistsException} from "@/stores/exceptions/PlayerAlreadyExistsException";
import {usePlayerStore} from "@/stores/PlayerStore";
import {Player} from "@/stores/models/Player";
import {ElButton, ElDialog, ElInput} from "element-plus";

const {addPlayer} = usePlayerStore();

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
    addPlayer(new Player(name.value))
    name.value = ''
    showDialog.value = false
  } catch (exception) {
    console.log(exception)
    if (exception instanceof PlayerAlreadyExistsException) {
      error.value = exception.message
    } else {
      error.value = 'An error occurred'
    }
  }
}
</script>

<template>
  <main>
    <el-dialog v-model="showDialog" title="Create player" @close="showDialog = false">
      <h3>Player name</h3>
      <el-input @keyup="keyupHandler" v-model="name" placeholder="Player name" />
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

<style scoped lang="scss">
.error {
  color: red;
}
</style>