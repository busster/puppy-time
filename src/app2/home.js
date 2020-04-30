/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { map } from 'rxjs/operators'

import { Permissions, knock } from '@/enums/permissions'

import { resolveDocData } from '@/data/utils'
import { homeObservableFromRefFactory } from '@/data/home'
import { Entities } from '@/enums/entities'

const typeMapper = base => myType => {
  if (base === Entities.Family) {
    switch(myType) {
      case 'Pet':
        return Entities.FamilyPet
      case 'Human':
        return Entities.Family
    }
  } else if (base === Family.Friend) {
    switch(myType) {
      case 'Pet':
        return Entities.FriendPet
      case 'Human':
        return Entities.Friend
    }
  }
}

const observeHome = assign({
  observer: (context, event) => {
    const observable = homeObservableFromRefFactory(context.ref)
      .pipe(map(home => ({ type: 'HOME.UPDATE', home: resolveDocData(home) })))
    return spawn(observable, 'home-observer')
  }
})
const updateHome = assign({
  home: (context, event) => event.home
})
const loadAssociations = sendParent(context => {
  const { permissions } = context
  const familyTypeMapper = typeMapper(Entities.Family)
  const friendTypeMapper = typeMapper(Entities.Friend)
  const associations = [
    context.home.family.map(({ type, reference }) => ({ permissions, ref: reference, type: familyTypeMapper(type) })),
    context.home.friends.map(({ type, reference }) => ({ permissions, ref: reference, type: friendTypeMapper(type) }))
  ].flat()
  return { type: 'SPAWN_MANY', associations }
})
const activateAssociations = context => {
  debugger
  [...context.home.family, ...context.home.friends]
    .forEach(home => home.send('ACTIVATE_BASIC'))
}

export const createHomeMachine = ({
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
    home: null
  },
  states: {
    information: {
      initial: 'reference',
      states: {
        reference: {
          on: {
            ACTIVATE_BASIC: {
              target: 'basic',
              actions: ['observeHome']
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
    'HOME.UPDATE': {
      actions: ['updateHome', 'loadAssociations']
    },
    'MACHINES_READY': {}
  }
},
{
  actions: {
    observeHome,
    updateHome,
    loadAssociations,
    activateAssociations
  },
  services: {}
})

