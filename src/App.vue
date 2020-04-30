<template>
  <div>
    <component
      :is="entityComponent"
      :entity="activeEntity"
    />
  </div>
</template>

<script>
/* eslint-disable */ 
import firebase from 'firebase'
import Vue from 'vue'

import HumanView from '@/views2/Human'
import HomeView from '@/views2/Home'
import LoadingView from '@/views2/Loading'

import { Entities } from '@/enums/entities'

// import { appService } from './app/index.js'
import { appService } from './app2'

Vue.prototype.$appService = appService

export default {
  name: 'App',
  components: {},
  data: () => ({
    appService,
    state: null
  }),
  mounted () {
    this.$appService.onTransition(state => {
      this.state = state
    })
    this.$appService.start()
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.$appService.send('MATERIALIZE', { humanId: user.uid })
    })
  },
  computed: {
    activeEntity () {
      return this.state && this.state.context.activeEntity && this.state.context.activeEntity
    },
    entityComponent () {
      const type = this.activeEntity && this.activeEntity.state.context.type
      switch (type) {
        case Entities.Me:
        case Entities.Family:
        case Entities.Friend:
          return HumanView
        case Entities.Home:
        case Entities.Hangout:
          return HomeView
        default:
          return LoadingView
      }
    },
  }
}
</script>

<style>
@import './styles/main.scss';
</style>
