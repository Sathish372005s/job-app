import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import COLORS from '../app/constants/colors'
import { useUserStore } from '../app/store/userstore'

const Filter = ({ onClose }) => {
  const { filters, setfilters, resetfilter } = useUserStore();
  
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (name, value) => {
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setfilters(localFilters);
    if(onClose) onClose();
  };

  const handleReset = () => {
      resetfilter();
      if(onClose) onClose();
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter Jobs</Text>
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Keyword / Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Job title, company..."
                placeholderTextColor={COLORS.textSecondary}
                value={localFilters.keyword}
                onChangeText={(text) => handleChange('keyword', text)}
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
                style={styles.input}
                placeholder="City, state, or remote..."
                placeholderTextColor={COLORS.textSecondary}
                value={localFilters.location}
                onChangeText={(text) => handleChange('location', text)}
            />
        </View>

        <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Min Salary ($)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E.g. 50000"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    value={localFilters.minSalary ? String(localFilters.minSalary) : ""}
                    onChangeText={(text) => handleChange('minSalary', text)}
                />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Max Salary ($)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E.g. 100000"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    value={localFilters.maxSalary ? String(localFilters.maxSalary) : ""}
                    onChangeText={(text) => handleChange('maxSalary', text)}
                />
            </View>
        </View>

        <View style={styles.row}>
             <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                 <Text style={styles.label}>Experience (Yrs)</Text>
                 <TextInput
                     style={styles.input}
                     placeholder="Max Yrs..."
                     placeholderTextColor={COLORS.textSecondary}
                     keyboardType="numeric"
                     value={localFilters.experience ? String(localFilters.experience) : ""}
                     onChangeText={(text) => handleChange('experience', text)}
                 />
             </View>
             <View style={[styles.inputGroup, { flex: 1 }]}>
                 <Text style={styles.label}>Job Type</Text>
                 <TextInput
                     style={styles.input}
                     placeholder="Full-time..."
                     placeholderTextColor={COLORS.textSecondary}
                     value={localFilters.jobType}
                     onChangeText={(text) => handleChange('jobType', text)}
                 />
             </View>
        </View>
        
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Sort By</Text>
            <View style={styles.sortOptions}>
                <TouchableOpacity 
                    style={[styles.sortButton, localFilters.sort === 'latest' && styles.sortButtonActive]}
                    onPress={() => handleChange('sort', 'latest')}
                >
                    <Text style={[styles.sortButtonText, localFilters.sort === 'latest' && styles.sortButtonTextActive]}>Latest</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.sortButton, localFilters.sort === 'oldest' && styles.sortButtonActive]}
                    onPress={() => handleChange('sort', 'oldest')}
                >
                    <Text style={[styles.sortButtonText, localFilters.sort === 'oldest' && styles.sortButtonTextActive]}>Oldest</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
        </View>
        
    </ScrollView>
  )
}

export default Filter

const styles = StyleSheet.create({
   container: {
        flex: 1,
        paddingBottom: 20,
   },
   header: {
        marginBottom: 20,
        alignItems: 'center',
   },
   headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
   },
   inputGroup: {
        marginBottom: 15,
   },
   label: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textPrimary,
        marginBottom: 8,
   },
   input: {
        backgroundColor: COLORS.card || '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.border || '#333333',
        color: COLORS.textPrimary || '#FFFFFF',
   },
   row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
   },
   sortOptions: {
        flexDirection: 'row',
        gap: 10,
   },
   sortButton: {
        flex: 1,
        backgroundColor: COLORS.card || '#1A1A1A',
        borderWidth: 1,
        borderColor: COLORS.border || '#333333',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
   },
   sortButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
   },
   sortButtonText: {
        color: COLORS.textPrimary || '#fff',
        fontWeight: '600',
   },
   sortButtonTextActive: {
        color: COLORS.background || '#000',
   },
   buttonContainer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
        marginBottom: 40,
   },
   resetButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
   },
   resetButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
   },
   applyButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
   },
   applyButtonText: {
        color: COLORS.background || '#000',
        fontWeight: 'bold',
        fontSize: 16,
   }
})