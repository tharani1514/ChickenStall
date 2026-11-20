import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform,
} from "react-native";

import { useShop } from "../Context/ShopContext";
import { COLORS } from "../Utils/helpers";

const LABELS = ["Home", "Work", "Other"];

const AddAddress = ({ route, navigation }) => {
  const addressId = route.params?.addressId;
  const { addresses, addAddress, updateAddress } = useShop();
  const existing = addresses.find((a) => a.id === addressId);

  const [form, setForm] = useState({
    label: existing?.label || "Home",
    name: existing?.name || "",
    phone: existing?.phone || "",
    line1: existing?.line1 || "",
    landmark: existing?.landmark || "",
    city: existing?.city || "",
    pincode: existing?.pincode || "",
  });
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (form.line1.trim().length < 5) e.line1 = "Enter house / flat / street details";
    if (form.city.trim().length < 2) e.city = "Enter your city";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const clean = {
      ...form,
      name: form.name.trim(),
      line1: form.line1.trim(),
      landmark: form.landmark.trim(),
      city: form.city.trim(),
    };
    if (existing) updateAddress(existing.id, clean);
    else addAddress(clean);
    navigation.goBack();
  };

  const Field = ({ label, k, ...props }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[k] && styles.inputError]}
        value={form[k]}
        onChangeText={(v) => set(k, v)}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {errors[k] && <Text style={styles.error}>{errors[k]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 18 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Save address as</Text>
        <View style={styles.chipRow}>
          {LABELS.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, form.label === l && styles.chipActive]}
              onPress={() => set("label", l)}
            >
              <Text style={[styles.chipText, form.label === l && styles.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {Field({ label: "Full name", k: "name", placeholder: "e.g. Tharani", autoCapitalize: "words" })}
        {Field({ label: "Mobile number", k: "phone", placeholder: "10-digit number", keyboardType: "number-pad", maxLength: 10 })}
        {Field({ label: "House / Flat / Street", k: "line1", placeholder: "e.g. 12, Gandhi Street" })}
        {Field({ label: "Landmark (optional)", k: "landmark", placeholder: "e.g. Near bus stand" })}
        {Field({ label: "City", k: "city", placeholder: "e.g. Tiruchirappalli", autoCapitalize: "words" })}
        {Field({ label: "Pincode", k: "pincode", placeholder: "6-digit pincode", keyboardType: "number-pad", maxLength: 6 })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>{existing ? "Update Address" : "Save Address"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: "600", color: COLORS.muted, marginBottom: 6 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 14, height: 48, fontSize: 15, color: COLORS.text },
  inputError: { borderColor: COLORS.danger },
  error: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  chipRow: { flexDirection: "row", marginBottom: 18 },
  chip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 10, backgroundColor: "#fff" },
  chipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipText: { color: COLORS.muted, fontWeight: "600" },
  chipTextActive: { color: COLORS.primary },
  footer: { padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
