import { StyleSheet, Text, View ,KeyboardAvoidingView,Platform, TouchableOpacity,TextInput,Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import COLORS  from '../constants/colors'
import { Ionicons } from '@expo/vector-icons';
import { useRouter,Link } from 'expo-router';
import { useAuthStore } from '../store/authstore';
export default function Index() {
  const [logindata,setLogindata] = useState({
    email:"", 
    password:"",
    securepassword : false
  })
  const router = useRouter();
  const {login,role,loading}=useAuthStore();
  const handleLogin=async()=>{
    const res=await login(logindata.email,logindata.password)
    if(res.success){
      if(role==="jobseeker"){
        router.push('/(usertabs)')
      }else{
        router.push('/(recruitertab)')
      }
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Saturn Jobs</Text>  
        {/* <Image source={require("../../assets/images/login.jpg")} style={styles.logo} /> */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textSecondary}
              value={logindata.email}
              onChangeText={(text) => setLogindata({ ...logindata, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textSecondary}
              value={logindata.password}
              onChangeText={(text) => setLogindata({ ...logindata, password: text })}
              secureTextEntry={!logindata.securepassword}
            />
            <TouchableOpacity 
              style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} 
              onPress={() => setLogindata({ ...logindata, securepassword: !logindata.securepassword })}
            >
              <Ionicons name={logindata.securepassword ? "eye" : "eye-off"} size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.textPrimary} /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text style={styles.text}>Don't have an account? </Text> 
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[styles.buttonText, { color: COLORS.button }]}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100, 
        alignItems: "center"
    },
    welcome: {
        fontSize: 34,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 20
    },
    form: {
        width: "100%",
        alignItems: "center",
        marginTop: 30,
        gap: 20
    },
    inputContainer: {
        width: "85%",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        borderColor: COLORS.border || "#D1D5DB",
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: COLORS.card,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: "100%",
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    eyeicon: {
        padding: 5
    },
    button: {
        width: "85%",
        height: 60,
        backgroundColor: COLORS.button,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: COLORS.button,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    buttonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: "bold"
    },
    text: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: "bold"
    },logo: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 20
    }
})