import { useState, useEffect, useRef } from "react";
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

export default function OTPVerificationScreen({ navigation }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 4) {
      setError("Please enter all digits");
      return;
    }
    if (code !== "5136") {
      setError("The provided code is incorrect or invalid.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("ResetPasswordScreen");
    }, 1500);
  };

  const handleResend = () => {
    setResent(true);
    setOtp(["", "", "", ""]);
    setTimer(59);
    setTimeout(() => setResent(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon source="chevron-left" size={24} color="#000" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the verification code we just sent on your email address.
      </Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, error ? styles.inputError : {}]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            maxLength={1}
            keyboardType="number-pad"
            textAlign="center"
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </View>

      {/* Timer */}
      <Text style={styles.timerText}>
        {resent ? (
          <>
            <Icon
              source="check-circle"
              size={18}
              color="green"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "green" }}>
              New OTP verification code has been sent.
            </Text>
          </>
        ) : (
          `00:${timer < 10 ? `0${timer}` : timer}`
        )}
      </Text>

      {/* Error */}
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

      {/* Verify Button */}
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
      </TouchableOpacity>

      {/* Resend Link */}
      <Text style={styles.footerText}>
        Didn't receive code?{" "}
        <Text style={styles.linkText} onPress={handleResend}>
          Resend
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
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 60,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 45,
  },
  otpInput: {
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    width: 60,
    height: 60,
    fontSize: 20,
    color: "#333",
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "red",
  },
  timerText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 15,
  },
  errorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 30,
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
  linkText: {
    color: "#3366FF",
    fontWeight: "bold",
  },
});