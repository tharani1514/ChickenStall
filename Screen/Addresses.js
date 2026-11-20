import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../Context/ShopContext";
import { COLORS } from "../Utils/helpers";

const ICONS = { Home: "home-outline", Work: "briefcase-outline", Other: "location-outline" };

const Addresses = ({ route, navigation }) => {
  const selectMode = route.params?.select;
  const { addresses, selectedAddressId, selectAddress, removeAddress } = useShop();

  const confirmDelete = (item) =>
    Alert.alert("Delete address", `Remove your ${item.label} address?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeAddress(item.id) },
    ]);

  const handleSelect = (item) => {
    selectAddress(item.id);
    if (selectMode) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 56 }}>📍</Text>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptyText}>Add an address to get your food delivered.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const active = item.id === selectedAddressId;
          return (
            <TouchableOpacity
              style={[styles.card, active && styles.cardActive]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <Ionicons name={ICONS[item.label] || ICONS.Other} size={24} color={COLORS.primary} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.text}>{item.name} · {item.phone}</Text>
                <Text style={styles.text}>
                  {item.line1}{item.landmark ? `, ${item.landmark}` : ""}
                </Text>
                <Text style={styles.text}>{item.city} - {item.pincode}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => navigation.navigate("AddAddress", { addressId: item.id })}>
                    <Text style={styles.action}>EDIT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(item)}>
                    <Text style={[styles.action, { color: COLORS.danger, marginLeft: 20 }]}>DELETE</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Ionicons
                name={active ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={active ? COLORS.primary : "#9CA3AF"}
              />
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddAddress")}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addText}> Add New Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Addresses;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text, marginTop: 10 },
  emptyText: { color: COLORS.muted, marginTop: 6 },
  card: {
    flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fff", padding: 14,
    borderRadius: 14, marginBottom: 12, borderWidth: 1.5, borderColor: "transparent",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  cardActive: { borderColor: COLORS.primary, backgroundColor: "#F5F9FF" },
  label: { fontSize: 15, fontWeight: "bold", color: COLORS.text, marginBottom: 3 },
  text: { fontSize: 13, color: COLORS.muted, lineHeight: 19 },
  actions: { flexDirection: "row", marginTop: 10 },
  action: { fontSize: 12, fontWeight: "bold", color: COLORS.primary },
  footer: { padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: COLORS.border },
  addBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14 },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
