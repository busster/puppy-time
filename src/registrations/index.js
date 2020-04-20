import { registerGlobalComponents } from './components'
import { registerGlobalFilters } from './filters'

export const register = () => {
  registerGlobalComponents()
  registerGlobalFilters()
}
