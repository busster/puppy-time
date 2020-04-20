<template>
  <label
    :for="internalId"
    :class="radioControlClass"
    @click="inputChanged"
  >
    <div class="control__indicator" />
    <input
      :id="internalId"
      :checked="isChecked"
      type="radio"
      v-bind="$attrs"
    >
    <div class="label-wrapper">
      <slot />
    </div>
  </label>
</template>

<script>
import { isEqual } from 'lodash'

/**
 * Radio buttons allow the user to select one option from a set.
 */
export default {
  name: 'PTRadioButton',
  status: 'ready',
  release: '1.4.0',
  model: {
    prop: 'model',
    event: 'input'
  },
  props: {
    /**
     * Prop that v-model's value is bound to. This enables you to use the radio-button with
     * the v-model="myModel" syntax.
     */
    model: {
      type: [String, Boolean, Object, Number],
      default: null
    },
    /**
     * The value of the radio-button. When selected v-model="myModel" will equal the value of this prop.
     */
    value: {
      type: [String, Boolean, Object, Number], 
      required: true
    },
    /**
     * Style variation.
     * `primary | bigbtn`
     */
    variation: {
      type: String,
      default: 'primary',
      validator: (value) => value.match(/(primary)/)
    },
    /**
     * Id of the radio button. If not provided the default will be the components _uid.
     */
    id: {
      type: String,
      default: null
    },
    /**
     * Disable radio button from user input
    */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    internalId: null
  }),
  computed: {
    isChecked () {
      if (this.value) return isEqual(this.model, this.value)
      return this.model
    },
    radioControlClass () {
      const variation = `sb-radio-button-${this.variation}`
      const classes = ['sb-radio-button', variation]
      if (this.isChecked) classes.push('checked')
      if (this.disabled) classes.push('disabled')
      return classes
    }
  },
  mounted () {
    this.setId()
  },
  methods: {
    setId () {
      this.internalId = this.id || this._uid
    },
    inputChanged () {
      if (this.disabled) return
      this.$emit('input', this.value)
    }
  },
}
</script>