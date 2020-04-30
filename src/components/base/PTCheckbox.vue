<template>
  <div :class="['pt-checkbox', variationClass, checkedClass]">
    <label 
      :class="['form-check-label', {'pt-disabled': disabled}]"     
    >
      <div :class="['checkmarkWrapper']">       
        <input
          :checked="canCheck"
          class="form-check-input"
          type="checkbox"
          v-bind="$attrs"
          :disabled="disabled"
          @change.prevent="inputChanged"     
        >
        <span
          class="checkmark"
        />
        <div
          v-if="$slots.default"
          class="label-slot"
        >
          <slot />
        </div>
      </div>
    </label>
  </div>
</template>

<script>
/**
 * Checkboxes are usually suitable for lists when giving
 * permissions is necessary. This checkbox has a blue
 * theme and changes when clicked.
 */
import {isEqual} from 'lodash'
export default {
  name: 'SbCheckbox',
  status: 'prototype',
  release: '0.0.16',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    /**
     * It is the type that the checkbox is modeled on. You use it as v-model="putYourObjHere" that you want it to work from.
     */
    checked: {
      type: [String, Boolean, Object, Array],
      default: null
    },
    /**
     * It is used to store the value of the checkbox so it can be saved in the model
     */
    value: {
      type: [String, Boolean, Object], 
      default: null
    },
    /**
     * Style variation to give additional meaning.
     * `primary, secondary, tertiary`
     */
    variation: {
      type: String,
      default: 'primary',
      validator: value => {
        return value.match(/(primary|secondary|tertiary)/)
      }
    },
    /**
     * toggles checkbox's disabled state
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    canCheck () {
      if (Array.isArray(this.checked)) {
        return this.checked.includes(this.value)
      }
      return this.checked
    },
    variationClass () {
      return this.disabled ? '' : this.variation
    },
    checkedClass () {
      return this.isChecked ? `pt-checkbox--checked` : ''
    },
    isChecked () {
      if (Array.isArray(this.checked)) return this.checked.includes(this.value)
      return isEqual(this.checked, this.value)
    }
  },
  methods: {
    emitNewArray () {
      const arrCopy = this.checked.slice()
      if (arrCopy.includes(this.value)) {
        arrCopy.splice(arrCopy.indexOf(this.value), 1)
      } else {
        arrCopy.push(this.value)
      }
      this.$emit('change', arrCopy)
    },

    emitCustomTypeCheck () {
      this.$emit('change', isEqual(this.checked, this.value) ? null : this.value)
    },

    emitBoolCheck () {
      this.$emit('change', !this.checked)
    },

    inputChanged () {
      if (Array.isArray(this.checked)) this.emitNewArray()
      else if (this.value) this.emitCustomTypeCheck()
      else this.emitBoolCheck()
    }
  }
}

</script>
<style lang='scss' scoped>
.pt-checkbox {
  width: 6rem; 
  height: 6rem;
  border-radius: var(--border-rounded--small);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: background-color var(--duration-normal) ease-in-out;
  &:hover {
    background-color: var(--color-light-blue);
  }
  label {
    cursor: pointer;
  }
  &--checked {
    background-color: var(--color-light-blue-darker);
    &:hover {
      background-color: var(--color-light-blue-darkest);
    }
  }
}

.form-check-label {
  width: 100%;
  height: 100%;
}

.form-check-input {
  opacity: 0;
  width: 0;
  height: 0;
  margin:0;
}

.label-slot {
  display: flex;
  justify-content: center;
}

// .form-check-label {
//   display: flex;
//   align-items: center;
//   position: relative;
//   &:not(.pt-disabled) {
//     cursor: pointer;
//   }
//    &.pt-disabled {
//     input.form-check-input:checked ~ .checkmark {
//       background-color: $color-disabled;
//       border-color: $color-disabled;
//       color: $color-white;
//     }
//     input.form-check-input ~ .checkmark {
//       background-color: $color-disabled;
//       border-color: $color-disabled;
//       color: $color-white;
//     }
//   }
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
// }

// .content-right, .content-left {
//   display: inline-block;
// }

// /* Create a custom checkbox */
// .checkmark {
//   height: 1em;
//   width: 1em;
//   flex-shrink: 0;
//   margin: 0.25em 0;
//   border-width: 0.0625em;
//   border-style: solid;
// }
// .checkmarkWrapper {
//   position: relative;
//   display: flex;
// }

// /* Create the indicator (the dot/circle - hidden when not checked) */
// .checkmark:after {
//   content: '';
//   position: relative;
//   display: none;
// }

// /* Show the indicator (dot/circle) when checked */
// .form-check-label input.form-check-input:checked ~ .checkmark:after {
//   visibility: visible;
// }

// /* Show the indicator (dot/circle) when checked */
// .form-check-label input.form-check-input ~ .checkmark:after {
//   visibility: hidden;
// }

// /* Style the indicator (dot/circle) */
// .form-check-label .checkmark:after {
//   display: inline-block;
//   position: absolute;
//   left: 0.305em;
//   width: 0.3875em;
//   height: 0.6875em;
//   border-style: solid;
//   border-width: 0 0.125em 0.125em 0;
//   border-color: $color-white;
//   -webkit-transform: rotate(45deg);
//   -ms-transform: rotate(45deg);
//   transform: rotate(45deg);
// }
// .primary .form-check-label .checkmark:after,
// .secondary .form-check-label .checkmark:after,
// .tertiary .form-check-label .checkmark:after
// {
//   color: $color-white;
// }
// .checkmark {
//   background-color: $color-white;
//   border-color: lighten($color_black, 30%);
//   border-radius: $radius-default;
// }
// .primary .form-check-label input.form-check-input:checked ~ .checkmark {
//   background-color: pink;
//   border-color: orange;
// }
// .secondary .form-check-label input.form-check-input:checked ~ .checkmark {
//   background-color: $color-secondary;
//   border-color: $color-secondary;
// }
// .tertiary .form-check-label input.form-check-input:checked ~ .checkmark {
//   background-color: $color-grey;
//   border-color: $color-grey;
// }
// .label-slot {
//   padding-left: 0.5em;
//   line-height: 1.5;
// }
</style>