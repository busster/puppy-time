<template>
  <div class="create-moment">
    <h1 class="create-moment__title">Create Moment</h1>
    <div class="create-moment__moments">
      <h2>Events</h2>
      <div class="create-moment__events">
        <pt-checkbox
          v-for="eventType in EventTypes"
          :key="eventType"
          v-model="events"
          :value="eventType"
        >
          <div style="display: flex;">
            <div class="create-moment__event">
              <pt-icon :variation="eventType" />
              {{ eventType }}
            </div>
          </div>
        </pt-checkbox>
      </div>
      <h2>Activities</h2>
      <div class="create-moment__events">
        <pt-checkbox
          v-for="activityType in ActivityTypes"
          :key="activityType"
          v-model="activity"
          :value="activityType"
        >
          <div style="display: flex;">
            <div class="create-moment__event">
              <pt-icon :variation="activityType" />
              {{ activityType }}
            </div>
          </div>
        </pt-checkbox>
      </div>
    </div>
    <div class="create-moment__action">
      <!-- <pt-button variation="link">more options</pt-button> -->
      <pt-button variation="link" @click="handleCancel">cancel</pt-button>
      <pt-button @click="handleAddMoment">create</pt-button>
    </div>
  </div>
</template>

<script>
import { EventTypes, ActivityTypes } from '@/enums/moment'

export default {
  name: 'CreateMomentView',
  components: {},
  mixins: [],
  props: [
    'petService',
    'petState',
    'timelineService',
    'timelineState'
  ],
  data: () => ({
    EventTypes,
    ActivityTypes,
    events: [],
    activity: null
  }),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {},
  methods: {
    handleCancel () {
      this.timelineService.send('CANCEL')
    },
    handleAddMoment () {
      const events = this.events
      const activity = this.activity
      this.timelineService.send('ADD', { events, activity })
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
.create-moment {
  display: grid;
  grid-template-areas:  "title"
                        "moments"
                        "action";
  grid-gap: 1rem;

  &__title {
    grid-area: title;
  }
  &__moments {
    grid-area: moments;
    & > *:nth-last-child(n+2) {
      margin-bottom: 1rem;
    }
  }
  &__events {
    display: grid;
    grid-template-columns: repeat(auto-fill, 6rem);
    grid-gap: 0.25rem;
  }
  &__event {
    display: flex;
    flex-direction: column;
    text-transform: lowercase;
    justify-content: center;
    align-items: center;
  }
  &__action {
    grid-area: action;
    justify-content: end;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: max-content max-content;
  }
}
</style>
