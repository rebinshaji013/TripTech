import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-paper";
import Colors from "../utilities/colors";
import Fonts from "../utilities/fonts";

const WelcomeScreen = ({ navigation }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animation when component mounts
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleGetStarted = () => {
    // Animate out before navigating
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 2,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.navigate("Login");
    });
  };

  // Animation interpolations
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [300, 0, -300], // Start from right, center, then slide left
  });

  const opacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const buttonScale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Animated Logo & App Name */}
      <Animated.View
        style={[
          styles.centered,
          { 
            transform: [{ translateX }],
            opacity 
          },
        ]}
      >
        <Icon 
          source="car" 
          size={64} 
          color={Colors.white} 
          style={styles.logoIcon}
        />
        <Text style={[styles.logoText, { color: Colors.white }]}>
          TripTech
        </Text>
        <Text style={[styles.tagline, { color: Colors.white }]}>
          Your Journey, Our Priority
        </Text>
      </Animated.View>

      {/* Get Started Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          { 
            opacity,
            transform: [{ scale: buttonScale }] 
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.getStartedButton, { backgroundColor: Colors.white }]}
          onPress={handleGetStarted}
        >
          <Text style={[styles.buttonText, { color: Colors.primary }]}>
            Get Started
          </Text>
          <Icon 
            source="arrow-right" 
            size={20} 
            color={Colors.primary} 
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Version at Bottom */}
      <Text style={[styles.versionText, { color: Colors.white }]}>
        Version 1.0.0
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centered: {
    position: "absolute",
    top: "30%",
    alignItems: "center",
    width: "100%",
  },
  logoIcon: {
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontFamily: Fonts.urbanist.bold,
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.medium,
    textAlign: "center",
    opacity: 0.9,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    paddingHorizontal: 40,
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: Fonts.urbanist.semiBold,
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  versionText: {
    position: "absolute",
    bottom: 30,
    fontSize: 12,
    fontFamily: Fonts.urbanist.regular,
    opacity: 0.8,
  },
});

export default WelcomeScreen;