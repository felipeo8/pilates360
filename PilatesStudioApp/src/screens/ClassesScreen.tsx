import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList, Class, ApiError } from '../types';
import ApiService from '../services/api';
import ClassCard from '../components/ClassCard';

type ClassesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Classes'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: ClassesScreenNavigationProp;
}

const ClassesScreen: React.FC<Props> = ({ navigation }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const fetchClasses = async (date?: string) => {
    try {
      const classData = await ApiService.getClasses(date);
      setClasses(classData);
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert('Error', apiError.message || 'Failed to load classes');
    }
  };

  const loadClasses = useCallback(async () => {
    setIsLoading(true);
    await fetchClasses(selectedDate || undefined);
    setIsLoading(false);
  }, [selectedDate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchClasses(selectedDate || undefined);
    setRefreshing(false);
  }, [selectedDate]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleClassPress = (classId: number) => {
    navigation.navigate('ClassDetail', { classId });
  };

  const formatDateFilter = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getDateLabel = (daysFromNow: number) => {
    if (daysFromNow === 0) return 'Today';
    if (daysFromNow === 1) return 'Tomorrow';
    
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const dateFilters = [
    { label: 'All', value: '' },
    { label: 'Today', value: formatDateFilter(0) },
    { label: 'Tomorrow', value: formatDateFilter(1) },
    { label: getDateLabel(2), value: formatDateFilter(2) },
    { label: getDateLabel(3), value: formatDateFilter(3) },
  ];

  const renderClass = ({ item }: { item: Class }) => (
    <ClassCard
      class={item}
      onPress={() => handleClassPress(item.id)}
    />
  );

  const renderDateFilter = () => (
    <View style={styles.filterContainer}>
      <FlatList
        horizontal
        data={dateFilters}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedDate === item.value && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDate(item.value)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDate === item.value && styles.filterButtonTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.value || 'all'}
        contentContainerStyle={styles.filterList}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Classes Found</Text>
      <Text style={styles.emptyText}>
        There are no classes scheduled for the selected date.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classes</Text>
      </View>

      {renderDateFilter()}

      <FlatList
        data={classes}
        renderItem={renderClass}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        contentContainerStyle={classes.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ClassesScreen;