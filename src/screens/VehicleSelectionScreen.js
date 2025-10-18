// src/screens/VehicleSelectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import LocationHeader from '../components/LocationHeader';

const VehicleSelectionScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { currentTrip } = useSelector(state => state.trip);

  const [locations, setLocations] = useState({
    pickup: "Bobst Library",
    destination: "Larchmont Hotel"
  });

  // Mock coordinates for New York University area
  const region = {
    latitude: 40.7295,
    longitude: -73.9965,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const vehicleOptions = [
    {
      id: 'car',
      name: 'Gofilde Car',
      time: '3-5 mins',
      passengers: '4 passengers',
      price: '€15.25',
      icon: 'car',
    },
    {
      id: 'car-xl',
      name: 'Gofilde Car XL',
      time: '4-6 mins',
      passengers: '6 passengers',
      price: '€22.50',
      icon: 'car-side',
    },
    {
      id: 'car-plus',
      name: 'Gofilde Car Plus',
      time: '4-5 mins',
      passengers: '4 passengers',
      price: '€18.75',
      icon: 'car-sports',
    },
  ];

  const handleVehicleSelect = (vehicle) => {
    // Handle vehicle selection
    console.log('Selected vehicle:', vehicle);
    // You can dispatch an action here to set the selected vehicle
  };

  const handleBookRide = () => {
    // Handle booking logic
    navigation.goBack();
  };

  const handleSwapLocations = () => {
    setLocations(prev => ({
      pickup: prev.destination,
      destination: prev.pickup
    }));
  };

  const handleLocationPress = (type) => {
    // Navigate to location search screen
    navigation.navigate('LocationSearch', {
      locationType: type,
      currentLocation: type === 'pickup' ? locations.pickup : locations.destination
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Location Header Component */}
        {/*<TouchableOpacity onPress={() => handleLocationPress('pickup')}>
          <LocationHeader
            pickupLocation={locations.pickup}
            destinationLocation={locations.destination}
            onSwapPress={handleSwapLocations}
          />
        </TouchableOpacity>*/}

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: 40.7295,
                longitude: -73.9965,
              }}
              title="Bobst Library"
              description="New York University"
            />
            <Marker
              coordinate={{
                latitude: 40.7335,
                longitude: -73.9945,
              }}
              title="Larchmont Hotel"
              description="Greenwich Village"
              pinColor="blue"
            />
          </MapView>
        </View>


        {/* Vehicle Options */}
        <View style={styles.vehiclesContainer}>

          {vehicleOptions.map((vehicle, index) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleOption,
                index === 0 && styles.vehicleOptionSelected
              ]}
              onPress={() => handleVehicleSelect(vehicle)}
            >
              <View style={styles.vehicleInfo}>
                <Icon source={vehicle.icon} size={24} color="#0CC25E" />
                <View style={styles.vehicleDetails}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleTime}>{vehicle.time}</Text>
                  <Text style={styles.vehiclePassengers}>{vehicle.passengers}</Text>
                </View>
              </View>
              <Text style={styles.vehiclePrice}>{vehicle.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Section */}
        <View style={styles.paymentContainer}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoText}>Gofilde Wallet</Text>
              <Icon source="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.walletSection}>
            <Text style={styles.walletLabel}>Promos / Vouchers</Text>
            <Text style={styles.walletBalance}>507952</Text>
          </View>
        </View>

        {/* Book Button with Calendar */}
        <View style={styles.bookRow}>
          <TouchableOpacity style={styles.calendarButton}>
            <Icon source="calendar" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookRide}
          >
            <Text style={styles.bookButtonText}>Book Gofilde Car</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  mapContainer: {
    height: 450,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  locationsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  additionalLocations: {
    marginTop: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  additionalLocationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  locationSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    marginLeft: 24,
  },
  italicText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginLeft: 24,
  },
  vehiclesContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
  },
  vehicleOptionSelected: {
    borderColor: '#0CC25E',
    borderWidth: 1,
    backgroundColor: '#f8f9ff',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleDetails: {
    marginLeft: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  vehicleTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  vehiclePassengers: {
    fontSize: 12,
    color: '#999',
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  paymentContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  walletSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
  },
  walletLabel: {
    fontSize: 14,
    color: '#666',
  },
  walletBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    gap: 12,
  },
  calendarButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#0CC25E',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default VehicleSelectionScreen;