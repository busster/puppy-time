import moment from 'moment'

export default class Pet {
  constructor ({ birthday, breed, name, sex, type, parents, timeline, activity }) {
    this.birthday = moment(birthday && birthday.toDate())
    this.breed = breed
    this.name = name
    this.parents = parents
    this.sex = sex
    this.type = type
    this.timeline = timeline,
    this.activity = activity
  }
}
