<template>
  <div class="home-view">
    <home-associations v-if="associationsView" :home="entityContext.home" />
  </div>
</template>

<script>
import entityMixin from './entityMixin'

import HomeAssociations from '@/components/home/Associations'

export default {
  name: 'HomeView',
  components: {
    HomeAssociations
  },
  mixins: [ entityMixin ],
  props: {},
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
