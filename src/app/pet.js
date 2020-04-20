import moment from 'moment'
import { Machine, assign, spawn } from 'xstate'
import { map } from 'rxjs/operators'

import { resolveDocData, resolveSnapshotDocsData } from '../data/utils'

import { petObservableFromRefFactory } from '../data/pet'
import { addEvent, addActivity, completeActivity } from '../data/timeline'
import { eventsObservableFromRefFactory, activitesObservableFromRefFactory, /* currentActivityObservableFromIdFactory */ } from '../data/timeline'

import Event from '@/models/timeline/event'
import Activity from '@/models/timeline/activity'

import { EventTypes, ActivityTypes } from '@/enums/moment'

// const { humanRefFromIdFactory, humanObservableFromRefFactory, addPet } = require('../data/human')
// const { createPet } = require('../data/pet')

// OBSERVERS
const observePet = assign({
  observer: (context) => {
    const observable = petObservableFromRefFactory(context.pet.ref)
      .pipe(map(pet => ({ type: 'PET.UPDATE', pet: resolveDocData(pet) })))
    return spawn(observable, 'pet-observer')
  }
})

// ACTIONS
const updatePet = assign({
  pet: (context, { pet }) => ({
    ...context.pet,
    ...pet,
  })
})
const fetchTimeline = assign({
  eventsObserver: (context) => {
    const observable = eventsObservableFromRefFactory(context.pet.timeline, context.startDateAgo)
      .pipe(map(events => ({ type: 'EVENTS.UPDATE', events: resolveSnapshotDocsData(events) })))
    return spawn(observable, 'events-observer')
  },
  activitiesObserver: (context) => {
    const observable = activitesObservableFromRefFactory(context.pet.timeline, context.startDateAgo)
      .pipe(map(activities => ({ type: 'ACTIVITIES.UPDATE', activities: resolveSnapshotDocsData(activities) })))
    return spawn(observable, 'activities-observer')
  }
})
// const fetchCurrentActivity = assign({
//   currentActivityObserver: (context) => {
//     if (!context.pet.activity) return
//     const observable = currentActivityObservableFromIdFactory(context.pet.timeline, context.pet.activity)
//       .pipe(map(activity => ({ type: 'CURRENT_ACTIVITY.UPDATE', activity: resolveDocData(activity) })))
//     return spawn(observable, 'current-activity-observer')
//   }
// })
const updateEvents = assign({
  events: (context, { events }) => {
    // console.log(events)
    return events
  }
})
const updateActivities = assign({
  activities: (context, { activities }) => {
    // console.log(activities)
    return activities
  }
})
const updateCurrentActivity = assign({
  pet: (context, { activity }) => {
    return {
      ...context.pet,
      timelineActivity: activity
    }
  }
})
const createEvent = (context, { type }) => {
  addEvent(context.pet.timeline, new Event({ type }))
}
const createActivity = (context, { type }) => {
  addActivity(context.pet.ref, context.pet.timeline, new Activity({ type }))
}
const completePetActivity = (context) => {
  context.pet.timelineActivity.endDate = moment()
  completeActivity(context.pet.ref, context.pet.timeline, context.pet.activity, context.pet.timelineActivity)
}

// MACHINE DEFS
const createEventTransitions = () => Object.values(EventTypes).reduce((acc, eventType) => {
  acc[eventType] = { actions: ['createEvent'] }
  return acc
}, {})
const createActivtyTransitions = () => Object.values(ActivityTypes).reduce((acc, activityType) => {
  acc[activityType] = { actions: ['createActivity'] }
  return acc
}, {})

export const createPetMachine = ref => Machine({
    initial: 'kennel',
    context: {
      pet: {
        ref
      },
      observer: null,
      startDateAgo: 1
    },
    states: {
      kennel: {
        entry: ['observePet']
      }
    },
    on: {
      ...createEventTransitions(),
      ...createActivtyTransitions(),
      COMPLETE_ACTIVITY: {
        actions: ['completePetActivity']
      },
      VIEW_TIMELINE: {
        actions: ['fetchTimeline']
      },
      'PET.UPDATE': {
        actions: ['updatePet']
      },
      'EVENTS.UPDATE': {
        actions: ['updateEvents']
      },
      'ACTIVITIES.UPDATE': {
        actions: ['updateActivities']
      },
      'CURRENT_ACTIVITY.UPDATE': {
        actions: ['updateCurrentActivity']
      }
    }
  },
  {
    actions: {
      observePet,
      updatePet,
      updateEvents,
      updateActivities,
      createEvent,
      createActivity,
      fetchTimeline,
      completePetActivity,
      updateCurrentActivity,
      // fetchCurrentActivity,
      log: (context) => console.log(context)
    }
  })
