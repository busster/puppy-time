/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, actions } from 'xstate'

import { humanRefFromIdFactory } from '@/data/human'

import { createHumanMachine } from './human'
import { createHomeMachine } from './home'
import { createPetMachine } from './pet'

import { Entities } from '@/enums/entities'

const isHomeType = (context, event) => context.toTarget === Entities.Home
const isPetType = (context, event) => context.toTarget === Entities.Pet
const isHumanType = (context, event) => context.toTarget === Entities.Human

const recordEntityTraffic = assign({
  toTarget: (context, event) => event.data.toTarget,
  fromTarget: (context, event) => event.data.fromTarget,
  entityContexts: ({ entityContexts }, event) => ({
    ...entityContexts,
    [event.data.toTarget]: event.data.toEntity,
    [event.data.fromTarget]: event.data.fromEntity
  })
})
// const unsetHomeRef = assign({

// })

const app = Machine({
  id: 'puppy-time-app',
  context: {
    entityContexts: {
      [Entities.Human]: null,
      [Entities.Home]: null,
      [Entities.Pet]: null
    },
    toTarget: null,
    fromTarget: null
  },
  initial: 'ether',
  states: {
    ether: {
      on: {
        MATERIALIZE:{
          target:  'world',
          actions: assign({
            entityContexts: ({ entityContexts }, { humanId }) => ({
              ...entityContexts,
              [Entities.Human]: humanRefFromIdFactory(humanId)
            })
          })
        },
      }
    },
    world: {
      initial: 'human',
      states: {
        human: {
          invoke: {
            id: 'human-service',
            src: ({ entityContexts }) => createHumanMachine({ ref: entityContexts[Entities.Human] }),
            onDone: {
              target: 'entityResolver',
              actions: ['recordEntityTraffic']
            }
          }
        },
        home: {
          invoke: {
            id: 'home-service',
            src: ({ entityContexts }) => createHomeMachine({ ref: entityContexts[Entities.Home] }),
            onDone: {
              target: 'entityResolver',
              actions: ['recordEntityTraffic']
            }
          }
        },
        pet: {
          invoke: {
            id: 'pet-service',
            src: ({ entityContexts }) => createPetMachine({ ref: entityContexts[Entities.Pet] }),
            onDone: {
              target: 'entityResolver',
              actions: ['recordEntityTraffic']
            }
          }
        },
        entityResolver: {
          on: {
            '': [
              { target: 'home', cond: 'isHomeType' },
              { target: 'pet', cond: 'isPetType' },
              { target: 'human', cond: 'isHumanType' }
            ]
          }
        }
      }
    }
  }
},
{
  actions: {
    recordEntityTraffic
  },
  services: {
  },
  guards: {
    isHomeType,
    isPetType,
    isHumanType
  }
})

export const appService = interpret(app)