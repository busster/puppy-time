<template>
  <div class="human-view">
    <div class="human-view__action-bar">
      <pt-button v-if="hasFromTarget" @click="handleBack" variation="flex-link">
        <pt-icon variation="back" size="small" />
        <p>back</p>
      </pt-button>
    </div>
    <h1 class="human-view__human-name">
      {{ fullName }}
    </h1>
    <badge-list
      class="human-view__homes"
      title="Homes"
      :list="homes"
    >
      <pt-badge
        slot-scope="{ item }"
        :key="item.ref.id"
        variation="home"
        @click="handleGoToHome(item.ref)"
      >
        {{ item.value.name | initials }}
      </pt-badge>
    </badge-list>
    <badge-list
      class="human-view__pets"
      title="Pets"
      :list="pets"
    >
      <pt-badge
        slot-scope="{ item }"
        :key="item.ref.id"
        variation="pet"
        @click="handleGoToPet(item.ref)"
      >
        {{ item.value.name | initials }}
      </pt-badge>
    </badge-list>
  </div>
</template>

<script>
import BadgeList from '@/components/BadgeList'
import backMixin from './backMixin'

export default {
  name: 'HumanView',
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
    this.service = this.$appService.state.children['human-service']
    this.service.onTransition(state => {
      this.state = state
    })
  },
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    homes () {
      return this.human.homes
    },
    pets () {
      return this.human.pets
    },
    human () {
      const human = this.state && this.state.context && this.state.context.human
      return human || { firstName: '', lastName: '', pets: [], homes: [] }
    },
    fullName () {
      const firstName = this.human.firstName
      const lastName = this.human.lastName
      return `${firstName} ${lastName}`
    }
  },
  methods: {
    handleGoToHome (ref) {
      this.service.send('SELECT_HOME', { ref })
    },
    handleGoToPet (ref) {
      this.service.send('SELECT_PET', { ref })
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">
.human-view {
  display: grid;
  grid-template-areas:  "action-bar"
                        "human-name"
                        "homes"
                        "pets";

  grid-gap: 1rem;

  &__action-bar {
    grid-area: action-bar;
  }
  &__name {
    grid-area: human-name;
  }
  &__homes {
    grid-area: homes;
  }
  &__pets {
    grid-area: pets;
  }
}
</style>
