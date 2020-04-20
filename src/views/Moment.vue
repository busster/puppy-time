<template>
  <div class="moment-view">
    <pt-button @click="cancel">cancel</pt-button>
    <div>
      <pt-radio-button
        v-for="eventType in eventTypes"
        :key="eventType"
        v-model="momentType"
        :value="eventType"
      >
        {{ eventType }}
      </pt-radio-button>
    </div>
    <div>
      <pt-radio-button
        v-for="activityType in activityTypes"
        :key="activityType"
        v-model="momentType"
        :value="activityType"
      >
        {{ activityType }}
      </pt-radio-button>
    </div>
    <pt-button @click="createMoment">Create</pt-button>
  </div>
</template>

<script>
import { EventTypes, ActivityTypes } from '../enums/moment'

export default {
  name: 'MomentView',
  components: {},
  mixins: [],
  props: {},
  data: () => ({
    momentType: null,
    eventTypes: Object.keys(EventTypes),
    activityTypes: Object.keys(ActivityTypes)
  }),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {},
  methods: {
    createMoment () {
      const eventType = EventTypes[this.momentType]
      if (eventType) {
        this.$appService.send('CREATE_EVENT', { eventType })
      } else {
        const activityType = ActivityTypes[this.momentType]
        this.$appService.send('CREATE_ACTIVITY', { activityType })
      }
    },
    cancel () {
      this.$appService.send('CANCEL')
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
