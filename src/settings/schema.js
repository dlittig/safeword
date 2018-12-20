// Define your models and their properties
const schema = {
  'title': 'settings',
  'version': 0,
  'type': 'object',
  'properties': {
    'key': {
      'type': 'string',
      'final': true,
      'primary': true
    },
    'value': {
      'type': 'string',
      'encrypted': true,
      'default': ''
    }
  },
  'required': ['key', 'value']
}

export default schema
