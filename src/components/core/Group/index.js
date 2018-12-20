import { store } from '../../../store'
import { Message } from '../../../store/actions/Message'
import { arrayHasObject } from '../../../utils'

/**
 * Saves group by delegating to adapter
 * @param {Object} model Model of group
 * @param {String} prop Property key of model to identify group
 * @returns True when group was saved, false otherwise
 */
const saveGroup = (model, prop) => {
  const {adapter} = store.getState().persistence
  const {dispatch} = store

  if(!exists(model, prop)) {
    adapter.addGroup(model, prop)
    return true
  } else {
    dispatch(Message.set('The name already exists. Please choose an other name.'))
    return false
  }
}

/**
 * Updates group by delegating it to the adapter
 * @param {Object} model Model of group
 * @param {String} prop Changed property
 * @returns True when group was saved, false otherwise
 */
const updateGroup = (model, prop) => {
  const {adapter} = store.getState().persistence
  const {dispatch} = store
  const group = { ...model }
  group.name = prop

  if(!exists(group, 'name')) {
    adapter.updateGroup(model, prop)
    return true
  } else {
    dispatch(Message.set('The name already exists. Please choose an other name.'))
    return false
  }
}

/**
 * Checks if group exists in redux store.
 * @param {Object} model
 * @param {String} prop Property key of model to identify group
 * @returns True when group exists
 */
const exists = (model, prop) => {
  // Check if group already exists
  const groups = store.getState().persistence.groups
  const object = arrayHasObject(groups, prop, model[prop])

  console.log(model, prop, groups, object)

  return object !== null
}

export { saveGroup, updateGroup }
