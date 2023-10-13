<template>
  <div>
    <vnp-input-box :modelValue="val" @click="show = true"></vnp-input-box>
    <vnp-keyboard v-model:show="show" v-model="val"></vnp-keyboard>
  </div>
</template>

<script>
import Box from './vnp-input-box'
import Keyboard from './vnp-keyboard'

export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  components: {
    'vnp-input-box': Box,
    'vnp-keyboard': Keyboard
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    val: {
      set(v) {
        this.$emit('update:modelValue', v)
      },
      get() {
        return this.modelValue
      }
    }
  }
}
</script>
