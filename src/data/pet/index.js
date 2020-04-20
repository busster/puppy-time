import firebase from 'firebase'
import Pet from '../../models/pet'
const { documentMethodsGenerator } = require('../../data')
// const moment = require('moment')


const converter = {
  toFirestore: (pet) => {
    // console.log(pet)
    return {
      birthday: firebase.firestore.Timestamp.fromDate(pet.birthday.toDate()),
      breed: pet.breed,
      name: pet.name,
      sex: pet.sex,
      type: pet.type,
      parents: pet.parents,
      activity: pet.activity
    }
  },
  fromFirestore: (snapshot, options) => new Pet(snapshot.data(options))
}

const {
  collection,
  refFromIdFactory,
  observableFromDocumentIdFactory,
  observableFromRefFactory
} = documentMethodsGenerator('pets', converter)

export const createPet = (userRef, pet) => {
  pet.parents = [userRef]
  const ref = collection.doc().withConverter(converter)
  ref.set(pet)
  return ref
}

export const setCurrentActivity = (petRef, activity) => {
  petRef.withConverter(converter).update({ activity })
}

export const petCollection = collection
export const petRefFromIdFactory = refFromIdFactory
export const petObservableFromDocumentIdFactory = observableFromDocumentIdFactory
export const petObservableFromRefFactory = observableFromRefFactory
