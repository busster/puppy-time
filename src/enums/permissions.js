export const Permissions = {
  Own: 'Own',
  Interact: 'Interact',
  View: 'View',
  Locked: 'Locked'
}

export const knock = (permission) => {
  switch (permission) {
    case Permissions.Own:
      return Permissions.Interact
    case Permissions.Interact:
      return Permissions.View
    case Permissions.View:
      return Permissions.Locked
    case Permissions.Locked:
      return undefined
    default:
      return undefined
  }
}
