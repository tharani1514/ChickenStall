import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../Context/ShopContext";
import {
  COLORS, ORDER_STAGES, TOTAL_DELIVERY_SECONDS, formatINR, getStageIndex,
} from "../Utils/helpers";

// Replace with the real delivery partner phone number from your backend
const PARTNER = { name: "Ravi Kumar", rating: 4.8, phone: "+910000000000" };

const OrderTracking = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { orders, cancelOrder } = useShop();
  const order = orders.find((o) => o.id === orderId);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Order not found</Text>
      </View>
    );
  }

  const stage = getStageIndex(order, now);
  const cancelled = stage === -1;
  const delivered = stage === ORDER_STAGES.length - 1;
  const canCancel = stage === 0;

  const elapsed = Math.floor((now - order.createdAt) / 1000);
  const remaining = Math.max(0, TOTAL_DELIVERY_SECONDS - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = cancelled ? 0 : Math.min(1, elapsed / TOTAL_DELIVERY_SECONDS);

  const handleCancel = () =>
    Alert.alert("Cancel order?", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      { text: "Yes, cancel", style: "destructive", onPress: () => cancelOrder(order.id) },
    ]);

  const callPartner = () =>
    Linking.openURL(`tel:${PARTNER.phone}`).catch(() =>
      Alert.alert("Unable to place call")
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* STATUS HEADER */}
      <View style={[styles.statusCard, cancelled && { backgroundColor: COLORS.danger }, delivered && { backgroundColor: COLORS.success }]}>
        <Text style={styles.statusTop}>Order #{order.id}</Text>
        <Text style={styles.statusTitle}>
          {cancelled ? "Order Cancelled" : delivered ? "Delivered 🎉" : ORDER_STAGES[stage].title}
        </Text>
        {!cancelled && !delivered && (
          <Text style={styles.statusEta}>Arriving in {mm}:{ss}</Text>
        )}
        {cancelled && <Text style={styles.statusEta}>Refund (if paid) will be processed in 3–5 days</Text>}
        {!cancelled && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        )}
      </View>

      {/* STEPPER */}
      {!cancelled && (
        <View style={styles.card}>
          {ORDER_STAGES.map((s, i) => {
            const done = i <= stage;
            const last = i === ORDER_STAGES.length - 1;
            return (
              <View key={s.key} style={styles.stepRow}>
                <View style={{ alignItems: "center" }}>
                  <View style={[styles.stepIcon, done && styles.stepIconDone]}>
                    <Ionicons name={s.icon} size={18} color={done ? "#fff" : "#9CA3AF"} />
                  </View>
                  {!last && <View style={[styles.stepLine, i < stage && styles.stepLineDone]} />}
                </View>
                <View style={{ marginLeft: 14, flex: 1, paddingBottom: last ? 0 : 22 }}>
                  <Text style={[styles.stepTitle, !done && { color: "#9CA3AF" }]}>{s.title}</Text>
                  <Text style={styles.stepSub}>{s.subtitle}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* DELIVERY PARTNER */}
      {stage >= 1 && !delivered && (
        <View style={[styles.card, styles.partnerRow]}>
          <View style={styles.avatar}><Text style={{ fontSize: 22 }}>🛵</Text></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.partnerName}>{PARTNER.name}</Text>
            <Text style={styles.partnerSub}>⭐ {PARTNER.rating} · Your delivery partner</Text>
          </View>
          <TouchableOpacity style={styles.callBtn} onPress={callPartner}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* ADDRESS */}
      {order.address && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivering to</Text>
          <Text style={styles.addrName}>{order.address.label} · {order.address.name}</Text>
          <Text style={styles.addrText}>
            {order.address.line1}{order.address.landmark ? `, ${order.address.landmark}` : ""}
          </Text>
          <Text style={styles.addrText}>{order.address.city} - {order.address.pincode}</Text>
        </View>
      )}

      {/* ITEMS + BILL */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.line}>
            <Text style={styles.lineText} numberOfLines={1}>{item.quantity} x {item.title}</Text>
            <Text style={styles.lineText}>{formatINR(item.price * item.quantity)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.line}><Text style={styles.muted}>Item total</Text><Text style={styles.lineText}>{formatINR(order.bill.itemTotal)}</Text></View>
        <View style={styles.line}><Text style={styles.muted}>Delivery fee</Text><Text style={styles.lineText}>{order.bill.deliveryFee === 0 ? "FREE" : formatINR(order.bill.deliveryFee)}</Text></View>
        <View style={styles.line}><Text style={styles.muted}>Platform fee + GST</Text><Text style={styles.lineText}>{formatINR(order.bill.platformFee + order.bill.gst)}</Text></View>
        {order.bill.tip > 0 && <View style={styles.line}><Text style={styles.muted}>Tip</Text><Text style={styles.lineText}>{formatINR(order.bill.tip)}</Text></View>}
        {order.bill.discount > 0 && <View style={styles.line}><Text style={styles.muted}>Discount ({order.coupon})</Text><Text style={[styles.lineText, { color: COLORS.success }]}>- {formatINR(order.bill.discount)}</Text></View>}
        <View style={styles.divider} />
        <View style={styles.line}><Text style={styles.total}>Total</Text><Text style={styles.total}>{formatINR(order.bill.grandTotal)}</Text></View>
        <Text style={styles.muted}>Paid via {order.payment.label}</Text>
      </View>

      {canCancel && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel Order</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: "HomeTabs" }] })}
      >
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderTracking;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold" },
  statusCard: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 18, marginBottom: 14 },
  statusTop: { color: "#DBEAFE", fontSize: 12, fontWeight: "600" },
  statusTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 6 },
  statusEta: { color: "#fff", fontSize: 14, marginTop: 6 },
  progressTrack: { height: 6, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 3, marginTop: 14, overflow: "hidden" },
  progressFill: { height: 6, backgroundColor: "#fff", borderRadius: 3 },

  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  stepRow: { flexDirection: "row" },
  stepIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  stepIconDone: { backgroundColor: COLORS.success },
  stepLine: { width: 2, flex: 1, backgroundColor: "#E5E7EB", marginVertical: 2 },
  stepLineDone: { backgroundColor: COLORS.success },
  stepTitle: { fontSize: 15, fontWeight: "bold", color: COLORS.text },
  stepSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  partnerRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  partnerName: { fontSize: 15, fontWeight: "bold", color: COLORS.text },
  partnerSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  callBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.success, justifyContent: "center", alignItems: "center" },

  sectionTitle: { fontSize: 15, fontWeight: "bold", color: COLORS.text, marginBottom: 10 },
  addrName: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  addrText: { fontSize: 13, color: COLORS.muted, marginTop: 3 },
  line: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  lineText: { fontSize: 13, color: COLORS.text, flexShrink: 1 },
  muted: { fontSize: 13, color: COLORS.muted },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  total: { fontSize: 16, fontWeight: "bold", color: COLORS.text },

  cancelBtn: { borderWidth: 1.5, borderColor: COLORS.danger, borderRadius: 12, paddingVertical: 13, alignItems: "center", marginBottom: 12 },
  cancelText: { color: COLORS.danger, fontWeight: "bold", fontSize: 15 },
  homeBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  homeText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
