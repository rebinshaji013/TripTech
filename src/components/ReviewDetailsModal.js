// src/components/ReviewDetailsModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-paper';
import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';

const { width } = Dimensions.get('window');

// Star Rating Component for Modal
const StarRating = ({ rating, maxStars = 5, size = 24, showNumber = false }) => {
  return (
    <View style={styles.starContainer}>
      {[...Array(maxStars)].map((_, index) => (
        <Icon
          key={index}
          source={index < rating ? "star" : "star-outline"}
          size={size}
          color="#FFD700"
        />
      ))}
      {showNumber && (
        <Text style={styles.ratingNumber}>({rating}.0)</Text>
      )}
    </View>
  );
};

const ReviewDetailsModal = ({
  visible,
  onClose,
  trip
}) => {
  const Colors = useColors();

  if (!trip) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Review Details</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* TRIP INFORMATION CARD */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>TRIP INFORMATION</Text>
              <View style={styles.tripBadge}>
                <Text style={styles.tripBadgeText}>TRIP #{trip.id || '001'}</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Icon source="clock-outline" size={16} color="#666" />
                  </View>
                  <Text style={styles.infoText}>{trip.time || '09:00 AM'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}>
                    <Icon source="calendar" size={16} color="#666" />
                  </View>
                  <Text style={styles.infoText}>{trip.date || '09-AUG-2025'}</Text>
                </View>
              </View>

              <View style={styles.pickupContainer}>
                <View style={styles.infoIconContainer}>
                  <Icon source="map-marker" size={16} color="#666" />
                </View>
                <View style={styles.pickupTextContainer}>
                  <Text style={styles.pickupLabel}>Pickup</Text>
                  <Text style={styles.pickupAddress}>
                    {trip.pickup || '123 Main St, Oak Ave, Anytown'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* PASSENGER DETAILS CARD */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>PASSENGER DETAILS</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>
                  {trip.reviewBy || trip.passenger?.name || 'Ethan Miller'}
                </Text>
                <Text style={styles.passengerPhone}>
                  {trip.passengerPhone || '+16557987-6543'}
                </Text>
              </View>
            </View>
          </View>

          {/* REVIEW COMMENT CARD */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>REVIEW COMMENT</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>
                  {trip.reviewComment || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pharetra scelerisque auctor. Donec pellentesque elementum arcu a laoreet. Sed condimentum hendrerit.'}
                </Text>
              </View>
            </View>
          </View>

          {/* STAR RATING CARD */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>STAR RATING</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.ratingSection}>
                {/* Overall Rating */}
                <View style={styles.ratingItem}>
                  <Text style={styles.ratingLabel}>Overall Rating</Text>
                  <StarRating
                    rating={trip.overallRating || trip.rating || 0}
                    size={28}
                    showNumber={true}
                  />
                </View>


                {/* Review Date */}
                {trip.reviewDate && (
                  <View style={styles.reviewDateContainer}>
                    <Icon source="calendar-check" size={16} color="#666" />
                    <Text style={styles.reviewDateText}>
                      Reviewed on {trip.reviewDate}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    fontWeight: '700',
    color: '#007AFF',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Card Styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'Urbanist-ExtraBold',
    color: '#007AFF',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tripBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tripBadgeText: {
    fontSize: 10,
    fontFamily: 'Urbanist-ExtraBold',
    color: '#ffffff',
    fontWeight: '800',
  },
  cardContent: {
    padding: 16,
  },
  // Trip Information Styles
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
    color: '#666666',
    fontWeight: '600',
  },
  pickupContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pickupTextContainer: {
    flex: 1,
  },
  pickupLabel: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: '#666666',
    marginBottom: 2,
  },
  pickupAddress: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
    color: '#515151',
    fontWeight: '400',
    lineHeight: 20,
  },
  // Passenger Details Styles
  passengerInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  passengerName: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000000',
    fontWeight: '600',
  },
  passengerPhone: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666666',
  },
  // Review Comment Styles
  commentContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#000000',
    lineHeight: 20,
    textAlign: 'left',
  },
  // Rating Section Styles
  ratingSection: {
    gap: 16,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000000',
    fontWeight: '600',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    color: '#666666',
    marginLeft: 8,
  },
  reviewDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reviewDateText: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: '#666666',
  },
  // Footer Styles
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ReviewDetailsModal;