export default {
  name: 'date',
  func: (value, format = 'MMMM Do YYYY, h:mm:ss a') => {
    return value.format(format)
  }
}