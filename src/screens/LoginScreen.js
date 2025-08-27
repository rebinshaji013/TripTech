import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Icon } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setUser } from "../store/tripSlice";
import Colors from "../utilities/colors";
import Fonts from "../utilities/fonts";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Simple validation
    if (!email.includes("@")) {
      setError("The provided email is incorrect or invalid");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setIsReturningUser(true);
    
    // Mock user data - replace with actual authentication
    const user = {
      id: 1,
      name: "John Doe",
      email: email,
    };
    
    dispatch(setUser(user));
   // navigation.navigate("Dashboard");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: Colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      {/* Logo & App Name */}
      <Text style={[styles.logoText, { color: Colors.primary }]}>
        TripTech
      </Text>

      {/* Welcome Text */}
      <Text style={[styles.welcomeText, { color: Colors.primary }]}>
        {isReturningUser
          ? "Welcome back!\nGlad to see you, Again!"
          : "Welcome !!\nPlease login to continue."}
      </Text>

      {/* Email Input */}
      <View style={[styles.inputContainer, { backgroundColor: Colors.gray100 }]}>
        <Icon source="email-outline" size={20} color={Colors.gray600} style={styles.icon} />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={Colors.gray500}
          style={[styles.input, { color: Colors.textPrimary }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={[styles.inputContainer, { backgroundColor: Colors.gray100 }]}>
        <Icon source="lock-outline" size={20} color={Colors.gray600} style={styles.icon} />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={Colors.gray500}
          style={[styles.input, { color: Colors.textPrimary }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            source={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.gray600}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Text style={[styles.forgotPasswordText, { color: Colors.primary }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorWrapper}>
          <Icon source="alert-circle" size={18} color={Colors.error} style={{ marginRight: 6 }} />
          <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
        </View>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.loginButton, { backgroundColor: Colors.primary }]} 
        onPress={handleLogin}
      >
        <Text style={[styles.loginButtonText, { color: Colors.white }]}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Terms & Privacy */}
      <Text style={[styles.termsText, { color: Colors.textSecondary }]}>
        By continuing, you agree to our{" "}
        <Text style={[styles.linkText, { color: Colors.primary }]}>
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text style={[styles.linkText, { color: Colors.primary }]}>
          Privacy Policy
        </Text>.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 32,
    fontFamily: Fonts.urbanist.bold,
    textAlign: "center",
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: Fonts.urbanist.bold,
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 28,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 56,
    width: "100%",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: Fonts.urbanist.regular,
  },
  eyeIcon: { 
    marginLeft: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: Fonts.urbanist.medium,
  },
  errorWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: Fonts.urbanist.medium,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.semiBold,
  },
  termsText: {
    fontSize: 12,
    fontFamily: Fonts.urbanist.regular,
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    fontFamily: Fonts.urbanist.medium,
  },
});