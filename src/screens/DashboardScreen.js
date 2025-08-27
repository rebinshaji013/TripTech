import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Icon } from 'react-native-paper'; // ✅ using react-native-paper icons

import { useDispatch, useSelector } from 'react-redux';
import { fetchTodaysTrips, searchTrips } from '../store/tripActions';

import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';
import CommonHeader from '../components/CommonHeader';

const colors = useColors();

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { todaysTrips, loading, error } = useSelector(state => state.trip);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  useEffect(() => {
    dispatch(fetchTodaysTrips());
  }, [dispatch]);

  const handleSearch = (text) => {
    setSearchTerm(text);
    dispatch(searchTrips(text));
  };

  const handleNotificationPress = () => {
    //navigation.navigate('Notifications');
  };

  const handleTripPress = (trip) => {
    navigation.navigate('TripInformation', { trip });
  };

  const handleFilterPress = () => {
    setShowFilters(!showFilters);
  };

  const applyFilter = (filterType) => {
    setFilter(filterType);
    setShowFilters(false);
    // You can implement filter logic here or dispatch a filter action
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    // You can implement sorting logic here
  };

  if (loading && todaysTrips.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading trips...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Logo & App Name */}
      <CommonHeader onNotificationPress={handleNotificationPress} />

      {/* Search Bar with Filter Icon */}
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
            style={[styles.filterOption, filter === 'all' && styles.filterOptionActive]}
            onPress={() => applyFilter('all')}
          >
            <Text style={[styles.filterOptionText, filter === 'all' && styles.filterOptionTextActive]}>
              All Trips
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, filter === 'upcoming' && styles.filterOptionActive]}
            onPress={() => applyFilter('upcoming')}
          >
            <Text style={[styles.filterOptionText, filter === 'upcoming' && styles.filterOptionTextActive]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterOption, filter === 'completed' && styles.filterOptionActive]}
            onPress={() => applyFilter('completed')}
          >
            <Text style={[styles.filterOptionText, filter === 'completed' && styles.filterOptionTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.divider} />

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Icon source="alert-circle" size={20} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Today's Trip List Section with Sort Icon */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Trip List</Text>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Icon 
            source={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'} 
            size={20} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" style={styles.loadingIndicator} />
      ) : null}

      {todaysTrips.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon source="car-off" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No trips found</Text>
        </View>
      ) : (
        todaysTrips.map((trip) => (
          <TouchableOpacity 
            key={trip.id}
            style={styles.tripCard}
            onPress={() => handleTripPress(trip)}
          >
            {/* Status Container - Top Right Corner */}
            <View style={[
              styles.statusContainer,
              { 
                backgroundColor: trip.status === 'pending' ? colors.success : 
                                trip.status === 'upcoming' ? colors.error :
                                trip.status === 'on-trip' ? colors.warning :
                                colors.primaryLight 
              }
            ]}>
              <Text style={styles.statusText}>
                {trip.status === 'pending' ? 'Completed' :
                 trip.status === 'upcoming' ? 'Cancelled' :
                 trip.status === 'on-trip' ? 'on-trip' : 'Upcoming'}
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
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 18,
    fontFamily: Fonts.urbanist.semiBold,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 10,
  },
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
  },
  filterOptionTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.extraBold,
    fontWeight: '800',
    color: colors.primary,
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECEC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default DashboardScreen;