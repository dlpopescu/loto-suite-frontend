<template>
  <div :style="gridStyle">
    <div 
      v-for="number in numbers" 
      :key="number"
      :class="['number-cell', 
        { 
            'selected': selectedNumbers.includes(number), 
            'highlighted': highlightedNumbers.includes(number)
        }
        ]"
      :style="getCellStyling(number)"
      @click="toggleNumber(number)">
      {{ number }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  minValue: {
    type: Number,
    default: 1
  },
  maxValue: {
    type: Number,
    default: undefined
  },
  colCount: {
    type: Number,
    default: 10
  },
  maxSelectionCount: {
    type: Number,
    default: undefined
  },
  selectedNumbers: {
    type: Array,
    default: () => []
  },
  styling: {
    type: Object,
    default: () => ({})
  },
  highlightedNumbers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedNumbers'])

const internalSelected = ref([...props.selectedNumbers])

const numbers = computed(() =>
  Array.from({ length: props.maxValue - props.minValue + 1 }, (_, i) => i + props.minValue)
)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.colCount}, 1fr)`,
  gap: '4px',
  width: 'auto',
  maxWidth: 'max-content'
}))

const getCellStyling = (number) => {
  const isSelected = internalSelected.value.includes(number)
  const isHighlighted = props.highlightedNumbers?.includes(number) || false
  
  const defaultStyle = {
    borderColor: 'var(--color-text-primary)',
    textColor: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-white)'
  }
  
  const regularStyle = props.styling?.regular || defaultStyle
  const selectedStyle = props.styling?.selected || regularStyle
  const highlightStyle = props.styling?.highlight || selectedStyle
  const hoverStyle = props.styling?.hover || selectedStyle
  
  let style
  
  if (isSelected && isHighlighted) {
      style = highlightStyle
  } else if (isSelected) {
    style = selectedStyle
  } else {
    style = regularStyle
  }
  
  return {
    border: `1px solid ${style.borderColor}`,
    color: style.textColor,
    background: style.backgroundColor,
    '--hover-bg': hoverStyle.backgroundColor,
    '--hover-text': hoverStyle.textColor,
    '--hover-border': hoverStyle.borderColor
  }
}

watch(() => props.selectedNumbers, (newVal) => {
  internalSelected.value = [...newVal]
}, { deep: true })

function toggleNumber(number) {
  const index = internalSelected.value.indexOf(number)
  
  if (index > -1) {
    internalSelected.value.splice(index, 1)
  } else {
    if (internalSelected.value.length < props.maxSelectionCount) {
      internalSelected.value.push(number)
    } else if (props.maxSelectionCount === 1) {
      internalSelected.value = [number]
    }
  }
  
  internalSelected.value.sort((a, b) => a - b)
  
  emit('update:selectedNumbers', [...internalSelected.value])
}

function clearSelection() {
  internalSelected.value = []
  emit('update:selectedNumbers', [])
}

defineExpose({
  clearSelection,
})
</script>

<style scoped>

.number-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border: 1px solid var(--color-main);
  border-radius: 12px;
  font-size: var(--font-size-small);
  cursor: pointer;
  user-select: none;
  font-family: 'Fira Mono', monospace;
}

.number-cell:hover { 
  background: var(--hover-bg) !important;
  color: var(--hover-text) !important;
  border-color: var(--hover-border) !important;
}

.number-cell.selected {
  font-weight: bold;
}

.number-cell.highlighted {
  font-weight: bold;
}

</style>