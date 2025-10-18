// src/components/AddRequestModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-paper';
import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';
import ConfirmTripStartModal from './ConfirmTripStartModal';

const AddRequestModal = ({ visible, onClose, onSubmit, tripDetails }) => {
  const Colors = useColors();
  const [tripType, setTripType] = useState('');
  const [tripRequirement, setTripRequirement] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState(null);

  const tripTypes = [
    'Business Trip',
    'Personal Trip',
    'Airport Transfer',
    'City Tour',
    'Long Distance',
    'Other'
  ];

  const handleSubmit = () => {
    const requestData = {
      tripType,
      tripRequirement,
      additionalInfo,
      passengerName: tripDetails?.passengerName || 'Ethan Miller',
      passengerPhone: tripDetails?.passengerPhone || '+15555987-6543',
      timestamp: new Date().toISOString(),
    };

    // Store the request data and show confirmation modal
    setPendingRequestData(requestData);
    setShowConfirmation(true);
  };

  const handleConfirmRequest = (requestData) => {
    // Submit the request
    onSubmit(requestData);
    handleClose();
  };

  const handleClose = () => {
    setTripType('');
    setTripRequirement('');
    setAdditionalInfo('');
    setPendingRequestData(null);
    setShowConfirmation(false);
    onClose();
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setPendingRequestData(null);
  };

  return (
    <>
      {/* Main Add Request Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon source="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Additional Request</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Passenger Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PASSENGER DETAILS</Text>
              <View style={styles.passengerCard}>
                <Text style={styles.passengerName}>
                  {tripDetails?.passengerName || 'Ethan Miller'}
                </Text>
                <Text style={styles.passengerPhone}>
                  {tripDetails?.passengerPhone || '+15555987-6543'}
                </Text>
              </View>
            </View>

            {/* Trip Requested By */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Trip Requested By</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  {tripDetails?.passengerName || 'Ethan Miller'}
                </Text>
              </View>
            </View>

            {/* Trip Type */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Trip Type</Text>
              <View style={styles.tripTypeContainer}>
                {tripTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.tripTypeButton,
                      tripType === type && styles.tripTypeButtonSelected
                    ]}
                    onPress={() => setTripType(type)}
                  >
                    <Text style={[
                      styles.tripTypeText,
                      tripType === type && styles.tripTypeTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trip Requirement */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Trip Requirement</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter Trip Requirement"
                placeholderTextColor={Colors.textLight}
                value={tripRequirement}
                onChangeText={setTripRequirement}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Additional Info */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Additional Info</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter Additional Info"
                placeholderTextColor={Colors.textLight}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.requestButton, (!tripType || !tripRequirement) && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!tripType || !tripRequirement}
            >
              <Text style={styles.buttonText}>Request</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmTripStartModal
        visible={showConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmRequest}
        tripDetails={tripDetails}
        requestData={pendingRequestData}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: '#000000',
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passengerCard: {
    backgroundColor: '#ffffff',
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
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#000000',
  },
  tripTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tripTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  tripTypeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tripTypeText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#000000',
  },
  tripTypeTextSelected: {
    color: '#ffffff',
    fontFamily: 'Urbanist-SemiBold',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#000000',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requestButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#ffffff',
  },
  cancelButtonText: {
    color: '#000000',
  },
});

export default AddRequestModal;