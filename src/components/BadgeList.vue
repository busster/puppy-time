<template>
  <div class="badge-list">
    <h2 class="badge-list__title">
      <slot name="title" >
        {{ title }}
      </slot>
    </h2>
    <div class="badge-list__items">
      <slot
        v-for="item in list"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BadgeList',
  components: {},
  mixins: [],
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      required: true
    }
  },
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
.badge-list {
  &__title {
    margin-bottom: 1rem;
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(auto-fill, 6rem);
    grid-gap: 1rem;
  }
}
</style>
