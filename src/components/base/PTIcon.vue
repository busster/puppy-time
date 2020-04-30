<template>
  <img class="pt-icon" :class="[`pt-icon--${size}`]" :src="`icons/${variation}${extension}`">
</template>

<script>
export default {
  name: 'PTIcon',
  components: {},
  mixins: [],
  props: {
    variation: {
      type: String,
      required: true
    },
    extension: {
      type: String,
      default: '.svg'
    },
    size: {
      type: String,
      defualt: 'regular',
      validator: val => val.match(/regular|small/)
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
.pt-icon {
  width: 2rem;
  height: 2rem;
  &--small {
    width: 1rem;
    height: 1rem;
  }
}
</style>
