import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import COLORS from '../constants/colors'
import { useUserStore } from '../store/userstore'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'

const Applications = () => {
  const myapplications = useUserStore((state) => state.myapplications);
  const getmyapplications = useUserStore((state) => state.getmyapplications);
  const loading = useUserStore((state) => state.loading);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch applications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getmyapplications();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getmyapplications();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#eab308'; // yellow
      case 'accepted': return '#22c55e'; // green
      case 'rejected': return '#ef4444'; // red
      default: return COLORS.primary;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'rgba(234, 179, 8, 0.15)';
      case 'accepted': return 'rgba(34, 197, 94, 0.15)';
      case 'rejected': return 'rgba(239, 68, 68, 0.15)';
      default: return 'rgba(37, 99, 235, 0.15)';
    }
  };

  const renderApplicationCard = ({ item }) => {
    // Backend populates job with title, company, location
    const jobTitle = item.job?.title || 'Unknown Job';
    const jobCompany = item.job?.company || 'Unknown Company';
    const jobLocation = item.job?.location || 'Location missing';
    
    // Format date string to local readable format
    const appliedDate = new Date(item.createdAt).toLocaleDateString();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.jobTitle} numberOfLines={1}>{jobTitle}</Text>
            <Text style={styles.jobCompany}>
              <Ionicons name="business-outline" size={14} color={COLORS.primary} /> {jobCompany}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {(item.status || "PENDING").toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.infoPill}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{jobLocation}</Text>
          </View>
          <View style={styles.infoPill}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Applied: {appliedDate}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Applications</Text>
      
      {(!myapplications || myapplications.length === 0) ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color={COLORS.border} />
          <Text style={styles.emptyText}>You haven't applied to any jobs yet.</Text>
        </View>
      ) : (
        <FlatList
          data={myapplications}
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={renderApplicationCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          style={styles.flatList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        />
      )}
    </View>
  )
}

export default Applications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
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
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  jobCompany: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  }
})