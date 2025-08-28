import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function ResetPasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [error]);

  const handleReset = () => {
    setError("");
    if (newPassword.length < 8) {
      setError("The password should be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Both the passwords does not match.");
      return;
    }

    Animated.timing(slideAnim, {
      toValue: -height * 0.6,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setStep("changed");
      slideAnim.setValue(height * 0.6);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const getMatchStatus = () => {
    if (!newPassword || !confirmPassword) return null;
    if (newPassword !== confirmPassword) return "mismatch";
    if (newPassword.length >= 8 && confirmPassword.length >= 8) return "match";
    return null;
  };

  const handlebutton = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            {step === "form" ? (
              <View>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Icon source="chevron-left" size={width * 0.06} color="black" />
                </TouchableOpacity>

                <Text style={styles.title}>Create new password</Text>
                <Text style={styles.subtitle}>
                  Your new password must be unique from those previously used.
                </Text>

                {/* New Password */}
                <View style={styles.inputContainer}>
                  <Icon source="lock-outline" size={width * 0.05} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      source={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={width * 0.05}
                      color="#888"
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputContainer}>
                  <Icon source="lock-outline" size={width * 0.05} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={!showCPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowCPassword(!showCPassword)}>
                    <Icon
                      source={showCPassword ? "eye-off-outline" : "eye-outline"}
                      size={width * 0.05}
                      color="#888"
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* Error Message */}
                {error ? (
                  <View style={styles.errorWrapper}>
                    <Icon source="alert-circle" size={width * 0.045} color="red" style={{ marginRight: 6 }} />
                    <Animated.Text style={[styles.errorText, { opacity: fadeAnim }]}>
                      {error}
                    </Animated.Text>
                  </View>
                ) : null}

                {getMatchStatus() === "mismatch" && (
                  <View style={styles.errorWrapper}>
                    <Icon source="alert-circle" size={width * 0.045} color="red" style={{ marginRight: 6 }} />
                    <Text style={styles.errorText}>Both the passwords does not match.</Text>
                  </View>
                )}
                {getMatchStatus() === "match" && (
                  <View style={styles.errorWrapper}>
                    <Icon source="check-circle" size={width * 0.045} color="green" style={{ marginRight: 6 }} />
                    <Text style={styles.success}>Both the passwords match each other.</Text>
                  </View>
                )}

                {/* Reset Button */}
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                  <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Icon
                  source="shield-check"
                  style={styles.center}
                  size={width * 0.4}
                  color="#18C07A"
                />
                <Text style={styles.successTitle}>Password Changed!</Text>
                <Text style={styles.successSubtitle}>
                  Your password has been changed successfully.
                </Text>
                <TouchableOpacity style={styles.button} onPress={handlebutton}>
                  <Text style={styles.buttonText}>Back to Login</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#3B63AA",
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: "#555",
    fontWeight: "bold",
    marginBottom: height * 0.05,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: width * 0.035,
    borderRadius: 8,
    marginBottom: height * 0.015,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: width * 0.04,
  },
  eyeIcon: { marginLeft: 8 },
  backButton: { marginBottom: height * 0.02 },
  button: {
    backgroundColor: "#4169E1",
    paddingVertical: height * 0.018,
    borderRadius: 8,
    alignItems: "center",
    marginTop: height * 0.03,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  errorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  errorText: {
    color: "red",
    fontSize: width * 0.03,
    fontWeight: "bold",
  },
  success: {
    color: "green",
    fontSize: width * 0.03,
    fontWeight: "bold",
  },
  center: {
    alignSelf: "center",
    marginTop: height * 0.12,
  },
  successTitle: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#3366FF",
    marginTop: height * 0.02,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: width * 0.04,
    color: "#666",
    fontWeight: "bold",
    marginVertical: height * 0.015,
    textAlign: "center",
    paddingHorizontal: width * 0.1,
  },
});