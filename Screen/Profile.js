import React from "react";
import { Alert } from "react-native";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../Context/ShopContext";
import { COLORS } from "../Utils/helpers";
import { useAuth } from "../Context/AuthContext";

const Profile = ({ navigation }) => {
  const { orders, wishlist, addresses } = useShop();
  const { user, logout } = useAuth();

  const MENU = [
    { icon: "receipt-outline", title: "My Orders", sub: "Track & view past orders", go: () => navigation.navigate("Orders") },
    { icon: "location-outline", title: "Saved Addresses", sub: "Manage delivery addresses", go: () => navigation.navigate("Addresses") },
    { icon: "heart-outline", title: "Favourites", sub: "Dishes you've saved", go: () => navigation.navigate("Wishlist") },
    { icon: "settings-outline", title: "Settings", sub: "Notifications & app info", go: () => navigation.navigate("Setting") },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.name}>{user?.name || "Foodie User"}</Text>
        <Text style={styles.sub}>{user?.email || "Welcome to Foodie World"}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statNum}>{orders.length}</Text><Text style={styles.statLabel}>Orders</Text></View>
        <View style={styles.stat}><Text style={styles.statNum}>{wishlist.length}</Text><Text style={styles.statLabel}>Favourites</Text></View>
        <View style={styles.stat}><Text style={styles.statNum}>{addresses.length}</Text><Text style={styles.statLabel}>Addresses</Text></View>
      </View>

      <View style={styles.menu}>
        {MENU.map((m, i) => (
          <TouchableOpacity
            key={m.title}
            style={[styles.item, i < MENU.length - 1 && styles.itemBorder]}
            onPress={m.go}
          >
            <View style={styles.iconBox}><Ionicons name={m.icon} size={22} color={COLORS.primary} /></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.itemTitle}>{m.title}</Text>
              <Text style={styles.itemSub}>{m.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: logout },
          ])
        }
      >
        <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: "center", backgroundColor: "#fff", paddingVertical: 26 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 20, fontWeight: "bold", color: COLORS.text, marginTop: 12 },
  sub: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  stats: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 16, marginTop: -1, borderRadius: 14, paddingVertical: 14, marginBottom: 16, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  stat: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "bold", color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  menu: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  item: { flexDirection: "row", alignItems: "center", padding: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: "#F1F1F1" },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  itemTitle: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 16, marginTop: 20, padding: 15, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FECACA" },
  logoutText: { color: COLORS.danger, fontWeight: "800" },
  itemSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
