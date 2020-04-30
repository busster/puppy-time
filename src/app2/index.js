/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, actions } from 'xstate'
const { respond } = actions
import { map } from 'rxjs/operators'
import { nanoid } from 'nanoid'
import _differenceWith from 'lodash/differenceWith'
import _without from 'lodash/intersectionWith'

import { Permissions } from '@/enums/permissions'

import { Entities } from '@/enums/entities'

import { resolveDocData } from '@/data/utils'
import { createHumanMachine } from './human2'
import { humanRefFromIdFactory } from '@/data/human'
import { createPetMachine } from './pet'
import { createHomeMachine } from './home'

const setupWorldService = async (context, event) => humanRefFromIdFactory(event.humanId)
const setWorldParameters = assign({
  entities: (context, event) => {
    const ref = event.data
    return context.entities.concat(
      spawn(createHumanMachine({ ref, permissions: Permissions.Own, type: Entities.Me }), ref.id)
    )
  }
})
const setInitialEntity = assign({
  activeEntity: (context, event) => {
    const ref = event.data
    return context.entities.find(entity => entity.id === ref.id)
  }
})

const spawnManyMachines = assign({
  entities: (context, event) => {
    const { entities } = context
    const { associations } = event
    return entities.concat(
      _differenceWith(associations, entities, (assoc, ent) => assoc.ref.id === ent.id)
        .map(({ type, ref, permissions }) => {
          let machineType = null
          switch (type) {
            case Entities.Me:
            case Entities.Family:
            case Entities.Friend:
              machineType = createHumanMachine
              break
            case Entities.MyPet:
            case Entities.FamilyPet:
            case Entities.FriendPet:
              machineType = createPetMachine
              break
            case Entities.Home:
            case Entities.Hangout:
              machineType = createHomeMachine
              break
          }
          return spawn(machineType({ ref, permissions, type }), ref.id)
        })
    )
  }
})

const sendMachinesBack = respond((context, event) => {
  const entityIds = context.entities.map(entity => entity.id)
  const associationIds = event.associations.map(assoc => assoc.ref.id)
  const machines = _without(entityIds, associationIds).map(entityId => context.entities.find(ent => ent.id === entityId))
  return ({ type: 'MACHINES_READY', machines })
})

const activateNewEntity = send('ACTIVATE_FULL', { to: (context, { entityId }) => entityId })
const deactivateCurrentEntity = send('DEACTIVATE', { to: context => context.activeEntity })
const setNewActiveEntity = assign({
  activeEntity: ({ entities }, { entityId }) => entities.find(entity => entity.id === entityId)
})

const app = Machine({
  id: 'puppy-time-app',
  context: {
    activeEntity: null,
    entities: [],
  },
  initial: 'ether',
  states: {
    ether: {
      on: {
        MATERIALIZE: 'pixelating'
      }
    },
    pixelating: {
      invoke: {
        src: 'setupWorldService',
        onError: 'nether',
        onDone: {
          target: 'spawningUser',
          actions: ['setWorldParameters', 'setInitialEntity']
        }
      }
    },
    spawningUser: {
      entry: context => context.activeEntity.send('ACTIVATE_BASIC'),
      on: {
        MACHINES_LOADED: {
          target: 'world',
          actions: context => context.activeEntity.send('ACTIVATE_FULL')
        },
        SPAWN_MANY: {
          actions: ['spawnManyMachines', 'sendMachinesBack']
        }
      }
    },
    nether: {},
    world: {
      // context => context.activeEntity.send('ACTIVATE_BASIC'),
      on: {
        SPAWN_MANY: {
          actions: ['spawnManyMachines', 'sendMachinesBack']
        },
        ACTIVATE_NEW_ENTITY: {
          actions: ['activateNewEntity', 'deactivateCurrentEntity', 'setNewActiveEntity']
        }
      }
    }
  }
},
{
  actions: {
    setWorldParameters,
    setInitialEntity,
    spawnManyMachines,
    sendMachinesBack,
    activateNewEntity,
    deactivateCurrentEntity,
    setNewActiveEntity
  },
  services: {
    setupWorldService
  }
})

export const appService = interpret(app)
