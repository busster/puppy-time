const { Machine, interpret, assign } = require('xstate')
const moment = require('moment')
const firebase = require('firebase')
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

const database = firebase.firestore()

const DB = {
  Users: 'users',
  Activities: 'activities',
  Puppies: 'puppies'
}

const MY_USER_ID = 'kH76nKB6jOaQPY9FpTgoHLW7lXq1'

const collectionSnapshotListener = (db, doc, success, fail) => void database.collection(db).doc(doc).onSnapshot(success, fail)
const successCb = (exists, notExists) => doc => {
  if (doc.exists) exists(doc)
  else notExists(doc)
}
const failCb = error => void console.warn(error)

const userSuccessCb = successCb(doc => {
  const { puppies } = doc.data()
  puppies.forEach(puppy => {
    activitiesSnapshotRegistration(puppy)
    puppiesSnapshotRegistration(puppy)
  })
}, _ => {
  console.warn('User does not exist.')
})

const activitiesSuccessCb = successCb(doc => {
  console.log(doc.data())
}, _ => {
  console.warn('Has no activities.')
})

const puppiesSuccessCb = successCb(doc => {
  console.log(doc.data())
}, _ => {
  console.warn('Has no activities.')
})

const userSnapshotRegistration = (id) => collectionSnapshotListener(DB.Users, id, userSuccessCb, failCb)
const activitiesSnapshotRegistration = (id) => collectionSnapshotListener(DB.Activities, id, activitiesSuccessCb, failCb)
const puppiesSnapshotRegistration = (id) => collectionSnapshotListener(DB.Puppies, id, puppiesSuccessCb, failCb)

const ActivitiesEnum = {
  Poo: 'Poo',
  Pee: 'Pee',
  Potty: 'Potty',
  Play: 'Play',
  Eat: 'Eat',
  Drink: 'Drink',
  Meal: 'Meal',
  Nap: 'Nap',
  Crate: 'Crate'
}

function Activity (type) {
  this.type = type
  this.date = moment()
}

const setupUser = (context, event) => userSnapshotRegistration(context.user)

const createActivity = assign({
  activities: (context, event) => context.activities.concat(new Activity(event.activityType))
})

const logActivities = (context, event) => {
  const activitiesString = context.activities.reduce((acc, next) => {
    const activityString = `\n${next.type}: ${next.date.format('MMMM Do YYYY, h:mm:ss a')}`
    acc += activityString
    return acc
  }, '')
  console.log(activitiesString)
}

const app = Machine({
  // Machine identifier
  id: 'puppy-time',

  // Initial state
  initial: 'outside',

  // Local context for entire machine
  context: {
    user: MY_USER_ID,
    activities: []
  },

  // State definitions
  states: {
    outside: {
      on: {
        LOGIN: 'kennel'
      }
    },
    kennel: {
      entry: ['setupUser'],
      initial: 'bed',
      states: {
        bed: {},
        activities: {
          initial: 'display',
          states: {
            display: {
              entry: ['logActivities']
            }
          }
        },
        activityCreation: {
          initial: 'basic',
          states: {
            basic: {},
            advanced: {}
          },
          on: {
            MORE_DETAILS: '.advanced',
            CREATE_ACTIVITY: {
              target: 'activities',
              actions: ['createActivity']
            }
          }
        }
      },
      on: {
        ADD_ACTIVITY: {
          target: '.activityCreation',
          internal: false
        },
        VIEW_ACTIVITIES: {
          target: '.activities',
          internal: false
        }
      }
    }
  }
},
{
  actions: {
    createActivity,
    logActivities,
    setupUser
  }
})

const appService = interpret(app)

appService.onTransition(state => {
  // console.log(state.value)
  // console.log(state.context)
})

appService.start()

appService.send('LOGIN')


// CLI STUFFS
const handleInput = (line) => {
  const command = line.match(/[0-9]/)
  if (command && command.length === 0) return
  switch(command[0]) {
      case '1':
        appService.send('ADD_ACTIVITY')
        const type = line.match(/[a-zA-Z]+/)
        if (type && type.length === 0) return
        const activityType = ActivitiesEnum[type[0]]
        if (activityType !== undefined) {
          appService.send('CREATE_ACTIVITY', { activityType })
        } else {
          console.log('Invalid Activity')
          appService.send('VIEW_ACTIVITIES')
        }
        break;
      case '2':
        appService.send('VIEW_ACTIVITIES')
        break;
      default:
          console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
}

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(`
  Select what you want to do:
  1) Add Activity
  2) View Activities
`);
rl.prompt();

rl.on('line', function(line) {
    if (line) handleInput(line.trim())
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});
