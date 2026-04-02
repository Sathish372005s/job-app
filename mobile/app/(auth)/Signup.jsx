import { StyleSheet, Text, View, KeyboardAvoidingView, Alert,Platform, TouchableOpacity, TextInput, Animated, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authstore';

// Reusable Animated Input Component
const AnimatedInput = ({ icon, placeholder, value, onChangeText, secureTextEntry, autoCapitalize, keyboardType, isPassword, onTogglePassword }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // Color and layout animations require useNativeDriver: false
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: icon ? 45 : 15,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 5],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.textSecondary, COLORS.primary],
    }),
  };

  return (
    <View style={styles.inputContainer}>
      {icon && <Ionicons name={icon} size={24} color={COLORS.textSecondary} style={styles.icon} />}
      <Animated.Text style={labelStyle} pointerEvents="none">{placeholder}</Animated.Text>
      <TextInput
        style={[styles.input, { paddingTop: 15 }]} 
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
      {isPassword && (
        <TouchableOpacity 
          style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} 
          onPress={onTogglePassword}
        >
          <Ionicons name={!secureTextEntry ? "eye" : "eye-off"} size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function Signup() {
  const router = useRouter();
  const [signupdata, setSignupdata] = useState({
    name: "",
    email: "",
    password: "",
    securepassword: true,
    role: "jobseeker"
  });
  
  const active = signupdata.role;

  const {register,user,token,role,loading}=useAuthStore();
  const handleRegister =async() =>{
    const result =await register(signupdata.name, signupdata.email, signupdata.password, signupdata.role);
    console.log(result);
    if(result.success){
      Alert.alert("Success", "Registered successfully");
      console.log("user",user);
      console.log("token",token);
      console.log("role",role);
      router.push('/(auth)');
    }
    else{
      console.log("Error in signup frontend",result.error);
      Alert.alert("Error", result.error);
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.maincontainer}>
        <Text style={styles.welcome}>Get your dream job</Text>
        <View style={styles.roleContainer}>
          <View style={active === "jobseeker" ? styles.active : styles.inactive}>
            <TouchableOpacity onPress={() => setSignupdata({ ...signupdata, role: "jobseeker" })}>
              <Text style={active === "jobseeker" ? styles.activebuttonText : styles.buttonText2}>Job Seeker</Text>
            </TouchableOpacity>
          </View>
          <View style={active === "recruiter" ? styles.active : styles.inactive}>
            <TouchableOpacity onPress={() => setSignupdata({ ...signupdata, role: "recruiter" })}>
              <Text style={active === "recruiter" ? styles.activebuttonText : styles.buttonText2}>Recruiter</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.form}>
          <AnimatedInput
            icon="person-outline"
            placeholder="Name"
            value={signupdata.name}
            onChangeText={(text) => setSignupdata({ ...signupdata, name: text })}
            autoCapitalize="words"
          />
          <AnimatedInput
            icon="mail-outline"
            placeholder="Email"
            value={signupdata.email}
            onChangeText={(text) => setSignupdata({ ...signupdata, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <AnimatedInput
            icon="lock-closed-outline"
            placeholder="Password"
            value={signupdata.password}
            onChangeText={(text) => setSignupdata({ ...signupdata, password: text })}
            secureTextEntry={signupdata.securepassword}
            isPassword={true}
            onTogglePassword={() => setSignupdata({ ...signupdata, securepassword: !signupdata.securepassword })}
          />
          
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text style={styles.text}>Already have an account? </Text> 
            <TouchableOpacity onPress={() => router.push('/(auth)')}>
              <Text style={[styles.buttonText, { color: COLORS.button }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 34,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20
  },
  maincontainer: {
    flex: 1,
    marginTop: 100, 
    alignItems: "center"
  },
  buttonText2: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "bold"
  },
  activebuttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold"
  },
  roleContainer: {
    flexDirection: "row",
    gap: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 50,
    padding: 10,
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
    marginBottom: 20
  },
  active: {
    backgroundColor: COLORS.button,
    borderRadius: 50,
    padding: 15,
    paddingHorizontal: 25,
  },
  inactive: {
    padding: 15,
    paddingHorizontal: 25,
  },
  form: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
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
    position: 'relative',
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
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold"
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "bold"
  }
});