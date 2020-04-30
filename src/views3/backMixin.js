export default {
  computed: {
    hasFromTarget () {
      return this.$appService && 
        this.$appService.state && 
        this.$appService.state.context && 
        !!this.$appService.state.context.fromTarget
    }
  },
  methods: {
    handleBack () {
      const { fromTarget, entityContexts } = this.$appService.state.context
      const fromRef = entityContexts[fromTarget]
      this.service.send('BACK', { target: fromTarget, ref: fromRef })
    }
  }
}