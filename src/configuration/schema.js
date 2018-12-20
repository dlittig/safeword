// Define your models and their properties
const schema = {
  'title': 'safeword',
  'version': 0,
  'type': 'object',
  'properties': {
    'id': {
      'type': 'string',
      'final': true,
      'primary': true
    },
    'path': {
      'type': 'string',
      'encrypted': true,
      'default': ''
    },
    'type': {
      'type': 'string',
      'encrypted': true
    },
    'created': {
      'type': 'number',
      'encrypted': true,
      'final': true
    }
  },
  'required': ['id', 'type', 'created']
}

export default schema
