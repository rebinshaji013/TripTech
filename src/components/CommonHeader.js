import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import useColors from '../hooks/useColors';
import Fonts from '../utilities/fonts';

const colors = useColors();

const CommonHeader = ({ title = 'TripTech', showNotification = true, onNotificationPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Icon source="car" size={28} color={colors.primary} />
        <Text style={styles.appName}>{title}</Text>
      </View>
      
      {showNotification && (
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Icon source="bell-outline" size={24} color={colors.primary} />
          {/* Notification badge - you can conditionally show this */}
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontFamily: Fonts.urbanist.semiBold,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 10,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: Fonts.urbanist.bold,
    fontWeight: 'bold',
  },
});

export default CommonHeader;