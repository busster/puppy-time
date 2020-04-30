/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { map } from 'rxjs/operators'

import { resolveDocData } from '@/data/utils'
import { humanObservableFromRefFactory } from '@/data/human'

const updateTransitions = (config = {}) => ({
  'HUMAN.UPDATE': {
    actions: ['updateHuman'],
    ...config
  }
})
const observeHuman = assign({
  observer: (context, event) => {
    const observable = humanObservableFromRefFactory(context.ref)
      .pipe(map(human => ({ type: 'HUMAN.UPDATE', human: resolveDocData(human) })))
    return spawn(observable, 'human-observer')
  }
})
const updateHuman = assign({
  human: (context, event) => event.human
})
const loadAssociations = context => {
  [...context.human.homes, ...context.human.hangouts, ...context.human.pets].forEach(entity => {
    sendParent({ type: 'SPAWN_ENTITIY', entity })
  })
}

const userLoaded = context => context.humnan !== undefined

export const createHumanMachine = ({
  ref,
  permissions,
  initial,
  human
}) => Machine({
  initial: 'loading',
  context: {
    type: 'human',
    ref,
    permissions,
    observer: null,
    human
  },
  entry: ['observeHuman'],
  states: {
    loading: {
      on: {
        ...updateTransitions({ target: 'basic' }),

      }
    },
    basic: {
      on: {
        LOAD_ASSOCIATIONS: {
          target: 'loading',
        }
      }
    },
    full: {}
  },
  on: {
    ...updateTransitions()
  }
},
{
  actions: {
    observeHuman,
    updateHuman,
    loadAssociations
  },
  services: {}
})
