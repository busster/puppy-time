<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import firebase from 'firebase'
import Vue from 'vue'
import { appService } from './app/index.js'
appService.start()
Vue.prototype.$appService = appService

export default {
  name: 'App',
  components: {},
  data: () => ({
    appService
  }),
  mounted () {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.$appService.send('MATERIALIZE', { humanId: user.uid })
    })
  },
  watch: {
    state: {
      handler: function (n) {
        if (!n) return
        else if (n.matches('ether')) this.$router.push({ name: 'Login' })
        else if (n.matches('world.onTheLam')) this.$router.push({ name: 'Lam' })
        else if (n.matches('world.home')) this.$router.push({ name: 'Home' })
        else if (n.matches('world.kennel')) this.$router.push({ name: 'Kennel' })
        else if (n.matches('world.petCam')) this.$router.push({ name: 'PetCam' })
        else if (n.matches('world.momentCreation')) this.$router.push({ name: 'Moment' })
      },
      immediate: true
    }
  },
  computed: {
    state () {
      // debugger // eslint-disable-line
      return this.$appService && this.$appService.state
    }
  }
}
</script>

<style>
@import './styles/main.scss';
</style>
