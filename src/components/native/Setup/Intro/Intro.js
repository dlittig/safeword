import React from 'react'
import { Text } from 'native-base'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  text: {
    color: '#333',
    lineHeight: 28,
  }
})

const Intro = ({children}) => (
  <Text style={styles.text}>{children}</Text>
)

export default Intro
