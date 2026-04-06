import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { useAuthStore } from '../store/authstore'
import { useRouter } from 'expo-router'
import COLORS from '../constants/colors'
import { Feather } from '@expo/vector-icons'
import {} from '../store/authstore'

const Profile = () => {
    const { logout, updateprofile ,user} = useAuthStore()
    const router = useRouter()
    
    const [profileData, setProfileData] = useState({
        skills: "",
        experience: "",
        education: "",
        projects: [
            { name: "", description: "" },
            { name: "", description: "" }
        ]
    })

    const handlesave = async () => {
        const skillsArray = profileData.skills.split(',').map(skill => skill.trim())
        const finaldata ={
            skills: skillsArray,
            experience: profileData.experience,
            education: profileData.education,
            projects: profileData.projects
        }
        await updateprofile(finaldata)
        Alert.alert("Success", "Profile updated successfully!", [
            { text: "OK", onPress: () => console.log("OK Pressed") }
        ])
        console.log(user)
    }

    const handlelogout = async () => {
        await logout()
        router.replace('/(auth)')
    }

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...profileData.projects]
        updatedProjects[index][field] = value
        setProfileData({ ...profileData, projects: updatedProjects })
    }

    const handleAddProject = () => {
        setProfileData({
            ...profileData,
            projects: [...profileData.projects, { name: "", description: "" }]
        })
    }
    
    // Allows user to remove a project if needed.
    const handleRemoveProject = (indexToRemove) => {
        const updatedProjects = profileData.projects.filter((_, index) => index !== indexToRemove)
        setProfileData({ ...profileData, projects: updatedProjects })
    }


    return (
        <KeyboardAvoidingView 
            style={styles.keyboardView} 
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View>
                  <Text style={styles.title}>Welcome, {user?.name}!</Text>
                  <Text style={styles.label}> {user?.email}</Text>
                  <Text style={styles.label}>Role: {user?.role}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.title}>Edit Profile</Text>
                    <TouchableOpacity onPress={handlelogout} style={styles.logoutIcon}>
                        <Feather name="log-out" size={24} color={COLORS.error} />
                    </TouchableOpacity>
                </View>

                {/* Experience Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Experience</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.experience}
                        onChangeText={(text) => setProfileData({ ...profileData, experience: text })}
                        placeholder="e.g., 1 year"
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                {/* Education Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Education</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.education}
                        onChangeText={(text) => setProfileData({ ...profileData, education: text })}
                        placeholder="e.g., B.E Computer Science"
                        placeholderTextColor={COLORS.textSecondary}
                    />
                </View>

                {/* Skills Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Skills (Comma Separated)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={profileData.skills}
                        onChangeText={(text) => setProfileData({ ...profileData, skills: text })}
                        placeholder="React, Node.js, MongoDB"
                        placeholderTextColor={COLORS.textSecondary}
                        multiline
                    />
                </View>

                {/* Projects Section */}
                <View style={styles.sectionHeaderContainer}>
                     <Text style={styles.sectionTitle}>Projects</Text>
                     <TouchableOpacity onPress={handleAddProject} style={styles.addProjectBtn}>
                         <Feather name="plus-circle" size={20} color={COLORS.primary} />
                         <Text style={styles.addProjectText}>Add</Text>
                     </TouchableOpacity>
                </View>

                {profileData.projects.map((project, index) => (
                    <View key={index} style={styles.projectCard}>
                        <View style={styles.projectHeader}>
                            <Text style={styles.projectIndex}>Project {index + 1}</Text>
                            <TouchableOpacity onPress={() => handleRemoveProject(index)}>
                                <Feather name="trash-2" size={18} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={project.name}
                            onChangeText={(text) => handleProjectChange(index, 'name', text)}
                            placeholder="Project Name"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={project.description}
                            onChangeText={(text) => handleProjectChange(index, 'description', text)}
                            placeholder="Project Description"
                            placeholderTextColor={COLORS.textSecondary}
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.saveButton} onPress={handlesave}>
                    <Text style={styles.buttonText}>Save Profile</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Profile

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.background,
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    logoutIcon: {
        padding: 8,
        backgroundColor: COLORS.card,
        borderRadius: 12,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: COLORS.card,
        color: COLORS.textPrimary,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    addProjectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addProjectText: {
        color: COLORS.primary,
        marginLeft: 6,
        fontWeight: 'bold',
    },
    projectCard: {
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    projectIndex: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        width: "100%",
        height: 55,
        backgroundColor: COLORS.button,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.buttonText || "#020617",
        fontSize: 18,
        fontWeight: "bold",
    }
})