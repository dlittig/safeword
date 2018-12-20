import { store } from '../../../store'
import { Setup } from '../../../store/actions/Setup'
import { Persistence } from '../../../store/actions/Persistence'
import PasswordModel from '../../../model/Password'
import Group from '../../../model/Group'
import { arrayHasObject, nameToFileName } from '../../../utils'
import fs from '../../../modules/filesystem'
import globals from '../../../globals'
import SettingsParameters from '../../../settings/params'
import { Message } from '../../../store/actions/Message'
import Clipboard from '../../../modules/clipboard'
import Notification from '../../../modules/notification'

/**
 * Processes password and delegates the saving process to the adapter.
 * Before saving the password there has to be no collision and the password
 * properties have to be valid.
 * @param {Object} model New Password instance with changes
 * @param {Object} oldModel Old Password if there is any
 * @param {String} type 'edit' or 'new'
 * @param {Function} successCallback Function that will be called in case of a success
 * @returns False on error
 */
const savePassword = async (model, oldModel, type, successCallback) => {
  const dispatch = store.dispatch
  const persistence = store.getState().persistence

  let group = ''
  if(model.group !== undefined && !(model.group instanceof Group) && model.group !== '') {
    // Group is a string. String appears when new group is being selected
    group = arrayHasObject(store.getState().persistence.groups, 'name', model.group)
  } else if(model.group !== undefined && model.group instanceof Group && !model.group.isEmpty()) {
    // Group is a Group instance. Mostly appears when group remains unchanged
    group = arrayHasObject(store.getState().persistence.groups, 'name', model.group.name)
  } else {
    // If criteria dies not match, no group has been selected
    group = new Group()
  }

  const password = new PasswordModel(
    (type === 'edit') ? model.id : new Date().getTime(),
    model.name,
    model.username,
    model.password,
    model.notes,
    group,
    null,
    model.validTill
  )

  // Check if there could be a name collision
  const doesCollide = await persistence.adapter.collides(password, oldModel, group, type)
  if(doesCollide === true) {
    dispatch(Message.set('The name already exists. Please choose an other name.'))
    return false
  }

  // If password is valid, persist it
  if(password.validate() === true) {
    password.use()
    if(type === 'new')
      persistence.adapter.addPassword(password)
    else if(type === 'edit') {
      console.log('edit', store.getState())
      persistence.adapter.updatePassword(password, oldModel)
    }

    successCallback()
  } else {
    dispatch(Message.set('You are missing some required data.'))
    return false
  }
}

/**
 * Padds a number e.g. from 9 to 09.
 * @param {Integer} number Number
 * @returns Filled up number as string
 */
const padded = number => (number <= 9) ? `0${number}` : number.toString()

/**
 * Converts the timestamp to a human readable string
 * @param {Integer} timestamp Timestamp
 * @returns Formated string
 */
const getDateString = timestamp => {
  const date = new Date(timestamp)
  return `${padded(date.getDate())}.${padded(date.getMonth()+1)}.${date.getFullYear()} - ${padded(date.getHours())}:${padded(date.getMinutes())}`
}

/**
 * Copies a value to the clipboard
 * @param {String} text Text to copy
 * @param {Object} password The password of which the copied text comes from
 */
const copy = (text, password) => () => {
  const {dispatch} = store
  Clipboard.copy(text, {
    wipe: true,
    callback: () => Notification.set('Sensitive information has been removed from clipboard.'),
    duration: 20000
  })
  dispatch(Message.set('Copied to clipboard.'))

  //Set password use
  const oldPassword = { ...password }
  password.use()
  store.getState().persistence.adapter.updatePassword(password, oldPassword)
}

/**
 * Checks if the password has any components used from the profile
 * @param {String} password
 * @returns True when password is insecury by using items of the profile
 */
const matchesProfile = password => {
  const settingsReadOnly = store.getState().settings.readOnly
  const firstname = settingsReadOnly.get(SettingsParameters.PROFILE_FIRSTNAME)
  const lastname = settingsReadOnly.get(SettingsParameters.PROFILE_LASTNAME)
  const birthday = settingsReadOnly.get(SettingsParameters.PROFILE_BIRTHDAY)
  const date = new Date(birthday)

  const lowerCase = password.toLowerCase()

  const regexFN = new RegExp(firstname.toLowerCase())
  const regexLN = new RegExp(lastname.toLowerCase())
  const regexYear = new RegExp(date.getFullYear())
  //const regexMonth = new RegExp(date.getMonth() + 1)
  //const regexDay = new RegExp(date.getDate())

  return regexFN.test(lowerCase) || regexLN.test(lowerCase) || regexYear.test(lowerCase)
}

export { savePassword, padded, getDateString, copy, matchesProfile }
