<template>
  <div class="home-view">
    <div class="home-view__action-bar">
      <pt-button v-if="hasFromTarget" @click="handleBack" variation="flex-link">
        <pt-icon variation="back" size="small" />
        <p>back</p>
      </pt-button>
    </div>
    <h1 class="home-view__home-name">
      {{ name }}
    </h1>
    <badge-list
      class="home-view__family"
      title="Family"
      :list="family"
    >
      <pt-badge
        slot-scope="{ item }"
        :key="item.ref.id"
        :variation="item.type"
        @click="handleGoToFamily(item)"
      >
        {{ item.name | initials }}
      </pt-badge>
    </badge-list>
    <badge-list
      class="home-view__friends"
      title="Friends"
      :list="friends"
    >
      <pt-badge
        slot-scope="{ item }"
        :key="item.ref.id"
        :variation="item.type"
      >
        {{ item.name | initials }}
      </pt-badge>
    </badge-list>
  </div>
</template>

<script>
import BadgeList from '@/components/BadgeList'
import backMixin from './backMixin'

export default {
  name: 'HomeView',
  components: {
    BadgeList
  },
  mixins: [
    backMixin
  ],
  props: {},
  data: () => ({
    service: null,
    state: null
  }),
  created () {},
  mounted () {
    this.service = this.$appService.state.children['home-service']
    this.service.onTransition(state => {
      this.state = state
    })
  },
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    name () {
      return this.home.name
    },
    family () {
      return this.home.family.map(familyMember => ({
        ...familyMember,
        name: familyMember.value.name || `${familyMember.value.firstName} ${familyMember.value.lastName}`
      }))
    },
    friends () {
      return this.home.friends.map(friend => ({
        ...friend,
        name: friend.value.name || `${friend.value.firstName} ${friend.value.lastName}`
      }))
    },
    home () {
      const home = this.state && this.state.context && this.state.context.home
      return home || { name: '', family: [], friends: [] }
    }
  },
  methods: {
    handleGoToFamily ({ type, ref }) {
      this.service.send(`SELECT_${type}`.toUpperCase(), { ref })
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
.home-view {
  display: grid;
  grid-template-areas:  "action-bar"
                        "home-name"
                        "family-list"
                        "friends-list";

  grid-gap: 1rem;

  &__action-bar {
    grid-area: action-bar;
  }
  &__name {
    grid-area: home-name;
  }
  &__family {
    grid-area: family-list;
  }
  &__friends-list {
    grid-area: friends-list;
  }
}
</style>
