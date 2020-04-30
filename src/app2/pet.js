/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { map } from 'rxjs/operators'

import { Permissions, knock } from '@/enums/permissions'

import { resolveDocData } from '@/data/utils'
import { petObservableFromRefFactory } from '@/data/pet'
import { Entities } from '@/enums/entities'

const entityTypeMapper = (myType) => {
  switch(myType) {
    case Entities.MyPet:
    case Entities.FamilyPet:
      return Entities.Family
    case Entities.FriendPet:
      return Entities.Friend
  }
}

const observePet = assign({
  observer: (context, event) => {
    const observable = petObservableFromRefFactory(context.ref)
      .pipe(map(pet => ({ type: 'PET.UPDATE', pet: resolveDocData(pet) })))
    return spawn(observable, 'pet-observer')
  }
})
const updatePet = assign({
  pet: (context, event) => event.pet
})
const loadAssociations = sendParent(context => {
  const { permissions, type } = context
  const associations = [
    context.pet.parents.map(ref => ({ permissions, ref, type: entityTypeMapper(type) }))
  ].flat()
  return { type: 'SPAWN_MANY', associations }
})

export const createPetMachine = ({
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
    pet: null
  },
  states: {
    information: {
      initial: 'reference',
      states: {
        reference: {
          on: {
            ACTIVATE_BASIC: {
              target: 'basic',
              actions: ['observePet']
            }
          }
        },
        basic: {
          on: {
            ACTIVATE_FULL: {}
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
    'PET.UPDATE': {
      actions: ['updatePet', 'loadAssociations']
    },
    'MACHINES_READY': {}
  }
},
{
  actions: {
    observePet,
    updatePet,
    loadAssociations
  },
  services: {}
})

