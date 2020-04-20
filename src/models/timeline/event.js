import moment from 'moment'

export default class Event {
  constructor ({ type, date }) {
    this.type = type
    this.date = moment(date && date.toDate())
  }
}