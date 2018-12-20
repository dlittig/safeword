/**
 * Group model that will be used when a group entity is handled
 */
export default class Group {
  id = ''
  name = ''
  passwords = []

  constructor(id = '', name = '') {
    this.id = id
    this.name = name
  }

  /**
   * Checks if Group is empty
   * @returns True when the object does not differ from the default values
   */
  isEmpty = () => this.id === '' && this.name === '' && this.passwords.length === 0

  /**
   * Clones the group instance
   * @returns Creates a new instance with identical values.
   */
  clone = () => new Group(this.id, this.name)
}
