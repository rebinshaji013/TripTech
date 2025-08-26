import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Checkbox, Icon } from 'react-native-paper'; // ✅ use Paper components
import { useDispatch, useSelector } from 'react-redux';
import { setTripDetails, updateMilestoneStatus, confirmTrip } from '../store/tripSlice';
import { fetchTripDetails } from '../store/tripActions';

const TripInformationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentTrip, loading, error } = useSelector(state => state.trip);
  const tripId = route.params?.tripId || route.params?.trip?.id;

  useEffect(() => {
    if (tripId) {
      // Fetch trip details if we have a trip ID
      dispatch(fetchTripDetails(tripId));
    } else if (route.params?.trip) {
      // Set trip details directly if passed through params
      dispatch(setTripDetails(route.params.trip));
    } else {
      // If no trip data, navigate back
      navigation.goBack();
    }
  }, [tripId, navigation, dispatch, route.params]);

  const handleCheckboxToggle = (milestoneId, currentlyChecked) => {
    dispatch(updateMilestoneStatus({
      milestoneId,
      checked: !currentlyChecked
    }));
  };

  const handleConfirm = () => {
    dispatch(confirmTrip());
    navigation.goBack();
  };

  const handleAddRequest = () => {
    navigation.navigate('AddRequest', { tripId: currentTrip?.id });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Icon source="alert-circle" size={48} color="#FF3B30" /> 
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => tripId && dispatch(fetchTripDetails(tripId))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentTrip) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>No trip data available</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Trip Details</Text>
        
        <Text style={styles.sectionHeader}>TRIP INFORMATION</Text>
        <View style={styles.timeContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={'unchecked'}
              onPress={() => {}}
              color="#007AFF"
            />
            <Text style={styles.timeText}>{currentTrip.time || '09:00 AM'}</Text>
          </View>
          
          <View style={styles.checkboxRow}>
            <Checkbox
              status={'checked'}
              onPress={() => {}}
              color="#007AFF"
            />
            <Text style={styles.timeText}>{currentTrip.date || '09-AUG-2025'}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <Text style={styles.subHeader}>Pickup: {currentTrip.pickupAddress}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionHeader}>Pickup Location</Text>
        <Text style={styles.address}>{currentTrip.pickupAddress}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionHeader}>PASSENGER DETAILS</Text>
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerName}>{currentTrip.passengerName}</Text>
          <View style={styles.phoneRow}>
            <Icon source="phone" size={16} color="#555" /> 
            <Text style={styles.phoneNumber}>{currentTrip.phoneNumber}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionHeader}>TRIP LOCATIONS</Text>
        
        {currentTrip.milestones && currentTrip.milestones.map((milestone) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            onToggle={handleCheckboxToggle}
          />
        ))}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.addRequestButton]}
            onPress={handleAddRequest}
          >
            <Text style={styles.addRequestButtonText}>Add Request</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const MilestoneItem = ({ milestone, onToggle }) => {
  return (
    <View style={styles.milestone}>
      <View style={styles.milestoneHeader}>
        <Checkbox
          status={milestone.checked ? 'checked' : 'unchecked'}
          onPress={() => onToggle(milestone.id, milestone.checked)}
          color="#007AFF"
        />
        <Text style={styles.milestoneAddress}>{milestone.address}</Text>
      </View>
      
      <View style={styles.milestoneDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>{milestone.time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{milestone.date}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Region:</Text>
          <Text style={styles.detailValue}>{milestone.region}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333', textTransform: 'uppercase' },
  timeContainer: { marginBottom: 8 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timeText: { marginLeft: 8, fontSize: 16, color: '#555' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 16 },
  subHeader: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  address: { fontSize: 16, color: '#555', marginBottom: 8 },
  passengerInfo: { marginBottom: 8 },
  passengerName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  phoneNumber: { fontSize: 16, color: '#555', marginLeft: 4 },
  milestone: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginBottom: 12 },
  milestoneHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  milestoneAddress: { marginLeft: 8, fontSize: 16, color: '#555', flex: 1, fontWeight: 'bold' },
  milestoneDetails: { marginLeft: 40 },
  detailRow: { flexDirection: 'row', marginBottom: 6 },
  detailLabel: { fontSize: 14, color: '#666', width: 60, fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#555', flex: 1 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 8 },
  addRequestButton: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  confirmButton: { backgroundColor: '#007AFF' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  addRequestButtonText: { fontSize: 16, fontWeight: '600', color: '#333' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { marginTop: 10, fontSize: 16, color: '#FF3B30', textAlign: 'center', marginHorizontal: 20 },
  retryButton: { marginTop: 20, backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  backButton: { marginTop: 20, backgroundColor: '#f0f0f0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: '#333', fontWeight: 'bold' },
});

export default TripInformationScreen;
