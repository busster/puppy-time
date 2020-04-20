import Vue from 'vue'
import { filters } from '../filters'

export const registerGlobalFilters = () => {
  filters.forEach(filter => Vue.filter(filter.name, filter.func))
}
