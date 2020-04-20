import firebase from 'firebase'
import moment from 'moment'
import Timeline from '../../models/timeline'
import Event from '../../models/timeline/event'
import Activity from '@/models/timeline/activity'

import { setCurrentActivity } from '../pet'

const { documentMethodsGenerator } = require('../../data')
const { Observable } = require('rxjs')
// const moment = require('moment')

const converter = {
  toFirestore: (event) => {
    console.log('asdfasdfasdf')
    console.log(event)
    return {
      // birthday: timeline.birthday.toDate(),
      // breed: timeline.breed,
      // name: timeline.name,
      // sex: timeline.sex,
      // type: timeline.type,
      // parents: timeline.parents
    }
  },
  fromFirestore: (snapshot, options) => {
    const { activities, events } = snapshot.data(options)
    return new Timeline({
      events: events.map(event => new Event(event)),
      activities: activities.map(activity => new Activity(activity))
    })
  }
}

const {
  collection,
  refFromIdFactory,
  observableFromDocumentIdFactory,
  observableFromRefFactory
} = documentMethodsGenerator('timelines', converter)

export const timelineCollection = collection
export const timelineRefFromIdFactory = refFromIdFactory
export const timelineObservableFromDocumentIdFactory = observableFromDocumentIdFactory
export const timelineObservableFromRefFactory = observableFromRefFactory

const eventsConverter = {
  toFirestore: ({ type, date }) => ({
    type,
    date: firebase.firestore.Timestamp.fromDate(date.toDate())
  }),
  fromFirestore: (snapshot, options) => new Event(snapshot.data(options))
}
const activitiesConverter = {
  toFirestore: ({ type, startDate, endDate }) => ({
    type,
    startDate: firebase.firestore.Timestamp.fromDate(startDate.toDate()),
    endDate: endDate ? firebase.firestore.Timestamp.fromDate(endDate.toDate()) : null
  }),
  fromFirestore: (snapshot, options) => new Activity(snapshot.data(options))
}

export const addEvent = (timelineRef, event) => {
  timelineRef.collection('events').withConverter(eventsConverter).add(event)
}

export const completeActivity = (petRef, timelineRef, activityId, activity) => {
  timelineRef
    .collection('activities')
    .withConverter(activitiesConverter)
    .doc(activityId)
    .set(activity)
  setCurrentActivity(petRef, '')
}

export const addActivity = (petRef, timelineRef, activity) => {
  const doc = timelineRef
    .collection('activities')
    .withConverter(activitiesConverter)
    .doc()
    // .add(activity)
    // .then((activityRef) => {
    //   setCurrentActivity(petRef, activityRef)
    // })
    doc.set(activity)
    setCurrentActivity(petRef, doc.id)
}

const compareDate = daysPrior => moment().subtract(daysPrior, 'days').endOf('day').toDate()
export const eventsObservableFromRefFactory = (timelineRef, daysPrior = 1) => {
  const eventsSnapshot = subscriber =>
    timelineRef.collection('events')
      .withConverter(eventsConverter)
      .where('date', '>', compareDate(daysPrior))
      .where('date', '<', compareDate(daysPrior - 1))
      .onSnapshot(subscriber)

  return new Observable(eventsSnapshot)
}

export const activitesObservableFromRefFactory = (timelineRef, daysPrior = 1) => {
  const activitiesSnapshot = subscriber =>
    timelineRef.collection('activities')
      .withConverter(activitiesConverter)
      .where('startDate', '>', compareDate(daysPrior))
      .where('startDate', '<', compareDate(daysPrior - 1))
      .onSnapshot(subscriber)

  return new Observable(activitiesSnapshot)
}

export const currentActivityObservableFromIdFactory = (timelineRef, id) => {
  const currentActivitySnapshot = subscriber =>
    timelineRef.collection('activities')
      .withConverter(activitiesConverter)
      .doc(id)
      .onSnapshot(subscriber)

  return new Observable(currentActivitySnapshot)
}
