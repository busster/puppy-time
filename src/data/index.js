const firebase = require('firebase')
const { Observable } = require('rxjs')

firebase.initializeApp({
  apiKey: "AIzaSyAlW0Jc8BsdoT3OsmSM2Di-N_HmHuD7Y40",
  authDomain: "puppy-time.firebaseapp.com",
  databaseURL: "https://puppy-time.firebaseio.com",
  projectId: "puppy-time",
  storageBucket: "puppy-time.appspot.com",
  messagingSenderId: "130342197677",
  appId: "1:130342197677:web:5e6dd052f81f1a7d91e924",
  measurementId: "G-ZYSN0J87FG"
})

export const database = firebase.firestore()

export const documentMethodsGenerator = (document, converter) => {
  const collection = database.collection(document)
  const refFromIdFactory = id => collection.doc(id).withConverter(converter)
  const observableFromDocumentIdFactory = id => new Observable(subscriber => refFromIdFactory(id).onSnapshot(subscriber))
  const observableFromRefFactory = ref => new Observable(subscriber => ref.withConverter(converter).onSnapshot(subscriber))
  return {
    collection,
    refFromIdFactory,
    observableFromDocumentIdFactory,
    observableFromRefFactory
  }
}
