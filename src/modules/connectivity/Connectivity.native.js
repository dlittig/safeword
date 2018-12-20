import { NetInfo } from 'react-native'

/**
 * Checks if device is connected to the internet
 * @returns Promise which resolves to true when internet connection is available
 */
export const isConnected = async () => {
  const connection = await NetInfo.getConnectionInfo()
  return connection.type !== 'unknown' && connection.type !== 'none'
}

/**
 * Checks if device is connected via cellular network
 */
export const isMobile = async () => {
  const connection = await NetInfo.getConnectionInfo()
  return connection.type === 'cellular'
}
