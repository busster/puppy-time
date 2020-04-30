/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { Observable, forkJoin, from, of } from 'rxjs'
import { map, first, mergeMap, mergeAll, concatMap, zip, switchMap, combineLatest, concatAll, scan } from 'rxjs/operators'
import _zip from 'lodash/zip'

import { resolveDocData } from '@/data/utils'
import { petObservableFromRefFactory } from '@/data/pet'

import { createTimelineMachine } from './timeline'

import { Entities } from '@/enums/entities'

const observePet = assign({
  observer: ({ ref }, event) => {
    const observable = petObservableFromRefFactory(ref)
      .pipe(
        mergeMap(pet => {
          const petObj = resolveDocData(pet)
          return forkJoin(
            of(petObj),
            of(petObj.parents),
            petObj.parents.length > 0 ? forkJoin(...petObj.parents.map(pet => pet.get())) : of([])
          )
        }),
        map(([pet, petsRefs, parents]) => {
          pet.parents = _zip(petsRefs, parents).map(p => ({ ref: p[0], value: resolveDocData(p[1]) }))
          return {
            type: 'PET.UPDATE',
            pet
          }
        })
      )
    return spawn(observable, 'pet-observer')
  }
})

const updatePet = assign({
  pet: (context, event) => event.pet
})

export const createPetMachine = ({
  ref
}) => Machine({
  initial: 'loading',
  context: {
    ref,
    observer: null,
    pet: null
  },
  entry: ['observePet'],
  states: {
    loading: {
      on: {
        'PET.UPDATE': {
          actions: ['updatePet'],
          target: 'timeline'
        }
      }
    },
    timeline: {
      invoke: {
        id: 'pet-timeline',
        src: ({ pet }) => createTimelineMachine({ timeline: pet.timeline })
      }
    },
    exit: {
      type: 'final',
      data: {
        fromEntity: ({ ref }) => ref,
        fromTarget: () => Entities.Pet,
        toEntity: (context, { ref }) => ref,
        toTarget: (context, { target }) => target
      }
    }
  },
  on: {
    'PET.UPDATE': {
      actions: ['updatePet']
    },
    SELECT_HOME: {
      actions: send((context, { ref }) => ({ type: 'DONE', target: Entities.Home, ref }))
    },
    SELECT_PET: {
      actions: send((context, { ref }) => ({ type: 'DONE', target: Entities.Pet, ref }))
    },
    BACK: {
      actions: send((context, { ref, target }) => ({ type: 'DONE', ref, target }))
    },
    DONE: {
      target: 'exit'
    }
  }
},
{
  actions: {
    observePet,
    updatePet
  },
  services: {}
})
