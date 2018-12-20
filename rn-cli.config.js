/**
 * Imports the readable-stream version required by safeword.
 * If this function is omitted an older version required by node-libs-react-native
 * is being used which results in an error.
 */
function changeStreamExport() {
  let modules = require('node-libs-react-native')
  modules.stream = require.resolve('readable-stream')
  modules._stream_duplex = require.resolve('readable-stream/lib/_stream_duplex.js');
  modules._stream_passthrough	= require.resolve('readable-stream/lib/_stream_passthrough.js');
  modules._stream_readable = require.resolve('readable-stream/lib/_stream_readable.js');
  modules._stream_transform	= require.resolve('readable-stream/lib/_stream_transform.js');
  modules._stream_writable = require.resolve('readable-stream/lib/_stream_writable.js');

  return modules
}

module.exports = {
  extraNodeModules: changeStreamExport(),
};
