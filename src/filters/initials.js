export default {
  name: 'initials',
  func: (value) => value.split(' ').map(n => n[0].toUpperCase()).join('')
}