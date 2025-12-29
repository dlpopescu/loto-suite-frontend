<template>
  <div class="castiguri-simple">
    <div v-if="castiguriVarianta > 0" class="castiguri-row">
      <span class="label">Castiguri varianta:</span>
      <span class="value">{{ formatNumberWithDecimals(castiguriVarianta) }} RON</span>
    </div>
    
    <div v-if="castiguriVariantaSpeciala > 0" class="castiguri-row">
      <span class="label">Castiguri varianta speciala:</span>
      <span class="value">{{ formatNumberWithDecimals(castiguriVariantaSpeciala) }} RON</span>
    </div>
    
    <div v-if="castiguriNoroc > 0" class="castiguri-row">
      <span class="label">Castiguri {{ norocGameName }}:</span>
      <span class="value">{{ formatNumberWithDecimals(castiguriNoroc) }} RON</span>
    </div>
    
    <div class="separator"></div>
    
    <div class="castiguri-row total">
      <span class="label">TOTAL CASTIGURI:</span>
      <span class="value">{{ formatNumberWithDecimals(totalCastig) }} RON</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatNumberWithDecimals } from '../utils/utils'

const props = defineProps({
  castiguriVarianta: {
    type: Array,
    default: () => []
  },
  castiguriVariantaSpeciala: {
    type: Array,
    default: () => []
  },
  castiguriNoroc: {
    type: Array,
    default: () => []
  },
  norocGameName: {
    type: String,
    default: 'NOROC'
  }
})

const castiguriVarianta = computed(() => {
  return props.castiguriVarianta.reduce((total, castig) => {
    return total + (castig.win_count * castig.suma)
  }, 0)
})

const castiguriVariantaSpeciala = computed(() => {
  return props.castiguriVariantaSpeciala.reduce((total, castig) => {
    return total + (castig.win_count * castig.suma)
  }, 0)
})

const castiguriNoroc = computed(() => {
  return props.castiguriNoroc.reduce((total, castig) => {
    return total + (castig.win_count * castig.suma)
  }, 0)
})

const totalCastig = computed(() => {
  return castiguriVarianta.value + castiguriVariantaSpeciala.value + castiguriNoroc.value
})
</script>

<style scoped>
.castiguri-simple {
  background: var(--color-white);
  border: 1px solid var(--color-text-primary);
  border-radius: 4px;
  padding: 8px;
  font-family: 'Fira Mono', monospace;
  font-size: var(--font-size-small);
}

.castiguri-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.castiguri-row.total {
  font-weight: 600;
  font-size: var(--font-size-regular);
}

.label {
  color: var(--color-text-primary);
  text-align: right;
  padding-right: 10px;
}

.value {
  color: var(--color-text-primary);
}

.total .value {
  color: var(--color-success-text);
}

.separator {
  border-bottom: 1px solid var(--color-text-primary);
  margin: 4px 0;
}
</style>