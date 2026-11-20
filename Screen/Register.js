import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../Context/AuthContext";
import { COLORS } from "../Utils/helpers";

const Register = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !mobile.trim() || !password || !confirmPassword) {
      Alert.alert("Missing details", "Please complete all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Alert.alert("Invalid mobile", "Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }

    const result = register({ name, email, mobile, password });
    if (!result.ok) Alert.alert("Registration failed", result.message);
  };

  const Field = ({ label, value, onChangeText, placeholder, ...props }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join Chicken World and order your favourites chicken item.</Text>

        <Field label="Full name" value={name} onChangeText={setName} placeholder="Enter your name" autoCapitalize="words" />
        <Field label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
        <Field label="Mobile number" value={mobile} onChangeText={(v) => setMobile(v.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" keyboardType="number-pad" maxLength={10} />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrap}>
          <TextInput style={styles.passwordInput} value={password} onChangeText={setPassword} placeholder="Minimum 8 characters" secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={21} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <Field label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" secureTextEntry={!showPassword} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create account</Text>
          <Ionicons name="arrow-forward" size={19} color="#fff" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { flexGrow: 1, padding: 24, justifyContent: "center" },
  back: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 22 },
  title: { fontSize: 28, color: COLORS.text, fontWeight: "800" },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 7, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "700", color: COLORS.text, marginTop: 14, marginBottom: 7 },
  input: { height: 51, borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14, fontSize: 14, color: COLORS.text },
  passwordWrap: { minHeight: 51, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORS.border, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.text },
  button: { backgroundColor: COLORS.primary, minHeight: 54, borderRadius: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 28 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  footerText: { color: COLORS.muted, fontSize: 13 },
  link: { color: COLORS.primary, fontWeight: "800", fontSize: 13 },
});
