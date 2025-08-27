import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setTripDetails, updateMilestoneStatus, confirmTrip } from '../store/tripSlice';
import { fetchTripDetails } from '../store/tripActions';
import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';

const Colors = useColors();

const TripInformationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentTrip, loading, error } = useSelector(state => state.trip);
  const tripId = route.params?.tripId || route.params?.trip?.id;

  useEffect(() => {
    if (tripId) {
      dispatch(fetchTripDetails(tripId));
    } else if (route.params?.trip) {
      dispatch(setTripDetails(route.params.trip));
    } else {
      navigation.goBack();
    }
  }, [tripId, navigation, dispatch, route.params]);

  const handleConfirm = () => {
    dispatch(confirmTrip());
    navigation.goBack();
  };

  const handleAddRequest = () => {
    //navigation.navigate('AddRequest', { tripId: currentTrip?.id });
  };

  if (loading) {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.primary }]} onPress={() => tripId && dispatch(fetchTripDetails(tripId))}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentTrip) {
    return (
      <View style={styles.centered}>
        <Text>No trip data available</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.gray200 }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText, { color: Colors.black }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const milestones = currentTrip.milestones || [
    { id: '1', address: '123 Main St, Oak Ave, Anytown', time: '10:00 AM', date: '09-AUG-2025', region: 'Milestone 1' },
    { id: '2', address: '123 Main St, Oak Ave, Anytown', time: '04:30 PM', date: '09-AUG-2025', region: 'Milestone 2' },
    { id: '3', address: '123 Main St, Oak Ave, Anytown', time: '08:30 PM', date: '09-AUG-2025', region: 'Milestone 3' },
    { id: '4', address: '123 Main St, Oak Ave, Anytown', time: '03:30 AM', date: '10-AUG-2025', region: 'Milestone 4' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>

      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Trip Details</Text>
        <IconButton icon="bell-outline" size={24} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Trip Info */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>TRIP INFORMATION</Text>
            <Text style={styles.tripBadge}>TRIP #{currentTrip.id || '001'}</Text>
          </View>
          <View style={[styles.row]}>
            <IconButton icon="clock-outline" size={13} iconColor={Colors.primaryLight} />
            <Text style={{color: '#A0A0A0', fontFamily: Fonts.urbanist.extraBold, fontSize: 11, fontWeight: '600'}}>{currentTrip.time || '09:00 AM'}</Text>
          </View>
          <View style={styles.row}>
            <IconButton icon="calendar" size={13} iconColor={Colors.primaryLight} />
            <Text style={{color: '#A0A0A0', fontFamily: Fonts.urbanist.extraBold, fontSize: 11, fontWeight: '600'}}>{currentTrip.date || '09-AUG-2025'}</Text>
          </View>
          <Text style={styles.pickupText}>Pickup: {currentTrip.pickupAddress}</Text>
        </View>

        {/* Map Placeholder */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: Colors.gray600 }}>Map View Placeholder</Text>
          </View>
          <Text style={styles.address}>{currentTrip.pickupAddress}</Text>
        </View>

        {/* Passenger */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PASSENGER DETAILS</Text>
          <Text style={styles.passengerName}>{currentTrip.passengerName || 'Ethan Miller'}</Text>
          <View style={styles.rowBetween}>
            <Text style={{fontSize : 13, color: '#878787', fontFamily: Fonts.urbanist.regular, fontWeight: '400'}}>{currentTrip.passengerPhone || '+1 (555) 987-6543'}</Text>
            <View style={styles.iconrow}>
              <IconButton icon="phone" size={17} iconColor={Colors.primaryLight} />
              <IconButton icon="message-text" size={17} iconColor={Colors.primaryLight}/>
            </View>
          </View>
        </View>

        {/* Trip Locations */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>TRIP LOCATIONS</Text>
          {milestones.map(ms => (
            <View key={ms.id} style={styles.milestone}>
              <View style={styles.row}>
                <IconButton icon="navigation-variant" size={15} iconColor={Colors.primaryLight} />
                <View>
                  <Text>{ms.address}</Text>
                  <Text>{ms.time} | {ms.date} | {ms.region}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.gray100 }]} onPress={handleAddRequest}>
          <Text style={[styles.buttonText, { color: Colors.primary }]}>Add Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.primary }]} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8 },
  headerTitle: { fontSize: 20, fontFamily: Fonts.urbanist.bold , color: '#3B63AA', fontWeight: '700'},
  card: { backgroundColor: '#fff', margin: 12, padding: 16, borderRadius: 5, elevation: 2, borderColor: '#E5E7EB', borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', },
  iconrow: { flexDirection: 'row', alignItems: 'flex-start', },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 12, fontFamily: Fonts.urbanist.extraBold, marginBottom: 8, color: Colors.primary, fontWeight: '800' },
  tripBadge: { backgroundColor: '#eee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, 
       fontSize: 12, fontFamily: Fonts.urbanist.extraBold, color: Colors.primary, fontWeight: '800' },
  pickupText: { marginTop: 8, fontFamily: Fonts.urbanist.regular, fontSize: 14, fontWeight: '400', color: '#A0A0A0' },
  mapPlaceholder: { backgroundColor: '#f5f5f5', borderRadius: 10, height: 120, justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  address: { fontSize: 14, marginTop: 6, fontFamily: Fonts.urbanist.regular, fontWeight: '400', color: '#A0A0A0' },
  passengerName: { fontSize: 16, fontFamily: Fonts.urbanist.medium, marginBottom: 4, fontWeight: '500', color: '#3B63AA' },
  milestone: { marginVertical: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  button: { flex: 1, marginHorizontal: 4, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontFamily: Fonts.urbanist.bold, color: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10 },
  errorText: { marginBottom: 12, color: 'red' },
});

export default TripInformationScreen;
