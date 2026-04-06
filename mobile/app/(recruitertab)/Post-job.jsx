import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import COLORS from '../constants/colors'

import { Ionicons } from '@expo/vector-icons'
import { useRecruiterStore } from '../store/recruiterstore'
import { useRouter } from 'expo-router'



const Postjob = () => {
  const router=useRouter()
  const [jobdata, setJobdata] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobtype: "",
    experience: "",
    skills: [],
    company: "",
    status: "open"
  });
  const {createjob,loading,logout}=useRecruiterStore()
  const handlePostJob=async()=>{
    console.log(jobdata);
    const res=await createjob(jobdata.title.trim(), jobdata.description.trim(), jobdata.location.trim(), jobdata.salary.trim(), jobdata.jobtype.trim(), jobdata.experience.trim(), jobdata.skills, jobdata.company.trim(), jobdata.status)
    console.log(res);
    if(res.success){
      setJobdata({
        title: "",
        description: "",  
        location: "",
        salary: "",
        jobtype: "",
        experience: "",
        skills: [],
        company: "",
        status: "open"
      })
      alert("Job posted successfully")
    }
    else{
      alert(res.error)
    }
  }
  const handleLogout=async()=>{
    const res=await logout()
    if(res.success){
      alert("Logged out successfully")
      router.replace("/(auth)")
    }
    else{
      alert(res.error)
    }
  }


  const [focusedInput, setFocusedInput] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setJobdata(prev => ({ 
        ...prev, 
        skills: [...prev.skills, skillInput.trim()] 
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (indexToRemove) => {
    setJobdata(prev => ({ 
      ...prev, 
      skills: prev.skills.filter((_, index) => index !== indexToRemove) 
    }));
  };

  const renderInput = (icon, placeholder, field, index) => {
    const isFocused = focusedInput === field;
    return (
      <View 
        style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}
        key={field}
      >
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? COLORS.primary : COLORS.textSecondary} 
          style={styles.inputIcon} 
        />
        <TextInput
          style={[styles.input, field === 'description' && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          value={jobdata[field]}
          onChangeText={(text) => setJobdata({ ...jobdata, [field]: text })}
          onFocus={() => setFocusedInput(field)}
          onBlur={() => setFocusedInput(null)}
          multiline={field === 'description'}
          textAlignVertical={field === 'description' ? 'top' : 'center'}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.welcome}>Post a Job</Text>
          <Text style={styles.subtitle}>Find the perfect candidate</Text>
        </View>

        <View style={styles.form}>
          {renderInput('briefcase-outline', 'Job Title', 'title', 1)}
          {renderInput('document-text-outline', 'Job Description', 'description', 2)}
          {renderInput('location-outline', 'Location', 'location', 3)}
          {renderInput('cash-outline', 'Salary (e.g., 50000)', 'salary', 4)}
          {renderInput('time-outline', 'Job Type (e.g., Full-time)', 'jobtype', 5)}
          {renderInput('star-outline', 'Experience Required', 'experience', 6)}
          
          <View style={{ width: '100%' }}>
            <View style={[styles.inputContainer, { marginBottom: jobdata.skills.length > 0 ? 10 : 15 }, focusedInput === 'skills' && styles.inputContainerFocused]}>
              <Ionicons 
                name="construct-outline" 
                size={20} 
                color={focusedInput === 'skills' ? COLORS.primary : COLORS.textSecondary} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Skills Required (e.g., React)"
                placeholderTextColor={COLORS.textSecondary}
                value={skillInput}
                onChangeText={setSkillInput}
                onFocus={() => setFocusedInput('skills')}
                onBlur={() => setFocusedInput(null)}
                onSubmitEditing={handleAddSkill}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={handleAddSkill} style={{ padding: 5 }}>
                <Ionicons name="add-circle" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            {jobdata.skills.length > 0 && (
              <View style={styles.skillsList}>
                {jobdata.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(index)}>
                      <Ionicons name="close-circle" size={16} color="#020617" style={{marginLeft: 6}} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {renderInput('business-outline', 'Company Name', 'company', 8)}

          <TouchableOpacity 

            style={styles.button}
            activeOpacity={0.8}
            onPress={handlePostJob}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={COLORS.buttonText || "#020617"} /> : <Text style={styles.buttonText}>Post Job</Text>}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Postjob

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: COLORS.background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center'
  },
  headerContainer: {
    width: "100%",
    marginBottom: 25,
    alignItems: "center"
  },
  welcome: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
    alignItems: "center"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minHeight: 55,
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: COLORS.card,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#1C2331",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    minHeight: 55,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 15,
    paddingBottom: 15,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
    width: '100%',
  },
  skillChip: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  skillChipText: {
    color: "#020617",
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: COLORS.button,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  },
})