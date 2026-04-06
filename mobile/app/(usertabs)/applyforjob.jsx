import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useUserStore } from '../../app/store/userstore';
import { useAuthStore } from '../../app/store/authstore';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { useRouter } from 'expo-router';

export default function applyforjob() {
  const { singlejob ,applyjob} = useUserStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [file, setfile] = useState(null);

  const pickpdf = async() =>{
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true
      });
      
      if (!result.canceled) {
        setfile(result.assets[0]);
      }
    } catch (err) {
      console.log("Error: ", err);
      Alert.alert("Error", "Failed to pick document");
    }
  }
  
  const removefile = ()=>{
    setfile(null);
  }

const handleSubmit = async () => {
  if (!file) {
    Alert.alert(
      "Resume Required",
      "Please attach a resume PDF to apply for this job."
    );
    return;
  }

  try {
    const result = await applyjob(singlejob._id, user._id, file);

    if (result?.success) {
      Alert.alert(
        "Success",
        "Your application has been submitted successfully!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(usertabs)"),
          },
        ]
      );
    } else {
      Alert.alert("Error", result?.message || "Failed to submit application");
    }
  } catch (error) {
    console.log("Error:", error);
    Alert.alert(
      "Error",
      error?.response?.data?.message || "Something went wrong"
    );
  }
};

  if (!singlejob) {
     return (
       <View style={styles.container}>
         <Text style={{color: COLORS.textPrimary}}>No job selected</Text>
       </View>
     );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Apply for Job</Text>
      </View>

      {/* Job Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        <Text style={styles.jobTitle}>{singlejob.title}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="business" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>{singlejob.company}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{singlejob.location}</Text>
        </View>
      </View>

      {/* Applicant Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Details</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{user?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
      </View>

      {/* Resume Upload Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resume (PDF)</Text>
        
        {!file ? (
            <TouchableOpacity style={styles.uploadButton} onPress={pickpdf}>
                <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
                <Text style={styles.uploadText}>Tap to pick a PDF document</Text>
            </TouchableOpacity>
        ) : (
            <View style={styles.fileContainer}>
                <View style={styles.fileInfo}>
                    <Ionicons name="document-text" size={24} color={COLORS.primary} />
                    <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                </View>
                <TouchableOpacity onPress={removefile} style={styles.removeButton}>
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
            </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
         <Text style={styles.submitButtonText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
  },
  uploadText: {
    marginTop: 8,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  }
})