import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'

const Applications = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Applications</Text>
    </View>
  )
}

export default Applications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20
  }
})