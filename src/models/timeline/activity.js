import moment from 'moment'

export default class Activity {
  constructor ({ type, startDate, endDate }) {
    this.type = type
    this.startDate = moment(startDate && startDate.toDate())
    this.endDate = (endDate === null || endDate === undefined) ? null : moment(endDate.toDate())
  }
}