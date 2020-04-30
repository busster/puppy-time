/* eslint-disable */ 
import { Machine, interpret, assign, spawn, send, sendParent } from 'xstate'
import { Observable, forkJoin, from, of, combineLatest } from 'rxjs'
import { map, first, mergeMap, mergeAll, concatMap, zip, switchMap, concatAll, scan } from 'rxjs/operators'
import _zip from 'lodash/zip'
import moment from 'moment'

import { resolveDocData, resolveSnapshotDocsData } from '@/data/utils'
import {
  eventsObservableFromRefFactory,
  activitesObservableFromRefFactory,
  addEvent,
  addActivity
} from '@/data/timeline'

import Event from '@/models/timeline/event'
import Activity from '@/models/timeline/activity'

import { Entities } from '@/enums/entities'

const fetchTimeline = assign({
  observer: ({ timeline, date }) => {
    const observable = combineLatest(
      eventsObservableFromRefFactory(timeline, date),
      activitesObservableFromRefFactory(timeline, date)
    )
      .pipe(
        map(
          ([events, activities]) => ({
            type: 'TIMELINE.UPDATE',
            events: resolveSnapshotDocsData(events),
            activities: resolveSnapshotDocsData(activities)
          })
        )
      )
    return spawn(observable, 'timeline-observer')
  }
})

const updateActivities = assign({ activities: (context, { activities }) => activities })
const updateEvents = assign({ events: (context, { events }) => events })
const updateTimeline = assign({
  events: (context, { events }) => events,
  activities: (context, { activities }) => activities
})

const createAndAddMoment = ({ timeline }, { events, activity }) => {
  events.forEach(type => addEvent(timeline, new Event({ type })))
  if (activity) addActivity(timeline, new Activity({ type: activity }))
}

const assignDate = assign({
  date: (context, event) => event.date
})

export const createTimelineMachine = ({
  timeline
}) => Machine({
  initial: 'showTimeline',
  context: {
    timeline,
    observer: null,
    activities: [],
    events: [],
    date: moment()
  },
  entry: ['fetchTimeline'],
  states: {
    loading: {
      states: {}
    },
    showTimeline: {
      on: {
        ADD_MOMENT: 'addMoment',
        CHANGE_DATE: {
          actions: ['assignDate', 'fetchTimeline']
        }
      }
    },
    addMoment: {
      on: {
        CANCEL: 'showTimeline',
        ADD: {
          target: 'showTimeline',
          actions: ['createAndAddMoment']
        }
      }
    }
  },
  on: {
    'TIMELINE.UPDATE': {
      actions: ['updateTimeline']
    }
  }
},
{
  actions: {
    fetchTimeline,
    updateTimeline,
    createAndAddMoment,
    assignDate
  },
  services: {}
})
