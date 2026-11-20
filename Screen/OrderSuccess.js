import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../Context/ShopContext";
import { COLORS, formatINR } from "../Utils/helpers";

const OrderSuccess = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { orders } = useShop();
  const order = orders.find((o) => o.id === orderId);

  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [scale, fade]);

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: "HomeTabs" }] });

  // Android back button -> home (not back to checkout)
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      goHome();
      return true;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
        <Ionicons name="checkmark" size={72} color="#fff" />
      </Animated.View>

      <Animated.View style={{ opacity: fade, alignItems: "center", width: "100%" }}>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.sub}>
          Thank you! Your delicious food is being prepared.
        </Text>

        {order && (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value}>#{order.id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>{formatINR(order.bill.grandTotal)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment</Text>
              <Text style={styles.value}>{order.payment.label}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Estimated delivery</Text>
              <Text style={[styles.value, { color: COLORS.success }]}>30–35 mins</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.primary}
          onPress={() => navigation.replace("OrderTracking", { orderId })}
        >
          <Ionicons name="bicycle-outline" size={20} color="#fff" />
          <Text style={styles.primaryText}>  Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondary} onPress={goHome}>
          <Text style={styles.secondaryText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 24 },
  circle: { width: 130, height: 130, borderRadius: 65, backgroundColor: COLORS.success, justifyContent: "center", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.text },
  sub: { fontSize: 14, color: COLORS.muted, textAlign: "center", marginTop: 8, marginBottom: 22 },
  card: { width: "100%", backgroundColor: COLORS.bg, borderRadius: 14, padding: 16, marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  label: { color: COLORS.muted, fontSize: 14 },
  value: { color: COLORS.text, fontWeight: "bold", fontSize: 14, maxWidth: "60%", textAlign: "right" },
  primary: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 15, width: "100%" },
  primaryText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  secondary: { marginTop: 14, paddingVertical: 10 },
  secondaryText: { color: COLORS.primary, fontWeight: "bold", fontSize: 15 },
});
