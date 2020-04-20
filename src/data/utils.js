import firebase from 'firebase'

export const arrayUnion = firebase.firestore.FieldValue.arrayUnion
export const arrayRemove = firebase.firestore.FieldValue.arrayRemove

export const resolveDocDataAsync = promise => new Promise((resolve, reject) => {
  promise.then(doc => {
    if (doc.exists) {
      resolve(doc.data())
    } else {
      reject('Doc does not exist')
    }
  }, error => {
    reject(error)
  })
})

export const resolveDocData = doc => {
  if (doc.exists) {
    return doc.data()
  } else {
    throw 'Doc does not exist'
  }
}

export const resolveSnapshotDocsData = snapshot => snapshot.docs.map(doc => doc.data())
