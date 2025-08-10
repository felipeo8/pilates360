import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList, Booking, ApiError } from '../types';
import ApiService from '../services/api';
import BookingCard from '../components/BookingCard';

type BookingsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Bookings'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: BookingsScreenNavigationProp;
}

const BookingsScreen: React.FC<Props> = ({ navigation }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const bookingData = await ApiService.getUserBookings();
      setBookings(bookingData);
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert('Error', apiError.message || 'Failed to load bookings');
    }
  };

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    await fetchBookings();
    setIsLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookings();
    });

    return unsubscribe;
  }, [navigation, loadBookings]);

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await ApiService.cancelBooking(bookingId);
      
      // Update the booking status locally
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 1 } // BookingStatus.Cancelled
            : booking
        )
      );
      
      Alert.alert('Success', 'Booking cancelled successfully');
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert('Error', apiError.message || 'Failed to cancel booking');
    }
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('ClassDetail', { classId: booking.class.id });
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <BookingCard
      booking={item}
      onCancel={handleCancelBooking}
      onPress={() => handleBookingPress(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Bookings Found</Text>
      <Text style={styles.emptyText}>
        You haven't booked any classes yet. Browse available classes to get started!
      </Text>
    </View>
  );

  // Separate bookings by status
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 0 && new Date(booking.class.startTime) > new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status !== 0 || new Date(booking.class.startTime) <= new Date()
  );

  const allBookings = [...upcomingBookings, ...pastBookings];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        {bookings.length > 0 && (
          <Text style={styles.subtitle}>
            {upcomingBookings.length} upcoming • {pastBookings.length} past
          </Text>
        )}
      </View>

      <FlatList
        data={allBookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        contentContainerStyle={allBookings.length === 0 ? styles.emptyList : styles.list}
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
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
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

export default BookingsScreen;