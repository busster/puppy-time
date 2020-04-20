<template>
  <div class="kennel-view">
    <pt-button @click="goBack">back</pt-button>
    <h1>{{ name }}</h1>
    <div>
      <h2>{{ dateLookingAt | date('MMMM Do YYYY') }}</h2>
      <timeline :events="events" :activities="activities" />
    </div>
    <template v-if="!readonly">
      <pt-button v-if="currentActivity" @click="endActivity">Finish: {{ currentActivity }}</pt-button>
      <pt-button @click="goToMomentCreation">Create Moment</pt-button>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import Timeline from '@/components/Timeline'

export default {
  name: 'KennelView',
  components: {
    Timeline
  },
  mixins: [],
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
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
      const homeAt = this.context.homeAt && this.context.homeAt.id
      return homeAt && this.$appService.children.get(homeAt)
    },
    petWith () {
      const petWith = this.context.petWith.id
      if (this.homeAt) return this.homeAt.children.get(petWith)
      return this.$appService.children.get(petWith)
    },
    petWithContext () {
      return this.petWith.state.context
    },
    pet () {
      return this.petWithContext.pet
    },
    name () {
      return this.pet.name
    },
    currentActivity () {
      return this.pet.timelineActivity && this.pet.timelineActivity.type
    },
    events () {
      return this.petWithContext.events
    },
    activities () {
      return this.petWithContext.activities
    },
    dateLookingAt () {
      return moment().subtract(this.petWithContext.startDateAgo - 1, 'days').startOf('day')
    }
  },
  methods: {
    goToMomentCreation () {
      this.$appService.send('CREATE_MOMENT')
    },
    goBack () {
      this.readonly ? this.$appService.send('BACK_ON_THE_LAM') : this.$appService.send('BACK_HOME')
    },
    endActivity () {
      this.$appService.send('COMPLETE_ACTIVITY')
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
