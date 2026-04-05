import { StyleSheet, Text, View,ScrollView,TextInput,FlatList,KeyboardAvoidingView,Alert,Platform, ActivityIndicator, TouchableOpacity, Modal , Button } from 'react-native'
import React, { useEffect , useState} from 'react'
import COLORS from '../constants/colors'
import { useUserStore } from '../store/userstore'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import Filter from '../../components/Filter';
import Jobcomp from '../../components/ui/Jobcomp';



const Home = () => {
 const {
  getalljobs,
  jobs,
  loading,
  error,
  filters,
  setfilters,
  getjobbyid,
  singlejob
} = useUserStore();

const [showFilter, setShowFilter] = React.useState(false);
const [showSecondModal, setShowSecondModal] = useState(false);

// ✅ Run only when filters change
useEffect(() => {
  getalljobs();
  console.log(jobs)
}, [filters]);



  if(loading){
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
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
        <Text style={styles.title}>Available Jobs</Text>
        <View style={styles.searchContainer}>
          
          <TouchableOpacity onPress={() => setShowFilter(true)}>
            <Ionicons name="filter-outline" size={20} color={COLORS.background} style={styles.filterIcon}/>
          </TouchableOpacity>
          
        </View>
        <FlatList
          data={jobs}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({item, index})=>{
            const displaySkills = item.skillsRequired?.length ? item.skillsRequired : (item.skills || []);
            return (
            <TouchableOpacity onPress={()=>{getjobbyid(item._id);setShowSecondModal(true)}}>
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
                <TouchableOpacity style={styles.viewApplicationsButton} onPress={() => Alert.alert("Applied", "Application submitted successfully!")}>
                  <Text style={styles.viewApplicationsButtonText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            </TouchableOpacity>
          )}}
          keyExtractor={(item)=>item._id}
          
        />

      </View>
      <Modal visible={showFilter} animationType="slide" transparent={true} onRequestClose={() => setShowFilter(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Filter onClose={() => setShowFilter(false)} />
          </View>
        </View>
      </Modal>
      <Modal
        visible={showSecondModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSecondModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Second Modal</Text>
            <Jobcomp />
            <Button title="Close" onPress={() => setShowSecondModal(false)} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 40,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
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
    justifyContent: 'flex-end',
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
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    marginRight: 10,
    color: COLORS.primary,
    top:10
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '80%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  }
})