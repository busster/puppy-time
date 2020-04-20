<template>
  <div class="lam-view">
    <h1>{{ firstName }} {{ lastName }}</h1>
    <div>
      <h2>Homes</h2>
      <pt-button
        v-for="home in homes"
        :key="home.id"
        @click="goToHome(home)"
      >
        {{ homeName(home.id) }}
      </pt-button>
    </div>
    <div>
      <h2>Hangouts</h2>
    </div>
    <div>
      <h2>Pets</h2>
      <pt-button
        v-for="pet in pets"
        :key="pet.id"
        @click="checkOnPet(pet)"
      >
        {{ petName(pet.id) }}
      </pt-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LamView',
  components: {},
  mixins: [],
  props: {},
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    context () {
      return this.$appService.state.context
    },
    human () {
      return this.context.human
    },
    firstName () {
      return this.human.firstName
    },
    lastName () {
      return this.human.lastName
    },
    homes () {
      return this.human.homes
    },
    pets () {
      return this.human.pets
    }
  },
  methods: {
    petName (id) {
      return this.$appService.children.get(id).state.context.pet.name
    },
    homeName (id) {
      return this.$appService.children.get(id).state.context.home.name
    },
    goToHome (home) {
      this.$appService.send('GO_HOME', { home })
    },
    checkOnPet (pet) {
      this.$appService.send('CHECK_ON_PET', { pet })
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
