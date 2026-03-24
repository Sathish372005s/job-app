import { StyleSheet, Text, View,KeyboardAvoidingView,Platform } from 'react-native'
import React from 'react'
import { useRecruiterStore } from '../store/recruiterstore'

const Home = () => {
  const {loading,getjobbyrecruiter}=useRecruiterStore()
  const [jobs,setJobs]=useState([])
  useEffect(() => {
    const fetchJobs=async()=>{
      const res=await getjobbyrecruiter()
      if(res.success){
        setJobs(res.jobs)
      }
    }
    fetchJobs()
  }, [])
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
          renderItem={({item})=>(
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobDescription}>{item.description}</Text>
              <Text style={styles.jobLocation}>{item.location}</Text>
              <Text style={styles.jobSalary}>{item.salary}</Text>
              <Text style={styles.jobType}>{item.jobtype}</Text>
              <Text style={styles.jobExperience}>{item.experience}</Text>
              <Text style={styles.jobSkills}>{item.skills}</Text>
              <Text style={styles.jobCompany}>{item.company}</Text>
              <Text style={styles.jobStatus}>{item.status}</Text>
            </View>
          )}
          keyExtractor={(item)=>item._id}
        />
      </View>

    </KeyboardAvoidingView>
  )
}

export default Home

const styles = StyleSheet.create({})