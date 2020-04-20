const { documentMethodsGenerator } = require('../../data')

const Home = require('../../models/home')

const converter = {
  toFirestore: (home) => {
    return {
      family: home.family,
      friends: home.friends,
      name: home.name
    }
  },
  fromFirestore: (snapshot, options) => new Home(snapshot.data(options))
}

const {
  collection,
  refFromIdFactory,
  observableFromDocumentIdFactory,
  observableFromRefFactory
} = documentMethodsGenerator('homes', converter)

module.exports = {
  homeCollection: collection,
  homeRefFromIdFactory: refFromIdFactory,
  homeObservableFromDocumentIdFactory: observableFromDocumentIdFactory,
  homeObservableFromRefFactory: observableFromRefFactory
}
