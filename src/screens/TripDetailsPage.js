import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper'; // You'll need to install react-native-paper

const TripInformationScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>TRIP INFORMATION</Text>
        
        <View style={styles.timeContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={'unchecked'}
              onPress={() => {}}
              color="#007AFF"
            />
            <Text style={styles.timeText}>OP: 00 AM</Text>
          </View>
          
          <View style={styles.checkboxRow}>
            <Checkbox
              status={'checked'}
              onPress={() => {}}
              color="#007AFF"
            />
            <Text style={styles.timeText}>OP-AUG-2025</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <Text style={styles.subHeader}>Pickup: 123 Main St. Oak Ave, Anytown</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionHeader}>Pickup Location</Text>
        <Text style={styles.address}>123 Main St. Oak Ave, Anytown</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionHeader}>PASSENGER DETAILS</Text>
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerName}>Ethan Miller</Text>
          <Text style={styles.phoneNumber}>+105557987-6543</Text>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionHeader}>TRIP LOCATIONS</Text>
        
        {renderMilestone(1, '123 Main St. Oak Ave, Anytown', '10:00 AM', true)}
        {renderMilestone(2, '123 Main St. Oak Ave, Anytown', '04:30 PM', true)}
        {renderMilestone(3, '123 Main St. Oak Ave, Anytown', '09:30 PM', true)}
        {renderMilestone(4, '123 Main St. Oak Ave, Anytown', '03:30 AM', true)}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.addRequestButton]}>
            <Text style={styles.buttonText}>Add Request</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.confirmButton]}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const renderMilestone = (number, address, time, isChecked) => {
  return (
    <View style={styles.milestone} key={number}>
      <View style={styles.milestoneHeader}>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => {}}
          color="#007AFF"
        />
        <Text style={styles.milestoneAddress}>{address}</Text>
      </View>
      
      <View style={styles.milestoneDetails}>
        <View style={styles.timeTag}>
          <Text style={styles.timeTagText}>{time}</Text>
        </View>
        
        <View style={styles.dateTag}>
          <Text style={styles.dateTagText}>OP-AUG-2025</Text>
        </View>
      </View>
      
      <View style={styles.milestoneFooter}>
        <Text style={styles.milestoneText}>Milestone {number}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  timeContainer: {
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  passengerInfo: {
    marginBottom: 8,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#555',
  },
  milestone: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneAddress: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  milestoneDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timeTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  timeTagText: {
    fontSize: 14,
    color: '#555',
  },
  dateTag: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dateTagText: {
    fontSize: 14,
    color: '#00796b',
  },
  milestoneFooter: {
    flexDirection: 'row',
  },
  milestoneText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  addRequestButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripInformationScreen;