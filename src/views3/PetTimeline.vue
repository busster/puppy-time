<template>
  <div class="pet-timeline-view">
    <div class="pet-timeline-view__action-bar">
      <pt-button v-if="hasFromTarget" @click="handleBack" variation="flex-link">
        <pt-icon variation="back" size="small" />
        <p>back</p>
      </pt-button>
    </div>
    <div class="pet-timeline-view__title">
      <h1 class="pet-timeline-view__pet-name">{{ name }}</h1>
      <pt-button @click="handleAddMoment">Add Moment</pt-button>
    </div>
    <div class="pet-timeline-view__timeline pet-timeline-view-timeline">
      <datepicker
        class="pet-timeline-view-timeline__date"
        :value="dateLookingAt"
        format="MMMM dd yyyy"
      />
      <!-- <h2 class="pet-timeline-view-timeline__date">{{ dateLookingAt | date('MMMM Do YYYY') }}</h2> -->
      <timeline class="pet-timeline-view-timeline__dates" :events="events" :activities="activities" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker';
import backMixin from './backMixin'

import Timeline from '@/components/Timeline'

export default {
  name: 'PetTimeline',
  components: {
    Datepicker,
    Timeline
  },
  mixins: [
    backMixin
  ],
  props: [
    'service',
    'state',
    'timelineService',
    'timelineState'
  ],
  data: () => ({
    dateLookingAt: moment().toDate()
  }),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    name () {
      return this.state && this.state.context && this.state.context.pet && this.state.context.pet.name
    },
    events () {
      return this.timelineState && this.timelineState.context.events || []
    },
    activities () {
      return this.timelineState && this.timelineState.context.activities || []
    },
  },
  methods: {
    handleAddMoment () {
      this.timelineService.send('ADD_MOMENT')
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
.pet-timeline-view {
  display: grid;
  grid-template-areas:  "action-bar"
                        "title"
                        "timeline"
                        "pets";

  grid-gap: 1rem;

  &__action-bar {
    grid-area: action-bar;
  }
  &__title {
    grid-area: title;
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 1rem;
  }
  &__timeline {
    grid-area: timeline;
  }
}
.pet-timeline-view-timeline {
  &__date {
    input {
      margin-bottom: 1rem;
      border: 0;
      background: transparent;
      font-size: 2rem;
      cursor: pointer;
    }
    input:focus {
      outline:0;
    }
  }
  &__dates {
    margin: 0 1rem;
  }
}
</style>
