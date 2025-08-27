import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList 
} from 'react-native';
import { Icon } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setTrips, setCurrentTrip, setLoading, setError } from '../store/tripSlice';
import { fetchTripDetails } from '../store/tripActions';
import CommonHeader from '../components/CommonHeader';

import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';

const Colors = useColors();

const TripsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { trips, loading, error } = useSelector(state => state.trip);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'

  useEffect(() => {
    // Mock data - replace with API call
    const mockTrips = [
      {
        id: '001',
        time: '09:00 AM',
        date: '09-AUG-2025',
        pickupAddress: '123 Main St. Oak Ave, Anytown',
        passengerName: 'Ethan Miller',
        status: 'cancelled',
      },
      {
        id: '002',
        time: '02:00 PM',
        date: '09-AUG-2025',
        pickupAddress: '789 Pine Ln. Oak Ave, Anytown',
        passengerName: 'Sarah Johnson',
        status: 'cancelled',
      },
      {
        id: '003',
        time: '07:00 PM',
        date: '09-AUG-2025',
        pickupAddress: '456 Oak Ave. Main St. Anytown',
        passengerName: 'Michael Brown',
        status: 'completed',
      },
      {
        id: '004',
        time: '05:00 PM',
        date: '09-AUG-2025',
        pickupAddress: '321 Maple St. Pine Ave, Anytown',
        passengerName: 'Emily Davis',
        status: 'cancelled',
      },
    ];
    
    dispatch(setTrips(mockTrips));
  }, [dispatch]);

  const handleTripPress = (trip) => {
    dispatch(setCurrentTrip(trip));
    navigation.navigate('TripInformation', { tripId: trip.id });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    // Implement search functionality if needed
  };

  const handleNotificationPress = () => {};

  const filteredTrips = trips.filter(trip => {
    // Filter by status
    if (filter === 'upcoming' && trip.status !== 'upcoming') return false;
    if (filter === 'completed' && trip.status !== 'completed') return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        trip.id.toLowerCase().includes(searchLower) ||
        trip.passengerName.toLowerCase().includes(searchLower) ||
        trip.pickupAddress.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const renderTripItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.tripCard, { backgroundColor: Colors.white }]}
      onPress={() => handleTripPress(item)}
    >
      {/* Status Container - Top Right Corner */}
      <View style={[
        styles.statusContainer,
        { 
          backgroundColor: item.status === 'completed' ? Colors.success : 
                          item.status === 'cancelled' ? Colors.error :
                          item.status === 'upcoming' ? Colors.warning :
                          Colors.primaryLight 
        }
      ]}>
        <Text style={styles.statusText}>
          {item.status === 'completed' ? 'Completed' :
           item.status === 'cancelled' ? 'Cancelled' :
           item.status === 'upcoming' ? 'On Trip' : 'Upcoming'}
        </Text>
      </View>

      <View style={styles.tripHeader}>
        <Text style={[styles.tripId, { color: Colors.primary }]}>TRIP #{item.id}</Text>
      </View>
      
      <View style={styles.tripDetails}>
        <View style={styles.timeDateRow}>
          <Icon source="clock-outline" size={13} color={Colors.primaryLight} />
          <Text style={[styles.timeText, { color: Colors.gray600 }]}>{item.time}</Text>
        </View>
        
        <View style={styles.timeDateRow}>
          <Icon source="calendar" size={13} color={Colors.primaryLight} style={styles.dateIcon} />
          <Text style={[styles.dateText, { color: Colors.gray600 }]}>{item.date}</Text>
        </View>
        
        <View style={styles.pickupRow}>
          <Icon source="map-marker" size={13} color={Colors.primaryLight} />
          <Text style={[styles.pickupText, { color: Colors.gray600 }]}>Pickup: {item.pickupAddress}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && trips.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CommonHeader onNotificationPress={handleNotificationPress} />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon source="magnify" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by trip ID or passenger...."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={handleSearch}
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Icon source="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterButtonText, 
            filter === 'all' && styles.filterButtonTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filter === 'upcoming' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[
            styles.filterButtonText, 
            filter === 'upcoming' && styles.filterButtonTextActive
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filter === 'completed' && styles.filterButtonActive
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[
            styles.filterButtonText, 
            filter === 'completed' && styles.filterButtonTextActive
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Icon source="alert-circle" size={20} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Trip List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>My Trips List</Text>
      </View>

      {/* Trip List */}
      {filteredTrips.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon source="car-off" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No trips found</Text>
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={filteredTrips}
          renderItem={renderTripItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listHeader: {
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.extraBold,
    fontWeight: '800',
    color: Colors.primary,
  },
  listContent: {
    paddingBottom: 20,
  },
  tripCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 2,
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
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.urbanist.bold,
    textTransform: 'uppercase',
  },
  tripHeader: {
    marginBottom: 12,
  },
  tripId: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.extraBold,
    fontWeight: '800',
    color: Colors.primary,
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
    fontFamily: Fonts.urbanist.semiBold,
    marginLeft: 4,
    marginRight: 16,
  },
  dateText: {
    fontSize: 11,
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
    fontFamily: Fonts.urbanist.semiBold,
    marginLeft: 4,
    flex: 1,
    flexWrap: 'wrap',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 10,
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  clearSearchText: {
    fontSize: 14,
    color: '#007AFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECEC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
});

export default TripsScreen;