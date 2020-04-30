/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { Observable, forkJoin, from, of } from 'rxjs'
import { map, first, mergeMap, mergeAll, concatMap, zip, switchMap, combineLatest, concatAll, scan } from 'rxjs/operators'
import _zip from 'lodash/zip'

import { resolveDocData } from '@/data/utils'
import { homeObservableFromRefFactory } from '@/data/home'

import { Entities } from '@/enums/entities'

const observeHome = assign({
  observer: ({ ref }, event) => {
    const observable = homeObservableFromRefFactory(ref)
      .pipe(
        mergeMap(home => {
          const homeObj = resolveDocData(home)
          return forkJoin(
            of(homeObj),
            of(homeObj.family),
            homeObj.family.length > 0 ? forkJoin(...homeObj.family.map(f => f.reference.get())) : of([]),
            of(homeObj.friends),
            homeObj.friends.length > 0 ? forkJoin(...homeObj.friends.map(friend => friend.reference.get())) : of([]),
          )
        }),
        map(([home, familyRefs, family, friendsRefs, friends]) => {

          home.family = _zip(familyRefs, family)
            .map(p => ({
              ref: p[0].reference,
              type: p[0].type,
              value: resolveDocData(p[1])
            }))
          home.friends = _zip(friendsRefs, friends)
            .map(p => ({
              ref: p[0].reference,
              type: p[0].type,
              value: resolveDocData(p[1])
            }))
          return {
            type: 'HOME.UPDATE',
            home
          }
        })
      )
    return spawn(observable, 'home-observer')
  }
})

const updateHome = assign({
  home: (context, event) => event.home
})

export const createHomeMachine = ({
  ref
}) => Machine({
  initial: 'loading',
  context: {
    ref,
    observer: null,
    home: null
  },
  entry: ['observeHome'],
  states: {
    loading: {
      on: {
        'HOME.UPDATE': {
          actions: ['updateHome'],
          target: 'idle'
        }
      }
    },
    idle: {},
    exit: {
      type: 'final',
      data: {
        fromEntity: ({ ref }) => ref,
        fromTarget: () => Entities.Home,
        toEntity: (context, { ref }) => ref,
        toTarget: (context, { target }) => target
      }
    }
  },
  on: {
    'HOME.UPDATE': {
      actions: ['updateHome']
    },
    SELECT_HUMAN: {
      actions: send((context, { ref }) => ({ type: 'DONE', target: Entities.Human, ref }))
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
    observeHome,
    updateHome
  },
  services: {}
})
