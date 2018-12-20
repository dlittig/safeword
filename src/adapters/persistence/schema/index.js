/**
 * Schema used to store groups by RxAdapter
 */
const groupSchema = {
  title: 'groups',
  name: 'groups',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      final: true,
      primary: true
    },
    name: {
      type: 'string',
      encrypted: true
    },
    passwords: {
      type: 'array',
      ref: 'password',
      items: {
        type: 'string'
      }
    }
  },
  required: ['id', 'name']
}

/**
 * Schema used to store passwords by RxAdapter
 */
const passwordSchema = {
  title: 'passwords',
  name: 'passwords',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      final: true,
      primary: true
    },
    name: {
      type: 'string',
      encrypted: true
    },
    username: {
      type: 'string',
      encrypted: true,
      default: ''
    },
    password: {
      type: 'string',
      encrypted: true
    },
    notes: {
      type: 'string',
      encrypted: true,
      default: ''
    },
    group: {
      type: 'string',
      ref: 'groups'
    },
    used: {
      type: 'number',
      encrypted: true
    },
    validTill: {
      type: 'string',
      encrypted: true,
      default: ''
    }
  },
  required: ['id', 'name', 'password', 'used', 'group']
}

export { groupSchema, passwordSchema }
