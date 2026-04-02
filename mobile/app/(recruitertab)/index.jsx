import { StyleSheet, Text, View, KeyboardAvoidingView,Alert,Platform, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRecruiterStore } from '../store/recruiterstore'
import { useAuthStore } from '../store/authstore'
import COLORS from '../constants/colors'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useFocusEffect } from 'expo-router';

const Home = () => {
  const {user}=useAuthStore()
  const {loading,getjobbyrecruiter,deletejob}=useRecruiterStore()
  const [jobs,setJobs]=useState([])

  useFocusEffect(
    React.useCallback(() => {
      const fetchJobs=async()=>{
        const res=await getjobbyrecruiter(user._id)
        if(res.success){
          setJobs(res.jobs)
        }
      }
      fetchJobs()
    }, [])
  )


  const deletejobfunc=async(id)=>{
    const res=await deletejob(id)
    console.log("this from home",res)
    if(res.success){
      Alert.alert("deleted successfully")
      setJobs(jobs.filter((job)=>job._id!==id))
    }
  }
  
  if(loading){
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.main}>
        <FlatList
          data={jobs}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({item, index})=>{
            const displaySkills = item.skillsRequired?.length ? item.skillsRequired : (item.skills || []);
            return (
            <Animated.View 
              entering={FadeInDown.delay(index * 100).springify().damping(12)}
              style={styles.jobCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.jobTitle}>{item.title}</Text>
                  <Text style={styles.jobCompany}>
                    <Ionicons name="business-outline" size={14} color={COLORS.primary} /> {item.company}
                  </Text>
                </View>
                <View style={[styles.statusBadge, item.status === 'open' ? styles.statusOpen : styles.statusClosed]}>
                  <Text style={[styles.statusText, item.status === 'open' ? {color: '#22c55e'} : {color: '#ef4444'}]}>
                    {item.status?.toUpperCase() || 'OPEN'}
                  </Text>
                </View>
              </View>

              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.tagText}>{item.location}</Text>
                </View>
                <View style={styles.tag}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.tagText}>{item.jobtype || item.jobType}</Text>
                </View>
                <View style={styles.tag}>
                  <Ionicons name="cash-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.tagText}>${item.salary}</Text>
                </View>
                <View style={styles.tag}>
                  <Ionicons name="briefcase-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.tagText}>{item.experience} Yrs</Text>
                </View>
              </View>

              <Text style={styles.jobDescription} numberOfLines={2}>{item.description}</Text>
             
              {displaySkills.length > 0 && (
                <View style={styles.skillsContainer}>
                  {displaySkills.map((skill, i) => (
                    <View key={i} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={()=>deletejobfunc(item._id)}>
                  <Ionicons name="trash" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewApplicationsButton}>
                  <Text style={styles.viewApplicationsButtonText}>view applications</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}}
          keyExtractor={(item)=>item._id}
        />
      </View>

    </KeyboardAvoidingView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 6,
  },
  jobCompany: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusOpen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusClosed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  skillChip: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.3)',
  },
  skillText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  viewApplicationsButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewApplicationsButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
})