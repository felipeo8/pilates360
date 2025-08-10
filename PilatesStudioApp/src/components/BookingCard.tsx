import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking, BookingStatus } from '../types';

interface Props {
  booking: Booking;
  onCancel: (id: number) => void;
  onPress: () => void;
}

const BookingCard: React.FC<Props> = ({ booking, onCancel, onPress }) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString([], { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return { backgroundColor: '#10b981', color: '#ffffff' };
      case BookingStatus.Cancelled:
        return { backgroundColor: '#ef4444', color: '#ffffff' };
      case BookingStatus.Completed:
        return { backgroundColor: '#6b7280', color: '#ffffff' };
      case BookingStatus.NoShow:
        return { backgroundColor: '#f59e0b', color: '#ffffff' };
      default:
        return { backgroundColor: '#6b7280', color: '#ffffff' };
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return 'Confirmed';
      case BookingStatus.Cancelled:
        return 'Cancelled';
      case BookingStatus.Completed:
        return 'Completed';
      case BookingStatus.NoShow:
        return 'No Show';
      default:
        return 'Unknown';
    }
  };

  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking for "${booking.class.name}"?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', onPress: () => onCancel(booking.id), style: 'destructive' },
      ]
    );
  };

  const canCancel = booking.status === BookingStatus.Confirmed;
  const classDateTime = formatDateTime(booking.class.startTime);
  const bookingDateTime = formatDateTime(booking.bookingDate);
  const statusStyle = getStatusStyle(booking.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.className}>{booking.class.name}</Text>
          <Text style={styles.classType}>{booking.class.classTypeName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {getStatusText(booking.status)}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{classDateTime.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {classDateTime.time} - {formatDateTime(booking.class.endTime).time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{booking.class.instructorName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{booking.class.studioName}</Text>
        </View>

        {booking.notes && (
          <View style={styles.detailRow}>
            <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{booking.notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.bookingDate}>
            Booked on {bookingDateTime.date}
          </Text>
        </View>
        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelPress}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  classType: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  footerLeft: {
    flex: 1,
  },
  bookingDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
});

export default BookingCard;