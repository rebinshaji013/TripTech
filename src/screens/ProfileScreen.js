import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/tripSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommonHeader from '../components/CommonHeader';

import Fonts from '../utilities/fonts';
import useColors from '../hooks/useColors';

const Colors = useColors();

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.trip.user);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => dispatch(setUser(null)),
          style: 'destructive',
        },
      ]
    );
  };

  const handleNotificationPress = () => {};

  return (
    <View style={styles.container}>
     <CommonHeader onNotificationPress={handleNotificationPress} />
    <ScrollView>
      
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
          </Text>
        </View>
        
        <Text style={styles.userName}>Ethan Carter</Text>
        <Text style={styles.userId}>Driver ID: 123456</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Uploaded Documents</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Change Password</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help & Support</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={[styles.logoutButton,  { backgroundColor: Colors.primaryLight }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontFamily: Fonts.urbanist.medium,
    fontWeight: 500,
    color: Colors.primary,
    marginBottom: 5,

  },
  userId: {
    fontSize: 14,
    color: '#616161',
    fontFamily: Fonts.urbanist.regular,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.urbanist.bold,
    fontWeight: '700',
    color: Colors.primary,
    paddingVertical: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuText: {
    fontSize: 15,
    color: '#212121',
    fontWeight: '400',
    fontFamily: Fonts.urbanist.regular,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.urbanist.bold,
  },
});

export default ProfileScreen;