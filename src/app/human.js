const { Machine, interpret, assign, spawn } = require('xstate')
const { map } = require('rxjs/operators')

const { resolveDocData } = require('../data/utils')

const { humanObservableFromRefFactory } = require('../data/human')

// const { humanRefFromIdFactory, humanObservableFromRefFactory, addHuman } = require('../data/human')
// const { createHuman } = require('../data/human')

// OBSERVERS
const observeHuman = assign({
  observer: (context, event) => {
    const observable = humanObservableFromRefFactory(context.human.ref)
      .pipe(map(human => ({ type: 'HUMAN.UPDATE', human: resolveDocData(human) })))
    return spawn(observable, 'human-observer')
  }
})

// ACTIONS
const updateHuman = assign({
  human: (context, { human }) => ({ ...context.human, ...human })
})

const createHumanMachine = ref => Machine({
    initial: 'livingRoom',
    context: {
      human: {
        ref
      },
      observer: null
    },
    states: {
      livingRoom: {
        entry: ['observeHuman']
      }
    },
    on: {
      'HUMAN.UPDATE': {
        actions: ['updateHuman']
      }
    }
  },
  {
    actions: {
      observeHuman,
      updateHuman,
      log: (context) => console.log(context)
    }
  })

module.exports = {
  createHumanMachine
}
