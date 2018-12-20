import React from 'react'

import { View, Text } from 'native-base'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  emptyText: {
    color: '#777'
  },
  emptyContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 15
  }
})

const EmptyState = ({text}) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{text}</Text>
  </View>
)
export default EmptyState
