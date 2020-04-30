<template>
  <div class="home-associations">
    <h1>{{ name }}</h1>
    <div>
      <h2>Homes</h2>
      <home-badge
        v-for="home in homes"
        :key="home.id"
        :home="home"
        @click="goToEntity(home.id)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeAssociations',
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
    fullName () {
      console.log(this.home)
      return this.home
    }
  },
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
