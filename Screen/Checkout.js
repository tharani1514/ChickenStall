import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../Context/ShopContext";
import { COLORS, COUPONS, formatINR } from "../Utils/helpers";

const TIPS = [0, 10, 20, 30];
const INSTRUCTIONS = [
  "Avoid ringing the bell",
  "Leave at the door",
  "Call on arrival",
  "No contact delivery",
];
const PAY_ICON = {
  cod: "cash-outline",
  upi: "phone-portrait-outline",
  card: "card-outline",
};

const Row = ({ label, value, color, bold }) => (
  <View style={styles.billRow}>
    <Text style={[styles.billLabel, bold && styles.billBold]}>{label}</Text>
    <Text style={[styles.billValue, bold && styles.billBold, color && { color }]}>
      {value}
    </Text>
  </View>
);

const Checkout = ({ navigation }) => {
  const {
    cart,
    bill,
    addresses,
    selectedAddressId,
    paymentMethod,
    coupon,
    applyCoupon,
    removeCoupon,
    tip,
    setTip,
    placeOrder,
  } = useShop();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [selectedInstr, setSelectedInstr] = useState([]);
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const address = addresses.find((a) => a.id === selectedAddressId);

  const handleApply = (code) => {
    const res = applyCoupon(code);
    setCouponMsg(res);
    if (res.ok) setCouponInput("");
  };

  const toggleInstr = (text) =>
    setSelectedInstr((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text]
    );

  const handlePlaceOrder = () => {
    if (!address) {
      Alert.alert("Select address", "Please add a delivery address to continue.");
      return;
    }
    Keyboard.dismiss();
    setPlacing(true);

    // Simulates payment / order confirmation. Replace with your real API call.
    timer.current = setTimeout(() => {
      const order = placeOrder({ instructions: selectedInstr, note });
      navigation.reset({
        index: 1,
        routes: [
          { name: "HomeTabs" },
          { name: "OrderSuccess", params: { orderId: order.id } },
        ],
      });
    }, 1800);
  };

  if (cart.length === 0 && !placing) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 60 }}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* DELIVERY ADDRESS */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.card}>
          {address ? (
            <View style={styles.addressRow}>
              <Ionicons name="location" size={24} color={COLORS.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.addrLabel}>
                  {address.label} · {address.name}
                </Text>
                <Text style={styles.addrText}>
                  {address.line1}
                  {address.landmark ? `, ${address.landmark}` : ""}
                </Text>
                <Text style={styles.addrText}>
                  {address.city} - {address.pincode}
                </Text>
                <Text style={styles.addrText}>📞 {address.phone}</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Addresses", { select: true })}
              >
                <Text style={styles.link}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => navigation.navigate("AddAddress")}
            >
              <Ionicons name="add-circle-outline" size={22} color={COLORS.primary} />
              <Text style={styles.link}>  Add delivery address</Text>
            </TouchableOpacity>
          )}
          <View style={styles.etaRow}>
            <Ionicons name="time-outline" size={18} color={COLORS.success} />
            <Text style={styles.etaText}>  Delivery in 30–35 mins</Text>
          </View>
        </View>

        {/* ORDER SUMMARY */}
        <Text style={styles.sectionTitle}>Your Order</Text>
        <View style={styles.card}>
          {cart.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.vegDot} />
              <Text style={styles.itemName} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {formatINR(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.link, { marginTop: 8 }]}>+ Edit cart</Text>
          </TouchableOpacity>
        </View>

        {/* COUPON */}
        <Text style={styles.sectionTitle}>Offers & Coupons</Text>
        <View style={styles.card}>
          {coupon ? (
            <View style={styles.appliedRow}>
              <Ionicons name="pricetag" size={20} color={COLORS.success} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.appliedCode}>{coupon.code} applied</Text>
                <Text style={styles.appliedSub}>
                  You saved {formatINR(bill.discount)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  removeCoupon();
                  setCouponMsg(null);
                }}
              >
                <Text style={[styles.link, { color: COLORS.danger }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon code"
                  placeholderTextColor="#9CA3AF"
                  value={couponInput}
                  autoCapitalize="characters"
                  onChangeText={setCouponInput}
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => handleApply(couponInput)}
                  disabled={!couponInput.trim()}
                >
                  <Text style={styles.applyText}>APPLY</Text>
                </TouchableOpacity>
              </View>
              {couponMsg && (
                <Text
                  style={[
                    styles.couponMsg,
                    { color: couponMsg.ok ? COLORS.success : COLORS.danger },
                  ]}
                >
                  {couponMsg.message}
                </Text>
              )}
              {COUPONS.map((c) => (
                <TouchableOpacity
                  key={c.code}
                  style={styles.couponChip}
                  onPress={() => handleApply(c.code)}
                >
                  <Text style={styles.couponCode}>{c.code}</Text>
                  <Text style={styles.couponTitle}>
                    {c.title} · min ₹{c.minOrder}
                  </Text>
                  <Text style={styles.link}>Tap to apply</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* TIP */}
        <Text style={styles.sectionTitle}>Tip your delivery partner</Text>
        <View style={[styles.card, styles.chipRow]}>
          {TIPS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, tip === t && styles.chipActive]}
              onPress={() => setTip(t)}
            >
              <Text style={[styles.chipText, tip === t && styles.chipTextActive]}>
                {t === 0 ? "No tip" : `₹${t}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* INSTRUCTIONS */}
        <Text style={styles.sectionTitle}>Delivery Instructions</Text>
        <View style={styles.card}>
          <View style={[styles.chipRow, { flexWrap: "wrap" }]}>
            {INSTRUCTIONS.map((text) => {
              const active = selectedInstr.includes(text);
              return (
                <TouchableOpacity
                  key={text}
                  style={[styles.chip, active && styles.chipActive, { marginBottom: 8 }]}
                  onPress={() => toggleInstr(text)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TextInput
            style={styles.noteInput}
            placeholder="Any cooking requests? (e.g. less spicy)"
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* BILL */}
        <Text style={styles.sectionTitle}>Bill Details</Text>
        <View style={styles.card}>
          <Row label="Item total" value={formatINR(bill.itemTotal)} />
          <Row
            label="Delivery fee"
            value={bill.deliveryFee === 0 ? "FREE" : formatINR(bill.deliveryFee)}
            color={bill.deliveryFee === 0 ? COLORS.success : undefined}
          />
          <Row label="Platform fee" value={formatINR(bill.platformFee)} />
          <Row label="GST (5%)" value={formatINR(bill.gst)} />
          {bill.tip > 0 && <Row label="Delivery tip" value={formatINR(bill.tip)} />}
          {bill.discount > 0 && (
            <Row
              label={`Coupon (${coupon?.code})`}
              value={`- ${formatINR(bill.discount)}`}
              color={COLORS.success}
            />
          )}
          <View style={styles.divider} />
          <Row label="To Pay" value={formatINR(bill.grandTotal)} bold />
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payMethod}
          onPress={() => navigation.navigate("Payment")}
        >
          <Ionicons name={PAY_ICON[paymentMethod.type]} size={22} color={COLORS.text} />
          <View style={{ marginLeft: 8, flexShrink: 1 }}>
            <Text style={styles.payLabel}>PAY USING</Text>
            <Text style={styles.payValue} numberOfLines={1}>
              {paymentMethod.label}
            </Text>
          </View>
          <Ionicons name="chevron-up" size={16} color={COLORS.muted} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder} disabled={placing}>
          <Text style={styles.placeBtnTop}>{formatINR(bill.grandTotal)}</Text>
          <Text style={styles.placeBtnText}>Place Order ▸</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={placing} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.overlayText}>
              {paymentMethod.type === "cod"
                ? "Placing your order..."
                : "Processing payment..."}
            </Text>
            <Text style={styles.overlaySub}>Please don't close the app</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 30 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text, marginVertical: 12 },
  primaryBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 13, borderRadius: 12 },
  primaryText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  sectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.text, marginTop: 18, marginBottom: 10 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  link: { color: COLORS.primary, fontWeight: "bold", fontSize: 13 },

  addressRow: { flexDirection: "row", alignItems: "flex-start" },
  addrLabel: { fontSize: 15, fontWeight: "bold", color: COLORS.text, marginBottom: 3 },
  addrText: { fontSize: 13, color: COLORS.muted, lineHeight: 19 },
  addAddressBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  etaRow: { flexDirection: "row", alignItems: "center", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F1F1F1" },
  etaText: { fontSize: 13, color: COLORS.success, fontWeight: "600" },

  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 7 },
  vegDot: { width: 12, height: 12, borderRadius: 3, borderWidth: 1.5, borderColor: COLORS.danger, marginRight: 10 },
  itemName: { flex: 1, fontSize: 14, color: COLORS.text },
  itemQty: { fontSize: 13, color: COLORS.muted, marginHorizontal: 10 },
  itemPrice: { fontSize: 14, fontWeight: "600", color: COLORS.text, minWidth: 70, textAlign: "right" },

  couponInputRow: { flexDirection: "row", alignItems: "center" },
  couponInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, height: 44, color: COLORS.text },
  applyBtn: { marginLeft: 10, backgroundColor: COLORS.primary, paddingHorizontal: 18, height: 44, borderRadius: 10, justifyContent: "center" },
  applyText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  couponMsg: { marginTop: 8, fontSize: 13, fontWeight: "600" },
  couponChip: { marginTop: 10, padding: 12, borderRadius: 10, borderWidth: 1, borderStyle: "dashed", borderColor: COLORS.primary, backgroundColor: "#EFF6FF" },
  couponCode: { fontWeight: "bold", color: COLORS.primary, fontSize: 14 },
  couponTitle: { color: COLORS.muted, fontSize: 12, marginVertical: 3 },
  appliedRow: { flexDirection: "row", alignItems: "center" },
  appliedCode: { fontWeight: "bold", color: COLORS.success, fontSize: 14 },
  appliedSub: { color: COLORS.muted, fontSize: 12, marginTop: 2 },

  chipRow: { flexDirection: "row" },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, backgroundColor: "#fff" },
  chipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.muted, fontWeight: "600" },
  chipTextActive: { color: COLORS.primary },
  noteInput: { marginTop: 4, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, minHeight: 56, textAlignVertical: "top", color: COLORS.text },

  billRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  billLabel: { fontSize: 14, color: COLORS.muted },
  billValue: { fontSize: 14, color: COLORS.text },
  billBold: { fontWeight: "bold", color: COLORS.text, fontSize: 16 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },

  bottomBar: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14,
    borderTopWidth: 1, borderTopColor: COLORS.border, elevation: 10,
  },
  payMethod: { flex: 1, flexDirection: "row", alignItems: "center", paddingRight: 8 },
  payLabel: { fontSize: 10, color: COLORS.muted, fontWeight: "bold" },
  payValue: { fontSize: 14, fontWeight: "bold", color: COLORS.text },
  placeBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 22, alignItems: "center", minWidth: 150 },
  placeBtnTop: { color: "#DBEAFE", fontSize: 12, fontWeight: "600" },
  placeBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  overlayBox: { backgroundColor: "#fff", borderRadius: 16, padding: 28, alignItems: "center", width: 260 },
  overlayText: { marginTop: 16, fontSize: 16, fontWeight: "bold", color: COLORS.text },
  overlaySub: { marginTop: 6, fontSize: 12, color: COLORS.muted },
});
