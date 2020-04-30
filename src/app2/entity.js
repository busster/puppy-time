/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { map } from 'rxjs/operators'
import _groupBy from 'lodash/groupBy'

const createEntityMachine = ({
  ref,
  type
}) => Machine({
  type: 'parallel',
  context: {
    type,
    ref
  },
  states: {
    information: {
      initial: 'loading',
      states: {
        loading: {
          entry: ['observeEntity']
        },
        basic: {},
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
    'ENTITY.UPDATE': {
      actions: ['updateEntity']
    }
  }
},
{
  actions: {
    observeEntity
  },
  services: {}
})

export class EntityMachine {
  constructor () {}

  observeEntity = assign({
    observer: (context, event) => {
      const observable = humanObservableFromRefFactory(context.ref)
        .pipe(map(human => ({ type: 'HUMAN.UPDATE', human: resolveDocData(human) })))
      return spawn(observable, 'human-observer')
    }
  })
  updateEntity = assign({
    entity
  })

  createMachine (args) {
    return createEntityMachine(args)
  }
}
