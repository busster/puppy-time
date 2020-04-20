<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="pt-button"
    :class="[`pt-button--${variation}`]"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'PTButton',
  components: {},
  mixins: [],
  props: {
    variation: {
      type: String,
      default: 'primary',
      validator: val => val.match(/primary|secondary/)
    }
  },
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {},
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
