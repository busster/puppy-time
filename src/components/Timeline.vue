<template>
  <div class="timeline">
    <template
      v-for="moment in timeline"
    >
      <div :key="'time' + moment.date + moment.type">
        {{ moment.type }}
      </div>
      <div :key="'type' + moment.date + moment.type">
        {{ moment.date | date('h:mm:ss a') }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  components: {},
  mixins: [],
  props: {
    events: {
      type: Array,
      default: () => ([])
    },
    activities: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    timeline () {
      return [...this.events, ...this.activities]
        .sort((a, b) => {
          const aDate = a.date || a.startDate
          const bDate = b.date || b.startDate
          return aDate.valueOf() - bDate.valueOf()
        })
        .map(e => ({
          type: e.type,
          date: e.date || e.startDate
        }))
    }
  },
  methods: {},
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
.timeline {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 1rem;
}
</style>
