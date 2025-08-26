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
        status: 'upcoming',
      },
      {
        id: '002',
        time: '02:00 PM',
        date: '09-AUG-2025',
        pickupAddress: '789 Pine Ln. Oak Ave, Anytown',
        passengerName: 'Sarah Johnson',
        status: 'upcoming',
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
        status: 'upcoming',
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
      style={styles.tripItem}
      onPress={() => handleTripPress(item)}
    >
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripId}>TRIP #{item.id}</Text>
        </View>
        
        <View style={styles.tripDetails}>
          <View style={styles.timeDateRow}>
            <Icon source="clock-outline" size={16} color="#666" />
            <Text style={styles.timeText}>{item.time}</Text>
            
            <Icon source="calendar" size={16} color="#666" style={styles.dateIcon} />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          
          <View style={styles.pickupRow}>
            <Icon source="map-marker" size={16} color="#666" />
            <Text style={styles.pickupText}>Pickup : {item.pickupAddress}</Text>
          </View>
        </View>
      </View>
      
      <View style={[
        styles.statusIndicator,
        { backgroundColor: item.status === 'upcoming' ? '#FFA500' : '#4CAF50' }
      ]} />
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

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>Upcoming</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Completed</Text>
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterButtonActive: {
    borderBottomColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  listHeader: {
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  tripItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  tripContent: {
    flex: 1,
    padding: 16,
  },
  statusIndicator: {
    width: 6,
    backgroundColor: '#007AFF',
  },
  tripHeader: {
    marginBottom: 12,
  },
  tripId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tripDetails: {
    marginLeft: 4,
  },
  timeDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pickupText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
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