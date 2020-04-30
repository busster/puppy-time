<template>
  <app-template id="app">
    <component :is="componentMap" />
    <!-- <human-view /> -->
    <!-- <home-view /> -->
    <!-- <pet-timeline-view /> -->
    <!-- <create-moment-view /> -->
    <!-- <div>Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/dmitri13" title="dmitri13">dmitri13</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div> -->
  </app-template>
</template>

<script>
/* eslint-disable */ 
import Vue from 'vue'
import firebase from 'firebase'

import { appService } from '@/app3'

import AppTemplate from '@/components/templates/App'

import LoginView from '@/views3/Login'
import LoadingView from '@/views3/Loading'
import HumanView from '@/views3/Human'
import HomeView from '@/views3/Home'
import PetView from '@/views3/Pet'
import CreateMomentView from '@/views3/CreateMoment'

Vue.prototype.$appService = appService

export default {
  name: 'App2',
  components: {
    AppTemplate
  },
  data: () => ({
    state: null
  }),
  mounted () {
    this.$appService.onTransition(state => {
      this.state = state
    }).start()
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.$appService.send('MATERIALIZE', { humanId: user.uid })
    })
  },
  computed: {
    componentMap () {
      const state = this.state
      if (!state) return LoadingView
      if (state.matches('ether')) return LoginView
      else if (state.matches('world.human')) return HumanView
      else if (state.matches('world.home')) return HomeView
      else if (state.matches('world.pet')) return PetView
    }
  }
}
</script>

<style>
@import './styles/main.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
