import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { useShop } from "../Context/ShopContext";
import { COLORS, formatINR, getStageIndex, getStatusLabel, ORDER_STAGES } from "../Utils/helpers";

const Orders = ({ navigation }) => {
  const { orders } = useShop();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(t);
  }, []);

  const badgeColor = (order) => {
    const idx = getStageIndex(order, now);
    if (idx === -1) return COLORS.danger;
    if (idx === ORDER_STAGES.length - 1) return COLORS.success;
    return COLORS.warning;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 60 }}>🍽️</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Your placed orders will show up here.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("HomeTabs")}>
              <Text style={styles.btnText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const color = badgeColor(item);
          const names = item.items.map((i) => `${i.quantity} x ${i.title}`).join(", ");
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("OrderTracking", { orderId: item.id })}
            >
              <View style={styles.top}>
                <Text style={styles.id}>#{item.id}</Text>
                <View style={[styles.badge, { backgroundColor: color + "22" }]}>
                  <Text style={[styles.badgeText, { color }]}>{getStatusLabel(item, now)}</Text>
                </View>
              </View>
              <Text style={styles.items} numberOfLines={2}>{names}</Text>
              <View style={styles.bottom}>
                <Text style={styles.date}>
                  {new Date(item.createdAt).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text style={styles.total}>{formatINR(item.bill.grandTotal)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 19, fontWeight: "bold", color: COLORS.text, marginTop: 10 },
  emptyText: { color: COLORS.muted, marginTop: 6, marginBottom: 18 },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 13, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  id: { fontSize: 15, fontWeight: "bold", color: COLORS.text },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  items: { fontSize: 13, color: COLORS.muted, marginVertical: 10, lineHeight: 19 },
  bottom: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#F1F1F1", paddingTop: 10 },
  date: { fontSize: 12, color: COLORS.muted },
  total: { fontSize: 15, fontWeight: "bold", color: COLORS.primary },
});
