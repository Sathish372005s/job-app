import { StyleSheet, Text, View ,Button} from 'react-native'
import React from 'react'
import { useRecruiterStore } from '../store/recruiterstore'
import { useEffect } from 'react'

const Applicants = () => {
  const {getapplicantbyjob,applicants}=useRecruiterStore()
  const myjobs=useRecruiterStore(state=>state.myjobs)
  useEffect(()=>{
    console.log("this is from applicant page",myjobs)
    console.log("this is from applicant page",applicants)
  },[])
  return (
    <View>
    {myjobs.map((job) => (
      <View key={job._id}>
    <Text>{job.title}</Text>
      <Text style={styles.texts}>{job._id}</Text>
    <Button
      title="View Applicants"
      onPress={() => getapplicantbyjob(job._id)}
    />
  </View>
))}
</View>
  )
}

export default Applicants

const styles = StyleSheet.create({
  texts:{
    fontSize:18,
    fontWeight:"bold",
    marginBottom:10,
    color:"#de0f0f"
  }
})