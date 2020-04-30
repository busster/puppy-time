<template>
  <div class="human-associations">
    <h1>{{ fullName }}</h1>
    <div>
      <h2>Homes</h2>
      <home-badge
        v-for="home in homes"
        :key="home.id"
        :home="home"
        @click="goToEntity(home.id)"
      />
    </div>
    <div>
      <h2>Hangouts</h2>
      
    </div>
    <div>
      <h2>Pets</h2>
      <pet-badge
        v-for="pet in pets"
        :key="pet.id"
        :pet="pet"
        @click="goToEntity(pet.id)"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 

import HomeBadge from '@/components/home/Badge'
import PetBadge from '@/components/pet/Badge'

export default {
  name: 'HumanAssociations',
  components: {
    HomeBadge,
    PetBadge
  },
  mixins: [],
  props: {
    human: {
      required: true
    }
  },
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    fullName () {
      if (!this.human) return
      const { firstName, lastName } = this.human
      return [firstName, lastName].filter(name => !!name).join(' ')
    },
    homes () {
      if (!this.human) return
      return this.human.homes
    },
    pets () {
      if (!this.human) return
      return this.human.pets
    }
  },
  methods: {
    goToEntity (id) {
      this.$appService.send('ACTIVATE_NEW_ENTITY', { entityId: id })
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
`