<template>
  <div class="human-view">
    <human-associations v-if="associationsView" :human="entityContext.human" />
  </div>
</template>

<script>
/* eslint-disable */ 
import entityMixin from './entityMixin'

import HumanBadge from '@/components/human/Badge'
import HumanAssociations from '@/components/human/Associations'

export default {
  name: 'HumanView',
  components: {
    HumanBadge,
    HumanAssociations
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
