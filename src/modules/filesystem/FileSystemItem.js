/**
 * FileSystemItem is being used when data is being fetched from the filesystem.
 */
export default class FileSystemItem {
  name = ''
  path = ''
  isDirectory = false
  size = ''

  constructor(_name, _path, _isDirectory, _size) {
    this.name = _name
    this.path = _path
    this.isDirectory = _isDirectory
    this.size = _size
  }
}
