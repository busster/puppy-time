import { Machine, assign, spawn } from 'xstate'
import { map } from 'rxjs/operators'
import { nanoid } from 'nanoid'

const { resolveDocData } = require('../data/utils')

const { homeObservableFromRefFactory } = require('../data/home')
const { createPetMachine } = require('./pet')

// const { humanRefFromIdFactory, humanObservableFromRefFactory, addHome } = require('../data/human')
// const { createHome } = require('../data/home')

// OBSERVERS
const observeHome = assign({
  observer: (context) => {
    const observable = homeObservableFromRefFactory(context.home.ref)
      .pipe(map(home => ({ type: 'HOME.UPDATE', home: resolveDocData(home) })))
    return spawn(observable, 'home-observer')
  }
})

// ACTIONS
const updateHome = assign({
  home: (context, { home }) => ({
    ...context.home,
    ...home,
    family: home.family.map(familyMember => {
      const id = nanoid()
      switch(familyMember.type) {
        case 'Pet':
          return { ref: spawn(createPetMachine(familyMember.reference), id), id, type: familyMember.type }
        case 'Human':
          return familyMember
      }
    })
  })
})

export const createHomeMachine = ref => Machine({
    initial: 'livingRoom',
    context: {
      home: {
        ref
      },
      observer: null
    },
    states: {
      livingRoom: {
        entry: ['observeHome']
      }
    },
    on: {
      'HOME.UPDATE': {
        actions: ['updateHome']
      }
    }
  },
  {
    actions: {
      observeHome,
      updateHome,
      log: (context) => console.log(context)
    }
  })
