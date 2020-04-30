<template>
  <component
    :is="activePetComponent"
    :service="service"
    :state="state"
    :timelineService="timelineService"
    :timelineState="timelineState"
  />
</template>

<script>
import PetTimeline from '@/views3/PetTimeline'
import CreateMoment from '@/views3/CreateMoment'

export default {
  name: 'PetView',
  components: {},
  mixins: [],
  props: {},
  data: () => ({
    service: null,
    state: null,
    timelineService: null,
    timelineState: null
  }),
  created () {},
  mounted () {
    this.service = this.$appService.state.children['pet-service']
    this.service.onTransition(state => {
      if (state.matches('timeline')) {
        // debugger // eslint-disable-line
        this.timelineService = state.children['pet-timeline']
        this.timelineService.onTransition(timelineState => {
          this.timelineState = timelineState
        })
      }
      this.state = state
    })
  },
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    activePetComponent () {
      const timelineState = this.timelineState && this.timelineState.value
      switch(timelineState) {
        case 'showTimeline':
          return PetTimeline
        case 'addMoment':
          return CreateMoment
        default:
          return PetTimeline
      }
    }
  },
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
