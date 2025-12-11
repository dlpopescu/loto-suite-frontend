<template>
  <div>
    <select id="game-select" v-model="selectedGameId" @change="handleGameChange">
      <option v-for="game in games" :key="game.id" :value="game.id">{{ game.display_name }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllGames } from '../api/client.js'

const emit = defineEmits(['game-changed'])

const games = ref([])
const selectedGameId = ref('')

onMounted(async () => {
  try {
    games.value = await getAllGames()
    if (games.value.length > 0) {
      selectedGameId.value = games.value[0].id
      emit('game-changed', selectedGameId.value)
    }
  } catch (error) {
    console.error('Failed to load games:', error)
  }
})

function handleGameChange() {
  emit('game-changed', selectedGameId.value)
}

defineExpose({
  selectedGameId
})

</script>

<style scoped> 

#game-select,
#game-select option {
  width: 100%;
  min-width: 325px;
  font-family: "Nunito", Arial, sans-serif;
  font-size: var(--font-size-regular);
  color: var(--color-text-primary);
}

</style>
