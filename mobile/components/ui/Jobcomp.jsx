import { ScrollView, StyleSheet, Text, View, Dimensions, Button,TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '../../app/constants/colors'
import { useUserStore } from '../../app/store/userstore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'


export default function Jobcomp() {
    const router=useRouter()
    const { singlejob } = useUserStore();

    if (!singlejob) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>No Job Data</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>{singlejob.title}</Text>
                <View style={styles.companyRow}>
                    <Ionicons name="business" size={18} color={COLORS.primary} />
                    <Text style={styles.company}>{singlejob.company}</Text>
                </View>
                {singlejob.location && (
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.location}>{singlejob.location}</Text>
                    </View>
                )}
            </View>

            {/* Badges/Highlights */}
            <View style={styles.highlightsContainer}>
                <View style={styles.highlightBadge}>
                    <Ionicons name="briefcase-outline" size={16} color={COLORS.textPrimary} />
                    <Text style={styles.highlightText}>{singlejob.jobType}</Text>
                </View>
                <View style={styles.highlightBadge}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textPrimary} />
                    <Text style={styles.highlightText}>
                        {singlejob.experience === 0 ? "Fresher" : `0 - ${singlejob.experience} Yrs`}
                    </Text>
                </View>
                {singlejob.salary ? (
                    <View style={styles.highlightBadge}>
                        <Ionicons name="cash-outline" size={16} color={COLORS.success} />
                        <Text style={[styles.highlightText, { color: COLORS.success }]}>₹ {singlejob.salary}</Text>
                    </View>
                ) : null}
            </View>

            {/* Description Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text style={styles.description}>{singlejob.description || "No description provided."}</Text>
            </View>

            {/* Skills Section */}
            {singlejob.skillsRequired && singlejob.skillsRequired.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills Required</Text>
                    <View style={styles.skillsContainer}>
                        {singlejob.skillsRequired.map((skill, index) => (
                            <View key={index} style={styles.skillChip}>
                                <Text style={styles.skillText}>{skill}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Status */}
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    Status: <Text style={{ color: singlejob.status === 'closed' ? COLORS.error : COLORS.success }}>{singlejob.status ? singlejob.status.toUpperCase() : "OPEN"}</Text>
                </Text>
            </View>
           <TouchableOpacity style={styles.applyButton} onPress={() => router.push('/(usertabs)/applyforjob')}>
                <Text style={styles.applyButtonText}>APPLY NOW</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: COLORS.textSecondary,
        fontSize: 16
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    companyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    company: {
        fontSize: 20,
        color: COLORS.primary,
        marginLeft: 8,
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    highlightsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30,
    },
    highlightBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 6,
    },
    highlightText: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    skillChip: {
        backgroundColor: COLORS.chip,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    skillText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    statusContainer: {
        marginTop: 10,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    statusText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    applyButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    applyButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
})