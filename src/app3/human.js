/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { Observable, forkJoin, from, of } from 'rxjs'
import { map, first, mergeMap, mergeAll, concatMap, zip, switchMap, combineLatest, concatAll, scan } from 'rxjs/operators'
import _zip from 'lodash/zip'

import { resolveDocData } from '@/data/utils'
import { humanObservableFromRefFactory } from '@/data/human'

import { Entities } from '@/enums/entities'

const observeHuman = assign({
  observer: ({ ref }, event) => {
    const observable = humanObservableFromRefFactory(ref)
      .pipe(
        mergeMap(human => {
          const humanObj = resolveDocData(human)
          return forkJoin(
            of(humanObj),
            of(humanObj.pets),
            humanObj.pets.length > 0 ? forkJoin(...humanObj.pets.map(pet => pet.get())) : of([]),
            of(humanObj.homes),
            humanObj.homes.length > 0 ? forkJoin(...humanObj.homes.map(home => home.get())) : of([]),
          )
        }),
        map(([human, petsRefs, pets, homesRefs, homes]) => {
          human.pets = _zip(petsRefs, pets).map(p => ({ ref: p[0], value: resolveDocData(p[1]) }))
          human.homes = _zip(homesRefs, homes).map(p => ({ ref: p[0], value: resolveDocData(p[1]) }))
          return {
            type: 'HUMAN.UPDATE',
            human
          }
        })
      )
    return spawn(observable, 'human-observer')
  }
})

const updateHuman = assign({
  human: (context, event) => event.human
})

export const createHumanMachine = ({
  ref
}) => Machine({
  initial: 'loading',
  context: {
    ref,
    observer: null,
    human: null
  },
  entry: ['observeHuman'],
  states: {
    loading: {
      on: {
        'HUMAN.UPDATE': {
          actions: ['updateHuman'],
          target: 'idle'
        }
      }
    },
    idle: {},
    exit: {
      type: 'final',
      data: {
        fromEntity: ({ ref }) => ref,
        fromTarget: () => Entities.Human,
        toEntity: (context, { ref }) => ref,
        toTarget: (context, { target }) => target
      }
    }
  },
  on: {
    'HUMAN.UPDATE': {
      actions: ['updateHuman']
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
    observeHuman,
    updateHuman
  },
  services: {}
})
