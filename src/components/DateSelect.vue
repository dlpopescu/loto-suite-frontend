<template>
  <div>
    <select id="date-select" v-model="selectedDate" @change="handleDateChange">
      <option v-for="date in dates" :key="date.date" :value="date.date">{{ date.label }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDrawDatesAsync } from '../api/client.js'

const props = defineProps({
  gameId: {
    type: String,
    default: ''
  },
  daysBack: {
    type: Number,
    default: 60
  }
})

const emit = defineEmits(['date-changed'])

const dates = ref([])
const selectedDate = ref('')

onMounted(async () => {
  try {
    dates.value = await getDrawDatesAsync(props.daysBack)
    if (dates.value.length > 0) {
      selectedDate.value = dates.value[0].date
      emit('date-changed', selectedDate.value)
    }
  } catch (error) {
    console.error('Failed to load dates:', error)
  }
})

function handleDateChange() {
  emit('date-changed', selectedDate.value)
}

defineExpose({
  selectedDate
})

</script>

<style scoped>

#date-select,
#date-select option {
  width: 100%;
  min-width: 325px;
  font-family: "Nunito", Arial, sans-serif;
  font-size: var(--font-size-regular);
  color: var(--color-text-primary);
}
</style>