import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'
import { useRecruiterStore } from '../store/recruiterstore'
import { useEffect, useState } from 'react'
import COLORS from '../constants/colors'
import { Linking ,Alert } from "react-native";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const Applicants = () => {
  const getapplicantbyjob = useRecruiterStore((s) => s.getapplicantbyjob);
  const updatestatus = useRecruiterStore((s) => s.updatestatus);
  const applicants = useRecruiterStore((s) => s.applicants);
  const myjobs = useRecruiterStore((s) => s.myjobs);
  const [activeJobId, setActiveJobId] = useState(false);

  const handleStatusUpdate = async (id, status) => {
    const res = await updatestatus(id, status);
    if (res.success) {
      Alert.alert("Success", `Application marked as ${status}`);
    } else {
      Alert.alert("Error", res.error || "Failed to update status");
    }
  };

  const openResume = async (url) => {
    try {
      if (!url) {
        Alert.alert("Error", "No resume available");
        return;
      }

      const fileUri = FileSystem.documentDirectory + "resume.pdf";

      // Download the file internally
      const result = await FileSystem.downloadAsync(url, fileUri);

      // Trigger the native share sheet/file viewer
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri);
      } else {
        Alert.alert("Error", "Sharing options are not available on this device");
      }
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Error", "Failed to open resume");
    }
  };

  return (
      <KeyboardAvoidingView
         style={styles.container}
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
       >
        <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 20 }}>
          {myjobs && myjobs.map((item, index) => {
            const isExpanded = activeJobId === item._id;
            return (
              <View key={item._id} style={styles.card}>
                <Text style={styles.texts}>{item.title}</Text>
                
                <TouchableOpacity 
                  style={styles.button}
                  onPress={async()=>{
                    if (isExpanded) {
                      setActiveJobId(null);
                    } else {
                      setActiveJobId(item._id);
                      await getapplicantbyjob(item._id);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>{isExpanded ? 'Hide Applicants' : 'View Applicants'}</Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.applicantsContainer}>
                    {applicants && applicants.length > 0 ? (
                      applicants.map((app) => (
                        <View key={app._id} style={styles.applicantCard}>
                          <Text style={styles.applicantName}>{app.applicant?.name || "Unknown Name"}</Text>
                          <Text style={styles.applicantEmail}>{app.applicant?.email || "Unknown Email"}</Text>
                          <Text style={[styles.applicantStatus, app.status === 'rejected' && {color: COLORS.error}]}>Status: {app.status}</Text>
                          
                          <View style={styles.actionRow}>
                            <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={() => handleStatusUpdate(app._id, 'accepted')}>
                              <Text style={styles.actionBtnText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleStatusUpdate(app._id, 'rejected')}>
                              <Text style={styles.actionBtnText}>Reject</Text>
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity style={styles.button} onPress={openResume.bind(null, app.resume)}>
                            <Text style={styles.buttonText}>download Resume</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noApplicants}>No applicants yet.</Text>
                    )}
                  </View>
                )}
              </View>
            )
          })}
        </ScrollView>
       </KeyboardAvoidingView>
  )
}

export default Applicants

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  main: {
    padding: 15,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  texts:{
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.textPrimary
  },
  button: {
    backgroundColor: COLORS.button,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  applicantsContainer: {
    marginTop: 10,
    paddingTop: 10,
  },
  applicantCard: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  applicantEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  applicantStatus: {
    fontSize: 14,
    color: COLORS.success,
    marginTop: 8,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  noApplicants: {
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 5,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptBtn: {
    backgroundColor: COLORS.success || '#4caf50',
  },
  rejectBtn: {
    backgroundColor: COLORS.error || '#f44336',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  }
})