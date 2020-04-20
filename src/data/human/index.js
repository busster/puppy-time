const { documentMethodsGenerator } = require('../../data')
const { arrayUnion } = require('../utils')
const Human = require('../../models/human')

const converter = {
  toFirestore: (human) => {
    return {
      firstName: human.firstName,
      lastName: human.lastName,
      homes: human.homes,
      hangouts: human.hangouts,
      pets: human.pets,
    }
  },
  fromFirestore: (snapshot, options) => new Human(snapshot.data(options))
}

const {
  collection,
  refFromIdFactory,
  observableFromDocumentIdFactory,
  observableFromRefFactory
} = documentMethodsGenerator('humans', converter)

const addPet = (userRef, petRef) => {
  userRef.update({
    pets: arrayUnion(petRef)
  })
}

const createHuman = () => {
  // const ref = collection.doc().withConverter(converter)
  // ref.set(pet)
  // return ref
}

module.exports = {
  humanCollection: collection,
  humanRefFromIdFactory: refFromIdFactory,
  humanObservableFromDocumentIdFactory: observableFromDocumentIdFactory,
  humanObservableFromRefFactory: observableFromRefFactory,
  addPet,
  createHuman,
}
