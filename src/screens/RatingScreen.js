// src/screens/RatingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTrips,
  updateTripStatus,
  updateMilestoneStatus
} from '../store/tripSlice';
import { Icon } from 'react-native-paper';
import CommonHeader from '../components/CommonHeader';
import ReviewDetailsModal from '../components/ReviewDetailsModal';

const { width } = Dimensions.get('window');

// Define colors if not already defined
const colors = {
  primary: '#007AFF',
  primaryLight: '#666',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

// Define Fonts if not already defined
const Fonts = {
  urbanist: {
    extraBold: 'Urbanist-Bold',
    semiBold: 'Urbanist-SemiBold',
    medium: 'Urbanist-Medium',
    regular: 'Urbanist-Regular',
  }
};

// Star Rating Component
const StarRating = ({ rating, maxStars = 5, size = 16, showNumber = false }) => {
  return (
    <View style={styles.starContainer}>
      {[...Array(maxStars)].map((_, index) => (
        <Icon
          key={index}
          source={index < rating ? "star" : "star-outline"}
          size={size}
          color={ "#FFD700"}
        />
      ))}
      {showNumber && (
        <Text style={styles.ratingNumber}>({rating}.0)</Text>
      )}
    </View>
  );
};

const RatingScreen = () => {
  const dispatch = useDispatch();
  const { trips } = useSelector(state => state.trip);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Initialize with sample trip review data if empty
  useEffect(() => {
    const sampleTrips = [
      {
        id: '001',
        time: '02:20 PM',
        date: '09-AUG-2025',
        reviewBy: 'Graham Moss',
        dateChecked: true,
        timeChecked: true,
        status: 'completed',
        passenger: { name: 'Graham Moss' },
        rating: 5,
        reviewComment: 'Excellent service! Very professional and punctual.',
        reviewDate: '10-AUG-2025',
        driverRating: 5,
        vehicleRating: 5,
        overallRating: 5,
        pickup: '123 Main St, Anytown',
        passengerPhone: '+16557987-6543'
      },
      {
        id: '002',
        time: '10:00 AM',
        date: '08-AUG-2025',
        reviewBy: 'Alice Pierce',
        dateChecked: true,
        timeChecked: true,
        status: 'completed',
        passenger: { name: 'Alice Pierce' },
        rating: 4,
        reviewComment: 'Good ride, but took a slightly longer route.',
        reviewDate: '09-AUG-2025',
        driverRating: 4,
        vehicleRating: 5,
        overallRating: 4,
        pickup: '456 Oak Ave, Somewhere',
        passengerPhone: '+16557987-6543'
      },
      {
        id: '003',
        time: '04:00 PM',
        date: '06-AUG-2025',
        reviewBy: 'Elfran Miller',
        dateChecked: true,
        timeChecked: true,
        status: 'completed',
        passenger: { name: 'Elfran Miller' },
        rating: 3,
        reviewComment: 'Average experience. Car could be cleaner.',
        reviewDate: '07-AUG-2025',
        driverRating: 3,
        vehicleRating: 2,
        overallRating: 3,
        pickup: '789 Pine St, Nowhere',
        passengerPhone: '+16557987-6543'
      },
      {
        id: '004',
        time: '07:00 PM',
        date: '05-AUG-2025',
        reviewBy: 'Sarah Johnson',
        dateChecked: true,
        timeChecked: true,
        status: 'completed',
        passenger: { name: 'Sarah Johnson' },
        rating: 5,
        reviewComment: 'Outstanding service! Very comfortable and safe ride.',
        reviewDate: '06-AUG-2025',
        driverRating: 5,
        vehicleRating: 5,
        overallRating: 5,
        pickup: '321 Elm St, Everywhere',
        passengerPhone: '+16557987-6543'
      },
    ];
    dispatch(setTrips(sampleTrips));
  }, [dispatch]);

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleFilterPress = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    setShowFilters(false);
  };

  const handleTripPress = (trip) => {
    // Set selected trip and show modal
    setSelectedTrip(trip);
    setShowReviewModal(true);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedTrip(null);
  };

  const filteredTrips = trips.filter(trip => {
    // Search filter
    const matchesSearch =
      trip.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.reviewBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.passenger?.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'reviewed' && trip.timeChecked) ||
      (activeFilter === 'pending' && !trip.timeChecked);

    return matchesSearch && matchesFilter;
  });

  // Calculate average rating
  const averageRating = trips.length > 0
    ? (trips.reduce((sum, trip) => sum + (trip.rating || 0), 0) / trips.length).toFixed(1)
    : '0.0';

  return (
    <View style={styles.container}>
      <CommonHeader onNotificationPress={handleNotificationPress} />

      {/* Review Details Modal */}
      <ReviewDetailsModal
        visible={showReviewModal}
        onClose={handleCloseModal}
        trip={selectedTrip}
      />

      {/* Search and Filter Container */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Icon source="magnify" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by trip ID or passenger..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={handleSearch}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Icon source="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Icon
            source="tune-variant"
            size={24}
            color={showFilters ? colors.primary : '#666'}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              activeFilter === 'all' && styles.filterOptionActive
            ]}
            onPress={() => handleFilterSelect('all')}
          >
            <Text style={[
              styles.filterOptionText,
              activeFilter === 'all' && styles.filterOptionTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              activeFilter === 'reviewed' && styles.filterOptionActive
            ]}
            onPress={() => handleFilterSelect('reviewed')}
          >
            <Text style={[
              styles.filterOptionText,
              activeFilter === 'reviewed' && styles.filterOptionTextActive
            ]}>
              Reviewed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              activeFilter === 'pending' && styles.filterOptionActive
            ]}
            onPress={() => handleFilterSelect('pending')}
          >
            <Text style={[
              styles.filterOptionText,
              activeFilter === 'pending' && styles.filterOptionTextActive
            ]}>
              Pending
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.tripList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Trip Review List</Text>

        {filteredTrips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.tripCard}
            onPress={() => handleTripPress(trip)}
          >
            {/* Status Container - Top Right Corner */}
            <View style={[
              styles.statusContainer,
              {
                backgroundColor: colors.success
              }
            ]}>
              <Text style={styles.statusText}>
                {trip.rating ? 'Rated' : 'Completed'}
              </Text>
            </View>

            <View style={styles.tripHeader}>
              <Text style={styles.tripId}>TRIP #{trip.id}</Text>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.timeDateRow}>
                <Icon source="clock-outline" size={13} color={colors.primaryLight} />
                <Text style={styles.timeText}>{trip.time}</Text>
              </View>
              <View style={styles.timeDateRow}>
                <Icon source="calendar" size={13} color={colors.primaryLight} style={styles.dateIcon} />
                <Text style={styles.dateText}>{trip.date}</Text>
              </View>

              <View style={styles.pickupRow}>
                <Icon source="map-marker" size={13} color={colors.primaryLight} />
                <Text style={styles.pickupText}>Pickup: {trip.pickup}</Text>
              </View>

              {/* Review By */}
              <View style={styles.reviewContainer}>
                <Text style={styles.reviewLabel}>Review By :</Text>
                <Text style={styles.reviewerName}>
                  {trip.reviewBy || trip.passenger?.name}
                </Text>
              </View>

              {/* Rating Display */}
              {trip.rating && (
                <View style={styles.ratingDisplay}>
                  <View style={styles.ratingRowCompact}>
                    <Text style={styles.ratingLabel}>Overall Rating</Text>
                    <StarRating rating={trip.overallRating || trip.rating} size={14} showNumber={true} />
                  </View>
                </View>
              )}

              {/* No Rating Message */}
              {!trip.rating && (
                <View style={styles.noRatingContainer}>
                  <Text style={styles.noRatingText}>
                    No rating provided
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  sectionTitle: {
     fontSize: 16,
     fontFamily: Fonts.urbanist.extraBold,
     fontWeight: '800',
     color: colors.primary,
     marginBottom: 20,
  },
  // Rating Summary Styles
  ratingSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingOverview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  averageRating: {
    fontSize: 32,
    fontFamily: Fonts.urbanist.extraBold,
    color: '#333',
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 14,
    fontFamily: Fonts.urbanist.medium,
    color: '#666',
    marginTop: 4,
  },
  ratingBreakdown: {
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starText: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.medium,
    color: '#666',
    width: 50,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingCount: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.medium,
    color: '#666',
    width: 20,
    textAlign: 'right',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.medium,
    color: '#666',
    marginLeft: 4,
  },
  // Trip Card Styles
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    position: 'relative',
  },
  statusContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: Fonts.urbanist.extraBold,
  },
  tripHeader: {
    marginBottom: 12,
  },
  tripId: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.extraBold,
    fontWeight: '800',
    color: colors.primary,
  },
  tripDetails: {
    marginLeft: 4,
    flexDirection: 'column',
  },
  timeDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 5,
  },
  timeText: {
    fontSize: 11,
    color: '#666',
    fontFamily: Fonts.urbanist.semiBold,
    marginLeft: 4,
    marginRight: 16,
  },
  dateIcon: {
    marginLeft: 16,
  },
  dateText: {
    fontSize: 11,
    color: '#666',
    fontFamily: Fonts.urbanist.semiBold,
    marginLeft: 4,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 5,
  },
  pickupText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Fonts.urbanist.semiBold,
    marginLeft: 4,
    flex: 1,
    flexWrap: 'wrap',
  },
  // Review and Rating Styles
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.semiBold,
    color: '#333',
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.medium,
    color: colors.primary,
  },
  ratingDisplay: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ratingRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.semiBold,
    color: '#333',
  },
  commentContainer: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.regular,
    color: '#555',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  reviewDate: {
    fontSize: 10,
    fontFamily: Fonts.urbanist.medium,
    color: '#999',
    textAlign: 'right',
  },
  noRatingContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    alignItems: 'center',
  },
  noRatingText: {
    fontSize: 11,
    fontFamily: Fonts.urbanist.medium,
    color: '#999',
    fontStyle: 'italic',
  },
  // Search and Filter Styles
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    fontFamily: Fonts.urbanist.regular,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOptions: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    fontFamily: Fonts.urbanist.medium,
  },
  filterOptionTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: Fonts.urbanist.extraBold,
  },
  tripList: {
    flex: 1,
  },
});

export default RatingScreen;