import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../Utils/helpers";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Enter a valid email", "Please check your email address.");
      return;
    }
    Alert.alert(
      "Password reset",
      "This demo does not send emails yet. Connect a password-reset API to enable email recovery.",
      [{ text: "Back to login", onPress: () => navigation.navigate("Login") }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={COLORS.text} />
      </TouchableOpacity>
      <View style={styles.icon}><Ionicons name="key-outline" size={32} color={COLORS.primary} /></View>
      <Text style={styles.title}>Forgot password?</Text>
      <Text style={styles.sub}>Enter the email address associated with your account.</Text>
      <TextInput style={styles.input} placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24, justifyContent: "center" },
  back: { position: "absolute", top: 55, left: 24, width: 42, height: 42, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  icon: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text },
  sub: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  input: { height: 52, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: "#fff", paddingHorizontal: 14 },
  button: { height: 54, backgroundColor: COLORS.primary, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
