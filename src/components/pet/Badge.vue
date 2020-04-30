<template>
  <pt-button v-on="$listeners" class="pet-badge">
    {{ name }}
  </pt-button>
</template>

<script>
/* eslint-disable */ 

export default {
  name: 'PetBadge',
  components: {},
  mixins: [],
  props: ['pet'],
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    name () {
      if (!this.pet.state.context.pet) return
      return this.pet.state.context.pet.name
    }
  },
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
.pet-badge {
  padding: 1rem 2rem;
  border-radius: 50%;
}
</style>
