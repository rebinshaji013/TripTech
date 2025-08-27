import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Icon } from "react-native-paper";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (mail) => {
    return /\S+@\S+\.\S+/.test(mail);
  };

  const handleSendCode = () => {
    if (!validateEmail(email)) {
      setError("The provided email address is incorrect");
      setSuccess(false);
      return;
    }
    setError("");
    setLoading(true);
    setSuccess(false);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      navigation.navigate("OTPVerification");
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon source="chevron-left" size={24} color="#000" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Don't worry! It occurs. Please enter the email address linked with your
        account.
      </Text>

      {/* Email Input */}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : success ? styles.inputSuccess : {},
        ]}
      >
        <Icon
          source="email-outline"
          size={20}
          color={error ? "red" : success ? "green" : "#999"}
          style={styles.icon}
        />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {success && (
          <Icon source="check-circle" size={20} color="green" />
        )}
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorWrapper}>
          <Icon
            source="alert-circle"
            size={18}
            color="red"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Send Code Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSendCode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Code</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <Text style={styles.footerText}>
        Remember Password?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3B63AA",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 35,
    height: "7%",
    width: "100%",
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "red",
  },
  inputSuccess: {
    borderColor: "green",
  },
  errorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4169E1",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 60,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 70,
  },
  loginLink: {
    color: "#3366FF",
    fontWeight: "bold",
  },
});