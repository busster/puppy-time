export default {
  props: ['entity'],
  computed: {
    entityState () {
      return this.entity.state
    },
    entityContext () {
      return this.entityState.context
    },
    associationsView () {
      return this.entityState.matches('view.associations')
    }
  }
}