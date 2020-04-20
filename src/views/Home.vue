<template>
  <div class="home-view">
    <pt-button @click="goBack">back</pt-button>
    <h1>{{ name }}</h1>
    <div>
      <h2>Family</h2>
      <pt-button
        v-for="familyMember in family"
        :key="familyMember.id"
        @click="hangWithFamily(familyMember)"
      >
        {{ familyMemberName(familyMember) }}
      </pt-button>
    </div>
    <div>
      <h2>Friends</h2>
      <pt-button
        v-for="friend in friends"
        :key="friend.id"
      >
        {{ friendName(friend) }}
      </pt-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
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
    homeAt () {
      const homeAt = this.context.homeAt.id
      return this.$appService.children.get(homeAt)
    },
    homeAtContext () {
      return this.homeAt.state.context
    },
    home () {
      return this.homeAtContext.home
    },
    name () {
      return this.home.name
    },
    family () {
      return this.home.family
    },
    friends () {
      return this.home.friends
    }
  },
  methods: {
    familyMemberName (familyMember) {
      const { id, type } = familyMember
      switch(type) {
        case 'Pet':
          return this.homeAt.children.get(id).state.context.pet.name
        case 'Human':
          return ''
      }
    },
    hangWithFamily (familyMember) {
      const { type } = familyMember
      switch(type) {
        case 'Pet':
          return this.$appService.send('CHECK_ON_PET', { pet: familyMember })
        case 'Human':
          return ''
      }
    },
    goBack () {
      this.$appService.send('BACK_ON_THE_LAM')
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
