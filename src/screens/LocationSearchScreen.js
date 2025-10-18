// src/screens/LocationSearchScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { setPickupLocation } from '../store/tripSlice';
import { Icon } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// Define colors
const colors = {
  primary: '#007AFF',
  background: '#ffffff',
  text: '#000000',
  textLight: '#666666',
  border: '#e0e0e0',
  cardBackground: '#ffffff',
  green: '#0CC25E',
};

const Fonts = {
  urbanist: {
    bold: 'Urbanist-Bold',
    semiBold: 'Urbanist-SemiBold',
    medium: 'Urbanist-Medium',
    regular: 'Urbanist-Regular',
  }
};

const LocationSearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  // Current location coordinates (NYC area for the example)
  const currentLocation = {
    latitude: 40.73061,
    longitude: -73.935242,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Sample locations data matching the image
  const locations = [
    {
      id: '1',
      mainText: 'Washington Square Park',
      secondaryText: 'Grey Art Galle',
      coordinates: {
        latitude: 40.7308,
        longitude: -73.9973,
      }
    }
  ];

  const handleLocationSelect = (location) => {
    dispatch(setPickupLocation({
      location: location.mainText,
      address: location.secondaryText,
      coordinates: location.coordinates
    }));

    // Navigate back or to next screen
    navigation.goBack();
  };

  const handleSetPickupLocation = () => {
    // Use current location for pickup
    dispatch(setPickupLocation({
      location: 'Current Location',
      address: 'Using your current location',
      coordinates: currentLocation
    }));
    navigation.navigate('VehicleSelection');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={currentLocation}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          toolbarEnabled={false}
        >
          {/* Markers for sample locations */}
          {locations.map(location => (
            <Marker
              key={location.id}
              coordinate={location.coordinates}
            >
              <View style={styles.marker}>
                <Icon source="map-marker" size={20} color={colors.primary} />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Top Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>9:41</Text>
        <View style={styles.statusIcons}>
          <View style={styles.signalBars}>
            <View style={[styles.signalBar, styles.signalBar4]} />
            <View style={[styles.signalBar, styles.signalBar3]} />
            <View style={[styles.signalBar, styles.signalBar2]} />
            <View style={[styles.signalBar, styles.signalBar1]} />
          </View>
          <Icon source="wifi" size={16} color="#000" />
          <View style={styles.batteryContainer}>
            <View style={styles.battery}>
              <View style={styles.batteryLevel} />
            </View>
            <View style={styles.batteryTip} />
          </View>
        </View>
      </View>

      {/* Solidcore Brand Header */}
      <View style={styles.brandHeader}>
        <Text style={styles.brandText}>[Solidcore]</Text>
      </View>

      {/* Search Card */}
      <KeyboardAvoidingView
        style={styles.searchCard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon source="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Icon source="magnify" size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={false}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={handleClearSearch}>
                <Icon source="close-circle" size={20} color={colors.textLight} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Locations List */}
        <View style={styles.locationsList}>
          {locations.map((location, index) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationItem,
                index === locations.length - 1 && styles.lastLocationItem
              ]}
              onPress={() => handleLocationSelect(location)}
            >
              <View style={styles.locationIcon}>
                <Icon
                  source="map-marker-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationMainText}>{location.mainText}</Text>
                <Text style={styles.locationSecondaryText}>{location.secondaryText}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSetPickupLocation}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
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
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  timeText: {
    fontSize: 17,
    fontFamily: Fonts.urbanist.bold,
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 12,
    gap: 2,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  signalBar1: { height: 4 },
  signalBar2: { height: 6 },
  signalBar3: { height: 8 },
  signalBar4: { height: 10 },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  battery: {
    width: 22,
    height: 12,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 2,
    padding: 1,
  },
  batteryLevel: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  batteryTip: {
    width: 2,
    height: 4,
    backgroundColor: '#000',
    marginLeft: 1,
    borderRadius: 1,
  },
  brandHeader: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontFamily: Fonts.urbanist.bold,
    color: '#000',
    letterSpacing: 1,
  },
  searchCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: height * 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.urbanist.regular,
    color: colors.text,
    height: '100%',
  },
  sectionHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.urbanist.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
  locationsList: {
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastLocationItem: {
    borderBottomWidth: 0,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationMainText: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.medium,
    color: colors.text,
    marginBottom: 2,
  },
  locationSecondaryText: {
    fontSize: 14,
    fontFamily: Fonts.urbanist.regular,
    color: colors.textLight,
  },
  nextButton: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.semiBold,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LocationSearchScreen;