import dns from 'dns'

/**
 * Checks if device is connected to the internet
 * @returns Promise which resolves to true when internet connection is available
 */
export const isConnected = () => new Promise(resolve => {
  dns.lookup('google.com',function(err) {
    if (err && err.code == 'ENOTFOUND') {
      resolve(false)
    } else {
      resolve(true)
    }
  })
})

/**
 * Checks if device is connected via cellular network
 */
export const isMobile = async () => false
