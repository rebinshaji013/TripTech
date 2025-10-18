// src/components/LocationHeader.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-paper';

const LocationHeader = ({
  pickupLocation = "Bobst Library",
  destinationLocation = "Larchmont Hotel",
  onSwapPress
}) => {
  return (
    <View style={styles.container}>
      {/* Pickup Location */}
      <View style={styles.locationRow}>
        <View style={[styles.dot, styles.greenDot]} />
        <View style={styles.locationContent}>
          <Text style={styles.locationTitle}>From</Text>
          <Text style={styles.locationName}>{pickupLocation}</Text>
        </View>
      </View>

      {/* Swap Button */}
      <TouchableOpacity style={styles.swapButton} onPress={onSwapPress}>
        <Icon source="swap-vertical" size={20} color="#007AFF" />
      </TouchableOpacity>

      {/* Destination Location */}
      <View style={styles.locationRow}>
        <View style={[styles.dot, styles.redDot]} />
        <View style={styles.locationContent}>
          <Text style={styles.locationTitle}>To</Text>
          <Text style={styles.locationName}>{destinationLocation}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    width: 150,
    height: 200,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  greenDot: {
    backgroundColor: '#4CAF50',
  },
  redDot: {
    backgroundColor: '#F44336',
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontWeight: '500',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  swapButton: {
    alignSelf: 'flex-start',
    marginLeft: 4,
    marginVertical: 4,
    padding: 8,
  },
});

export default LocationHeader;