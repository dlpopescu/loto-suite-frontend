<template>
  <div>
    <select :value="modelValue" @change="handleChange">
      <option v-for="item in dataSet" :key="item[keyProp]" :value="item[valueProp]">
        {{ item[displayProp] }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  dataSet: {
    type: Array,
    required: true
  },
  keyProp: {
    type: String,
    default: ''
  },
  valueProp: {
    type: String,
    default: ''
  },
  displayProp: {
    type: String,
    default: ''
  },
  emits: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

function handleChange(event) {
    emit('update:modelValue', event.target.value)

    props.emits.forEach(eventName => {
        if (eventName !== 'update:modelValue') {
            emit(eventName, event.target.value)
        }
    })
}

</script>