/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { map } from 'rxjs/operators'
import _groupBy from 'lodash/groupBy'

import { Permissions, knock } from '@/enums/permissions'

import { resolveDocData } from '@/data/utils'
import { humanObservableFromRefFactory } from '@/data/human'
import { Entities } from '@/enums/entities'

const petTypeMapper = (myType) => {
  switch(myType) {
    case Entities.Me:
      return Entities.MyPet
    case Entities.Family:
      return Entities.FamilyPet
    case Entities.Friend:
      return Entities.FriendPet
  }
}

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
const loadAssociations = sendParent(context => {
  const { permissions, type } = context
  const associations = [
    context.human.homes.map(ref => ({ permissions, ref, type: Entities.Home })),
    context.human.pets.map(ref => ({ permissions, ref, type: petTypeMapper(type) })),
    context.human.hangouts.map(ref => ({ permissions: knock(permissions), ref, type: Entities.Hangout }))
  ].flat()
  return { type: 'SPAWN_MANY', associations }
})
const setMachines = assign({
  human: ({ human }, event) => {
    const groups = _groupBy(event.machines, machine => machine.state.context.type)
    human.pets = [
     groups[Entities.MyPet],
     groups[Entities.FamilyPet],
     groups[Entities.FriendPet]
    ].filter(pet => pet !== undefined).flat()
    human.homes = groups[Entities.Home] || []
    human.hangouts = groups[Entities.Hangout] || []
    return human
  }
})
const machinesLoaded = sendParent({ type: 'MACHINES_LOADED' })
const activateAssociations = context => {
  debugger
  [...context.human.homes, ...context.human.hangouts, ...context.human.pets]
    .forEach(item => item.send('ACTIVATE_BASIC'))
}

export const createHumanMachine = ({
  ref,
  permissions,
  type
}) => Machine({
  type: 'parallel',
  context: {
    type,
    ref,
    permissions,
    observer: null,
    human: null
  },
  states: {
    information: {
      initial: 'reference',
      states: {
        reference: {
          on: {
            ACTIVATE_BASIC: {
              target: 'basic',
              actions: ['observeHuman']
            }
          }
        },
        basic: {
          on: {
            ACTIVATE_FULL: {
              target: 'full',
              actions: ['activateAssociations']
            }
          }
        },
        full: {}
      }
    },
    view: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            ACTIVATE_FULL: {
              target: 'associations'
            }
          }
        },
        details: {},
        associations: {}
      }
    }
  },
  on: {
    'HUMAN.UPDATE': {
      actions: ['updateHuman', 'loadAssociations']
    },
    'MACHINES_READY': {
      actions: ['setMachines', 'machinesLoaded']
    }
  }
},
{
  actions: {
    observeHuman,
    updateHuman,
    loadAssociations,
    setMachines,
    machinesLoaded,
    activateAssociations
  },
  services: {}
})

