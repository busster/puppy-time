import Vue from 'vue'
import Router from 'vue-router'

const LoginView  = () => import(/* webpackChunkName: "login" */ '../views/Login')
const LamView  = () => import(/* webpackChunkName: "lam" */ '../views/Lam')
const HomeView  = () => import(/* webpackChunkName: "lam" */ '../views/Home')
const KennelView  = () => import(/* webpackChunkName: "lam" */ '../views/Kennel')
const MomentView  = () => import(/* webpackChunkName: "lam" */ '../views/Moment')

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/lam',
    name: 'Lam',
    component: LamView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/pet-cam',
    name: 'PetCam',
    component: KennelView,
    props: { readonly: true }
  },
  {
    path: '/kennel',
    name: 'Kennel',
    component: KennelView
  },
  {
    path: '/moment',
    name: 'Moment',
    component: MomentView
  }
]

export const router = new Router({
  routes
})
