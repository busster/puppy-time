<template>
  <pt-button v-on="$listeners" class="home-badge">
    {{ name }}
  </pt-button>
</template>

<script>
export default {
  name: 'HomeBadge',
  components: {},
  mixins: [],
  props: ['home'],
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    name () {
      if (!this.home.state.context.home) return
      return this.home.state.context.home.name
    }
  },
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
.home-badge {
  padding: 1rem 2rem;
}
</style>
