import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../Context/AuthContext";
import { COLORS } from "../Utils/helpers";

const Login = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }
    const result = login({ email, password });
    if (!result.ok) Alert.alert("Login failed", result.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandIcon}>
          <Ionicons name="restaurant" size={34} color="#f7f2f2" />
        </View>
        <Text style={styles.brand}>Chicken World</Text>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Sign in to discover delicious food near you.</Text>

        <Text style={styles.label}>Email address</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={21} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgot} onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.primaryText}>Login</Text>
          <Ionicons name="arrow-forward" size={19} color="#fff" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Create account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo account</Text>
          <Text style={styles.demoText}>Email: demo@foodie.com</Text>
          <Text style={styles.demoText}>Password: Foodie@123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { flexGrow: 1, justifyContent: "center", padding: 24 },
  brandIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  brand: { color: COLORS.primary, fontSize: 17, fontWeight: "800", marginBottom: 30 },
  title: { color: COLORS.text, fontSize: 30, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  label: { color: COLORS.text, fontSize: 13, fontWeight: "700", marginBottom: 8, marginTop: 14 },
  inputWrap: { minHeight: 54, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, paddingHorizontal: 14 },
  input: { flex: 1, paddingVertical: 13, paddingHorizontal: 10, color: COLORS.text, fontSize: 15 },
  forgot: { alignSelf: "flex-end", marginTop: 13 },
  link: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 13, minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 28 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: COLORS.muted, fontSize: 13 },
  demoBox: { marginTop: 30, padding: 14, backgroundColor: COLORS.primaryLight, borderRadius: 12 },
  demoTitle: { color: COLORS.primary, fontWeight: "800", marginBottom: 5 },
  demoText: { color: COLORS.text, fontSize: 12, marginTop: 2 },
});
