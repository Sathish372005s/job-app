import { StyleSheet, Text, View ,KeyboardAvoidingView,Platform, TouchableOpacity,TextInput,label} from 'react-native'
import React, { useState } from 'react'
import COLORS  from '../constants/colors'
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const [logindata,setLogindata] = useState({
    email:"",
    password:""
  })
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 ,backgroundColor : COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Saturn Jobs</Text>  
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder={<Ionicons name="mail-outline" size={24} color="black" />}
              value={logindata.email}
              onChangeText={(text) => setLogindata({ ...logindata, email: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={logindata.password}
            onChangeText={(text) => setLogindata({ ...logindata, password: text })}
          />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        top:100, 
        alignItems:"center"
    },
    welcome:{
        fontSize:34,
        fontWeight:"bold",
        color:COLORS.textPrimary
    },
    inputContainer:{
        width:"80%",
        marginBottom:20,
        display:"flex",
        flexDirection:"row",
        gap:10
    },
    input:{
        width:"100%",
        height:50,
        borderColor:COLORS.textPrimary,
        borderWidth:1,
        borderRadius:10,
        paddingHorizontal:10
    }
})