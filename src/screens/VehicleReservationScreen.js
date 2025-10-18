// src/screens/VehicleReservationScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { setVehicleReservation, startVehicleRide, releaseVehicle } from '../store/tripSlice';
import { Icon } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// Define colors
const colors = {
  primary: '#007AFF',
  background: '#ffffff',
  text: '#000000',
  textLight: '#666666',
  border: '#e0e0e0',
  success: '#4CAF50',
};

const Fonts = {
  urbanist: {
    bold: 'Urbanist-Bold',
    semiBold: 'Urbanist-SemiBold',
    medium: 'Urbanist-Medium',
    regular: 'Urbanist-Regular',
  }
};

const VehicleReservationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { currentTrip } = useSelector(state => state.trip);

  // Get vehicle data from route params or use default
  const vehicleData = route.params?.vehicle || {
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
  };

  // Set vehicle reservation when component mounts
  React.useEffect(() => {
    dispatch(setVehicleReservation({
      vehicle: vehicleData,
      reservationTime: new Date().toISOString(),
      status: 'reserved'
    }));
  }, [dispatch, vehicleData]);

  const handleRelease = () => {
    console.log('Release vehicle');
    dispatch(releaseVehicle());
    navigation.goBack();
  };

  const handleStartRide = (type = 'pickup') => {
    console.log('Start ride');
    dispatch(startVehicleRide());
    navigation.navigate('LocationSearch', {
        locationType: type
      });
    // Navigate to active ride screen
    // navigation.navigate('ActiveRide');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={vehicleData.location}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
        >
          <Marker
            coordinate={vehicleData.location}
            title={vehicleData.name}
            description={vehicleData.id}
          >
            <View style={styles.markerContainer}>
              <Icon source="scooter" size={24} color={colors.primary} />
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        {/* Reservation Info */}

        {/*<View style={styles.reservationSection}>
          <Text style={styles.reservationTitle}>You reserved a vehicle</Text>
          <Text style={styles.priceText}>Your price is {vehicleData.price} by now</Text>
        </View>*/}

        <View style={styles.divider} />

        {/* Vehicle Details */}
        <View style={styles.vehicleSection}>
          <View style={styles.vehicleHeader}>
            <View style={styles.vehicleIcon}>
              <Icon source="scooter" size={24} color={colors.primary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicleData.name}</Text>
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleId}>{vehicleData.id}</Text>
                <Text style={styles.vehicleTime}>· {vehicleData.time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, styles.releaseButton]}
            onPress={handleRelease}
          >
            <Text style={[styles.actionButtonText, styles.releaseButtonText]}>RELEASE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.startRideButton]}
            onPress={handleStartRide}
          >
            <Text style={[styles.actionButtonText, styles.startRideButtonText]}>START RIDE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: height * 0.4,
  },
  reservationSection: {
    marginBottom: 16,
    marginLeft: 16,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  reservationTitle: {
    fontSize: 18,
    fontFamily: Fonts.urbanist.semiBold,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.medium,
    color: colors.textLight,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  vehicleSection: {
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontFamily: Fonts.urbanist.bold,
    color: colors.text,
    marginBottom: 4,
  },
  vehicleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleId: {
    fontSize: 14,
    fontFamily: Fonts.urbanist.semiBold,
    color: colors.primary,
  },
  vehicleTime: {
    fontSize: 14,
    fontFamily: Fonts.urbanist.medium,
    color: colors.textLight,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  releaseButton: {
    backgroundColor: 'transparent',
    borderColor: colors.textLight,
  },
  startRideButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.bold,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  releaseButtonText: {
    color: colors.textLight,
  },
  startRideButtonText: {
    color: 'white',
  },
});

export default VehicleReservationScreen;