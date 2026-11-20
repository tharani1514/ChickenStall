import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from "react-native";

import { useShop } from "../Context/ShopContext";
import { COLORS } from "../Utils/helpers";

const Setting = () => {
  const { clearCart } = useShop();
  const [pushOn, setPushOn] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offers, setOffers] = useState(false);

  const Toggle = ({ label, sub, value, onChange }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#D1D5DB", true: COLORS.primaryLight }}
        thumbColor={value ? COLORS.primary : "#f4f3f4"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.card}>
        {Toggle({ label: "Push notifications", sub: "Get alerts on your phone", value: pushOn, onChange: setPushOn })}
        {Toggle({ label: "Order updates", sub: "Status changes for your orders", value: orderUpdates, onChange: setOrderUpdates })}
        {Toggle({ label: "Offers & promotions", sub: "Coupons and deals", value: offers, onChange: setOffers })}
      </View>

      <TouchableOpacity
        style={styles.dangerBtn}
        onPress={() =>
          Alert.alert("Clear cart", "Remove all items from your cart?", [
            { text: "Cancel", style: "cancel" },
            { text: "Clear", style: "destructive", onPress: clearCart },
          ])
        }
      >
        <Text style={styles.dangerText}>Clear Cart</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Foodie World · v1.0.0</Text>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  heading: { fontSize: 24, fontWeight: "bold", color: COLORS.primary, marginBottom: 16 },
  card: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F1F1F1" },
  label: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  sub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  dangerBtn: { marginTop: 20, borderWidth: 1.5, borderColor: COLORS.danger, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  dangerText: { color: COLORS.danger, fontWeight: "bold" },
  version: { textAlign: "center", color: COLORS.muted, fontSize: 12, marginTop: 24 },
});
