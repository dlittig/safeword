import React from 'react'

import { Content } from 'native-base'
import { StyleSheet } from 'react-native'
import Webdav from './Webdav'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

const Sync = () => (
  <Content style={styles.container}>
    <Webdav />
  </Content>
)

export default Sync
