// src/screens/TripInformationScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { setTripDetails, updateMilestoneStatus, confirmTrip } from '../store/tripSlice';
import { fetchTripDetails } from '../store/tripActions';
import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';
import AddRequestModal from '../components/AddRequestModal';

const Colors = useColors();
const { width, height } = Dimensions.get('window');

const TripInformationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentTrip, loading, error } = useSelector(state => state.trip);
  const tripId = route.params?.tripId || route.params?.trip?.id;
  const [region, setRegion] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock coordinates for trip locations
  const pickupCoords = {
    latitude: 37.7749,
    longitude: -122.4194,
    title: "Pickup Location",
    description: "123 Main St, San Francisco"
  };

  const dropCoords = {
    latitude: 37.7849,
    longitude: -122.4094,
    title: "Drop Location",
    description: "456 Oak Ave, San Francisco"
  };

  const waypointCoords = [
    {
      latitude: 37.7799,
      longitude: -122.4144,
      title: "Waypoint 1",
      description: "Intermediate stop"
    },
    {
      latitude: 37.7829,
      longitude: -122.4124,
      title: "Waypoint 2",
      description: "Intermediate stop"
    }
  ];

  // Coordinates for the polyline route
  const routeCoordinates = [
    pickupCoords,
    ...waypointCoords,
    dropCoords
  ];

  useEffect(() => {
    if (tripId) {
      dispatch(fetchTripDetails(tripId));
    } else if (route.params?.trip) {
      dispatch(setTripDetails(route.params.trip));
    } else {
      navigation.goBack();
    }

    // Calculate region to fit all markers
    if (routeCoordinates.length > 0) {
      const coordinates = routeCoordinates;
      let minLat = coordinates[0].latitude;
      let maxLat = coordinates[0].latitude;
      let minLng = coordinates[0].longitude;
      let maxLng = coordinates[0].longitude;

      coordinates.forEach(coord => {
        minLat = Math.min(minLat, coord.latitude);
        maxLat = Math.max(maxLat, coord.latitude);
        minLng = Math.min(minLng, coord.longitude);
        maxLng = Math.max(maxLng, coord.longitude);
      });

      const latitudeDelta = (maxLat - minLat) * 1.5;
      const longitudeDelta = (maxLng - minLng) * 1.5;

      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta,
        longitudeDelta,
      });
    }
  }, [tripId, navigation, dispatch, route.params]);

  const handleConfirm = () => {
    dispatch(confirmTrip());
    navigation.navigate('VehicleReservation', {
      vehicle: {
        name: 'Xiaomi One-S Scooter',
        id: '#3451A',
        time: '06:43',
        price: '€1,43',
        battery: 85,
        location: {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      }
    });
  };

  const handleAddRequest = () => {
    setShowRequestModal(true);
  };

  const handleSubmitRequest = (requestData) => {
    console.log('Request submitted:', requestData);
    dispatch(confirmTrip());
    navigation.navigate('VehicleReservation', {
      vehicle: {
        name: 'Xiaomi One-S Scooter',
        id: '#3451A',
        time: '06:43',
        price: '€1,43',
        battery: 85,
        location: {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      }
    });
  };

  const handleCloseModal = () => {
    setShowRequestModal(false);
  };

  const renderMarker = (coordinate, index, isWaypoint = false) => (
    <Marker
      key={`marker-${index}`}
      coordinate={coordinate}
      title={coordinate.title}
      description={coordinate.description}
    >
      <View style={styles.markerContainer}>
        <IconButton
          icon={isWaypoint ? "circle-small" : (index === 0 ? "map-marker" : "flag")}
          size={isWaypoint ? 30 : 24}
          iconColor={index === 0 ? Colors.primary : Colors.secondary}
        />
        {!isWaypoint && (
          <View style={[
            styles.markerBadge,
            { backgroundColor: index === 0 ? Colors.primary : Colors.secondary }
          ]}>
            <Text style={styles.markerBadgeText}>
              {index === 0 ? 'P' : 'D'}
            </Text>
          </View>
        )}
      </View>
    </Marker>
  );

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

      {/* Add Request Modal */}
      <AddRequestModal
        visible={showRequestModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitRequest}
        tripDetails={currentTrip}
      />

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

        {/* Google Map */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Route</Text>

          <View style={styles.mapContainer}>
            {region && (
              <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                zoomEnabled={true}
                scrollEnabled={true}
                loadingEnabled={true}
              >
                {/* Draw route polyline */}
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor={Colors.primary}
                  strokeWidth={4}
                  lineDashPattern={[0]}
                />

                {/* Render pickup marker */}
                {renderMarker(pickupCoords, 0)}

                {/* Render waypoint markers */}
                {waypointCoords.map((coord, index) =>
                  renderMarker(coord, index + 1, true)
                )}

                {/* Render drop marker */}
                {renderMarker(dropCoords, routeCoordinates.length - 1)}
              </MapView>
            )}
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
                  <Text style={styles.address}>{ms.address}</Text>
                  <Text style={{color: '#A0A0A0', fontFamily: Fonts.urbanist.extraBold, fontSize: 11, fontWeight: '600'}}>{ms.time} | {ms.date} | {ms.region}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.urbanist.bold,
    color: Colors.primary,
    fontWeight: '700'
  },
  card: {
    backgroundColor: Colors.white,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    borderColor: Colors.border,
    borderWidth: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.extraBold,
    marginBottom: 8,
    color: Colors.primary,
    fontWeight: '800'
  },
  tripBadge: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontFamily: Fonts.urbanist.extraBold,
    color: Colors.primary,
    fontWeight: '800'
  },
  pickupText: {
    marginTop: 8,
    fontFamily: Fonts.urbanist.regular,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary
  },
  mapContainer: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  markerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    marginTop: 6,
    fontFamily: Fonts.urbanist.semiBold,
    fontWeight: '400',
    color: '#515151',
  },
  passengerName: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.medium,
    marginBottom: 4,
    fontWeight: '500',
    color: Colors.primary
  },
  milestone: {
    marginVertical: 6
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: Fonts.urbanist.bold,
    color: Colors.white
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontFamily: Fonts.urbanist.regular,
    color: Colors.textSecondary,
  },
  errorText: {
    marginBottom: 12,
    color: Colors.error,
    fontFamily: Fonts.urbanist.medium,
  },
});

export default TripInformationScreen;