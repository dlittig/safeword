import { isObjectEmpty } from '../utils'
import Group from './Group'

/**
 * Password model that will be used when a password entity is handled
 */
export default class Password {
  id = ''
  name = ''
  username = ''
  //passwordEncrypted = ''
  password = ''
  notes = ''
  group = null
  used = null
  validTill = ''

  constructor(id = '', name = '', username = '', /*passwordEncrypted = '',*/ password = '', notes = '', group, used = null, validTill = '') {
    if(!(group instanceof Group)) throw 'Only an instance of the group model is allowed to be assigned to a password!'

    this.id = id
    this.name = name
    this.username = username
    //this.passwordEncrypted = passwordEncrypted
    this.password = password
    this.notes = notes
    this.group = group
    this.used = used
    this.validTill = validTill
  }

  /**
   * Updates the timestamp in this entity to the current time
   */
  use = () => {
    this.used = new Date().getTime()
  }

  /**
   * Checks if a group was assigned to the password
   * @returns True if group was assigned
   */
  hasGroup = () => this.group !== null && this.group !== undefined && this.group instanceof Group

  /**
   * Validates the properties of the password
   * @returns True if password is valid
   */
  validate = () => {
    /*
    if(this.passwordEncrypted.length === 0) {
      throw 'Encrypted password could not be found. Please encrypt password and save it to the correct field before validation.'
    }
    */

    return this.name.length > 0 && this.password.length > 0//&&
    //(isObjectEmpty(this.group) || this.group.name !== undefined))
  }

  /**
   * Clones the password instance
   * @returns Creates a new instance with identical values
   */
  clone = () => {
    return new Password(
      this.id,
      this.name,
      this.username,
      this.password,
      this.notes,
      this.group,
      this.used,
      this.validTill
    )
  }

  /**
   * Clones the password instance, but omits a copy of the group.
   * @returns Creates a new instance with identical values
   */
  cloneWithoutGroup = () => {
    return new Password(
      this.id,
      this.name,
      this.username,
      this.password,
      this.notes,
      new Group(),
      this.used,
      this.validTill
    )
  }
}
