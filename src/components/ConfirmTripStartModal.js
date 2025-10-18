// src/components/ConfirmTripStartModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-paper';
import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';

const ConfirmTripStartModal = ({
  visible,
  onClose,
  onConfirm,
  tripDetails,
  requestData
}) => {
  const Colors = useColors();

  const handleConfirm = () => {
    onConfirm(requestData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Confirm Trip Start</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Confirmation Message */}
            <View style={styles.messageSection}>
              <Text style={styles.messageText}>
                Are you sure you want to start the trip?
              </Text>
              <Text style={styles.subMessageText}>
                This will begin tracking your location.
              </Text>
            </View>

            {/* Trip Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Trip Info</Text>

              {/* Pickup Location */}
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Icon source="map-marker" size={20} color={Colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Pickup Location</Text>
                  <Text style={styles.infoValue}>
                    {tripDetails?.pickupAddress || '123 Main St, Anytown'}
                  </Text>
                </View>
              </View>

              {/* Scheduled Time */}
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Icon source="clock-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Scheduled Time</Text>
                  <Text style={styles.infoValue}>
                    {tripDetails?.date || 'July 26, 2024, 10:00 AM'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Passenger Details */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Passenger</Text>
              <View style={styles.passengerCard}>
                <Text style={styles.passengerName}>
                  {tripDetails?.passengerName || 'Ethan Miller'}
                </Text>
                <Text style={styles.passengerPhone}>
                  {tripDetails?.passengerPhone || '+1 (555) 987-6543'}
                </Text>
              </View>
            </View>

            {/* Trip Requirements (if any) */}
            {requestData?.tripRequirement && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Trip Requirements</Text>
                <View style={styles.requirementsCard}>
                  <Text style={styles.requirementsText}>
                    {requestData.tripRequirement}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Start Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    maxHeight: '80%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: '#000000',
    fontWeight: '600',
  },
  content: {
    maxHeight: 400,
  },
  messageSection: {
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  subMessageText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#007AFF',
    marginBottom: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000000',
    fontWeight: '600',
  },
  passengerCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passengerName: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000000',
    marginBottom: 4,
    fontWeight: '600',
  },
  passengerPhone: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#666666',
  },
  requirementsCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requirementsText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#000000',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#ffffff',
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#000000',
  },
});

export default ConfirmTripStartModal;