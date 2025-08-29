import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { setTripDetails, updateMilestoneStatus, confirmTrip } from '../store/tripSlice';
import { fetchTripDetails } from '../store/tripActions';
import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';

const Colors = useColors();
const { width, height } = Dimensions.get('window');

const TripInformationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentTrip, loading, error } = useSelector(state => state.trip);
  const tripId = route.params?.tripId || route.params?.trip?.id;
  const mapRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (tripId) {
      dispatch(fetchTripDetails(tripId));
    } else if (route.params?.trip) {
      dispatch(setTripDetails(route.params.trip));
    } else {
      navigation.goBack();
    }
  }, [tripId, navigation, dispatch, route.params]);

  // Mock coordinates for pickup and drop locations
  const pickupCoords = {
    latitude: 8.5735,
    longitude: 76.8643,
  };

  const dropCoords = {
    latitude: 8.4870,
    longitude: 76.9526,
  };


  const handleConfirm = () => {
    dispatch(confirmTrip());
    navigation.goBack();
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
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.primary }]}
          onPress={() => tripId && dispatch(fetchTripDetails(tripId))}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentTrip) {
    return (
      <View style={styles.centered}>
        <Text>No trip data available</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.gray200 }]}
          onPress={() => navigation.goBack()}
        >
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
            <Text style={{ color: '#A0A0A0', fontFamily: Fonts.urbanist.extraBold, fontSize: 11, fontWeight: '600' }}>
              {currentTrip.time || '09:00 AM'}
            </Text>
          </View>
          <View style={[styles.row]}>
            <IconButton icon="calendar" size={13} iconColor={Colors.primaryLight} />
            <Text style={{ color: '#A0A0A0', fontFamily: Fonts.urbanist.extraBold, fontSize: 11, fontWeight: '600' }}>
              {currentTrip.date || '09-AUG-2025'}
            </Text>
          </View>
          <Text style={styles.pickupText}>Pickup: {currentTrip.pickupAddress}</Text>
        </View>

        {/* Google Map */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Route</Text>

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              zoomEnabled={true}
              scrollEnabled={true}
              onMapReady={() => {
                mapRef.current?.fitToCoordinates([pickupCoords, dropCoords], {
                  edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                  animated: true,
                });
              }}
            >
              <Marker
                coordinate={pickupCoords}
                title="Pickup Location"
                description={currentTrip.pickupAddress}
                pinColor={Colors.primary}
              />
              <Marker
                coordinate={dropCoords}
                title="Drop Location"
                description="Destination address"
                pinColor={Colors.secondary}
              />
              <Polyline
                coordinates={[pickupCoords, dropCoords]}
                strokeColor={Colors.primary}
                strokeWidth={4}
              />
            </MapView>
          </View>
          <Text style={styles.address}>{currentTrip.pickupAddress}</Text>
        </View>

        {/* Passenger */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PASSENGER DETAILS</Text>
          <Text style={styles.passengerName}>{currentTrip.passengerName || 'Ethan Miller'}</Text>
          <View style={styles.rowBetween}>
            <Text
              style={{
                fontSize: 13,
                color: '#878787',
                fontFamily: Fonts.urbanist.regular,
                fontWeight: '400',
              }}
            >
              {currentTrip.passengerPhone || '+1 (555) 987-6543'}
            </Text>
            <View style={styles.iconrow}>
              <IconButton icon="phone" size={17} iconColor={Colors.primaryLight} />
              <IconButton icon="message-text" size={17} iconColor={Colors.primaryLight} />
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
                  <Text style={styles.address}>{ms.address}</Text>
                  <Text
                    style={{
                      color: '#A0A0A0',
                      fontFamily: Fonts.urbanist.extraBold,
                      fontSize: 11,
                      fontWeight: '600',
                    }}
                  >
                    {ms.time} | {ms.date} | {ms.region}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.gray100 }]}
          onPress={() => {}}
        >
          <Text style={[styles.buttonText, { color: Colors.primary }]}>Add Request</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.primary }]}
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.background },
  headerTitle: { fontSize: 20, fontFamily: Fonts.urbanist.bold, color: Colors.primary, fontWeight: '700' },
  card: { backgroundColor: Colors.white, margin: 12, padding: 12, borderRadius: 12, elevation: 2, borderColor: Colors.border, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconrow: { flexDirection: 'row', alignItems: 'flex-start' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 12, fontFamily: Fonts.urbanist.extraBold, marginBottom: 8, color: Colors.primary, fontWeight: '800' },
  tripBadge: { backgroundColor: Colors.gray100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontFamily: Fonts.urbanist.extraBold, color: Colors.primary, fontWeight: '800' },
  pickupText: { marginTop: 8, fontFamily: Fonts.urbanist.regular, fontSize: 14, fontWeight: '400', color: Colors.textSecondary },
  mapContainer: { height: 200, borderRadius: 10, overflow: 'hidden', marginVertical: 8 },
  map: { width: '100%', height: '100%' },
  address: { fontSize: 14, marginTop: 6, fontFamily: Fonts.urbanist.semiBold, fontWeight: '400', color: '#515151' },
  passengerName: { fontSize: 16, fontFamily: Fonts.urbanist.medium, marginBottom: 4, fontWeight: '500', color: Colors.primary },
  milestone: { marginVertical: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  button: { flex: 1, marginHorizontal: 4, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontFamily: Fonts.urbanist.bold, color: Colors.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontFamily: Fonts.urbanist.regular, color: Colors.textSecondary },
  errorText: { marginBottom: 12, color: Colors.error, fontFamily: Fonts.urbanist.medium },
});

export default TripInformationScreen;
