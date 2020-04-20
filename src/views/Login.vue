<template>
  <div class="login-view">
    <pt-button @click="googleLogin">Login With Google</pt-button>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'LoginView',
  components: {},
  mixins: [],
  props: {},
  data: () => ({}),
  created () {},
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {},
  methods: {
    googleLogin () {
      // this.$appService.send('MATERIALIZE', { humanId: 'kH76nKB6jOaQPY9FpTgoHLW7lXq1' })
      var provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      firebase.auth().signInWithPopup(provider).then((result) => {
        const user = result.user;
        this.$appService.send('MATERIALIZE', { humanId: user.uid })
      })
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
