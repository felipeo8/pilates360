import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AlertService from "../services/AlertService";
import ApiService from "../services/api";
import { ApiError, Class, RootStackParamList } from "../types";

type ClassDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ClassDetail"
>;
type ClassDetailScreenRouteProp = RouteProp<RootStackParamList, "ClassDetail">;

interface Props {
  navigation: ClassDetailScreenNavigationProp;
  route: ClassDetailScreenRouteProp;
}

const ClassDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { classId } = route.params;
  const [classDetail, setClassDetail] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    loadClassDetail();
  }, [classId]);

  const loadClassDetail = async () => {
    try {
      const classData = await ApiService.getClassById(classId);
      setClassDetail(classData);
    } catch (error) {
      const apiError = error as ApiError;
      AlertService.showAlert(
        "Error",
        apiError.message || "Failed to load class details",
        () => {}
      );
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClass = async () => {
    if (!classDetail) return;

    AlertService.showDestructiveConfirm(
      "Confirm Booking",
      `Are you sure you want to book "${classDetail.name}"?`,
      "OK",
      confirmBooking
    );
  };

  const confirmBooking = async () => {
    if (!classDetail) return;

    try {
      setIsBooking(true);
      await ApiService.createBooking({ classId: classDetail.id });

      AlertService.showConfirm(
        "Booking Confirmed!",
        `You have successfully booked "${classDetail.name}".`,
        navigation.goBack
      );
    } catch (error) {
      const apiError = error as ApiError;
      AlertService.showAlert(
        "Booking Failed",
        apiError.message || "Failed to book the class",
        () => {}
      );
    } finally {
      setIsBooking(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getDuration = () => {
    if (!classDetail) return "";
    const start = new Date(classDetail.startTime);
    const end = new Date(classDetail.endTime);
    const diffMinutes = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );
    return `${diffMinutes} minutes`;
  };

  const getAvailabilityColor = () => {
    if (!classDetail) return "#6b7280";
    const percentage =
      (classDetail.availableSpots / classDetail.maxCapacity) * 100;
    if (percentage > 50) return "#10b981"; // Green
    if (percentage > 25) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!classDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Class not found</Text>
      </View>
    );
  }

  const startDateTime = formatDateTime(classDetail.startTime);
  const endDateTime = formatDateTime(classDetail.endTime);
  const canBook = classDetail.availableSpots > 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.className}>{classDetail.name}</Text>
          <Text style={styles.classType}>{classDetail.classTypeName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {classDetail.description || "No description available."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#6366f1" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{startDateTime.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#6366f1" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {startDateTime.time} - {endDateTime.time} ({getDuration()})
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#6366f1" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Instructor</Text>
              <Text style={styles.detailValue}>
                {classDetail.instructorName}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#6366f1" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Studio</Text>
              <Text style={styles.detailValue}>{classDetail.studioName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#6366f1" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Availability</Text>
              <View style={styles.availabilityRow}>
                <View
                  style={[
                    styles.availabilityDot,
                    { backgroundColor: getAvailabilityColor() },
                  ]}
                />
                <Text
                  style={[
                    styles.detailValue,
                    { color: getAvailabilityColor() },
                  ]}
                >
                  {classDetail.availableSpots} of {classDetail.maxCapacity}{" "}
                  spots available
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={20} color="#6366f1" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.price}>${classDetail.price}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!canBook || isBooking) && styles.bookButtonDisabled,
          ]}
          onPress={handleBookClass}
          disabled={!canBook || isBooking}
        >
          <Text style={styles.bookButtonText}>
            {isBooking
              ? "Booking..."
              : !canBook
              ? "Class Full"
              : "Book This Class"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#6b7280",
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  className: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  classType: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  price: {
    fontSize: 20,
    color: "#10b981",
    fontWeight: "bold",
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bookButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  bookButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ClassDetailScreen;
