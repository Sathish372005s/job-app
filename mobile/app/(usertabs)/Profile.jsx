import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authstore'
import { useRouter } from 'expo-router'
import COLORS from '../constants/colors'

const Profile = () => {
  const {logout}=useAuthStore()
  const router=useRouter()
  const handlelogout=async()=>{
    await logout()
    router.replace('/(auth)')
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <TouchableOpacity style={styles.button} onPress={handlelogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 40
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: COLORS.button,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.buttonText || "#020617",
    fontSize: 18,
    fontWeight: "bold",
  }
})