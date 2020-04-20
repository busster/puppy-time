import { Machine, interpret, assign, spawn, send } from 'xstate'
import { map } from 'rxjs/operators'
import { nanoid } from 'nanoid'

// const { humanMachine } = require('./human')
const { resolveDocData } = require('../data/utils')
const { humanRefFromIdFactory, humanObservableFromRefFactory } = require('../data/human')
const { createPetMachine } = require('./pet')
const { createHomeMachine } = require('./home')

// ACTIONS
const birthHuman = assign({
  human: (context, { humanId }) => ({
    ref: humanRefFromIdFactory(humanId)
  })
})
const initializeDrone = assign({
  bigBrother: (context) => {
    const observable = humanObservableFromRefFactory(context.human.ref)
      .pipe(map(human => ({ type: 'HUMAN.UPDATE', human: resolveDocData(human) })))
    return spawn(observable, 'human-observer')
  }
})
const updateHuman = assign({
  human: (context, { human }) => ({
    ...context.human,
    ...human,
    homes: human.homes.map(home => {
      const id = nanoid()
      return { ref: spawn(createHomeMachine(home), id), id }
    }),
    pets: human.pets.map(pet => {
      const id = nanoid()
      return { ref: spawn(createPetMachine(pet), id), id }
    })
  })
})
const setHomeAt = assign({
  homeAt: (context, event) => event.home
})
const setPetWith = assign({
  petWith: (context, event) => event.pet
})
const createPetEvent = send((context, { eventType }) => eventType, { to: ({ petWith }) => petWith.ref })
const createPetActivity = send((context, { activityType }) => activityType, { to: ({ petWith }) => petWith.ref })
const completeActivityForPet = send('COMPLETE_ACTIVITY', { to: ({ petWith }) => petWith.ref })
const fetchTimeline = send('VIEW_TIMELINE', { to: ({ petWith }) => petWith.ref })
const leaveHome = assign({
  homeAt: () => null
})

const app = Machine({
  id: 'app',
  initial: 'ether',
  context: {
    human: null,
    bigBrother: null,
    homeAt: null,
    petWith: null,
    friendWith: null
  },
  states: {
    ether: {
      on: {
        MATERIALIZE: 'world' // LOGIN
      }
    },
    world: {
      initial: 'onTheLam',
      entry: ['birthHuman', 'initializeDrone'],
      states: {
        onTheLam: {
          on: {
            GO_HOME: {
              target: 'home',
              actions: ['setHomeAt']
            },
            CHECK_ON_PET: {
              target: 'petCam',
              actions: ['setPetWith', 'fetchTimeline']
            }
          }
        },
        home: {
          on: {
            CHECK_ON_PET: {
              target: 'kennel',
              actions: ['setPetWith', 'fetchTimeline']
            },
            BACK_ON_THE_LAM: {
              target: 'onTheLam',
              actions: ['leaveHome']
            }
          }
        },
        petCam: {
          on: {
            BACK_ON_THE_LAM: 'onTheLam'
          }
        },
        kennel: {
          on: {
            CREATE_MOMENT: 'momentCreation',
            BACK_HOME: 'home',
            COMPLETE_ACTIVITY: {
              actions: ['completeActivityForPet']
            }
          }
        },
        momentCreation: {
          initial: 'basic',
          states: {
            basic: {},
            advanced: {}
          },
          on:{
            CREATE_EVENT: {
              target: 'kennel',
              actions: ['createPetEvent']
            },
            CREATE_ACTIVITY: {
              target: 'kennel',
              actions: ['createPetActivity']
            },
            CANCEL: 'kennel'
          }
        }
      },
      on: {
        'HUMAN.UPDATE': {
          actions: ['updateHuman']
        }
      }
    }
  }
},
{
  actions: {
    birthHuman,
    initializeDrone,
    updateHuman,
    setHomeAt,
    setPetWith,
    leaveHome,
    fetchTimeline,
    createPetEvent,
    createPetActivity,
    completeActivityForPet,
    log: (context) => void console.log(context)
  },
  services: {
    // humanMachine
  }
})

export const appService = interpret(app)

// appService.start()

// appService.send('MATERIALIZE', { humanId: 'kH76nKB6jOaQPY9FpTgoHLW7lXq1' })

// setTimeout(function () {
//   // console.log(appService.state.context.human.pets.map(petMachine => petMachine.ref.state.context.pet.name))
//   // appService.children.get('the-human').send('LOOK_AT_PETS')
// }, 1000)
