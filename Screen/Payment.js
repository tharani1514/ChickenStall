
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../Context/ShopContext";
import { COLORS, formatINR } from "../Utils/helpers";

const METHODS = [
  {
    type: "upi",
    title: "UPI",
    sub: "Google Pay, PhonePe, Paytm & more",
    icon: "phone-portrait-outline",
  },
  {
    type: "card",
    title: "Credit / Debit Card",
    sub: "Visa, Mastercard, RuPay",
    icon: "card-outline",
  },
  {
    type: "cod",
    title: "Cash on Delivery",
    sub: "Pay when your food arrives",
    icon: "cash-outline",
  },
];

// Validate card expiry date
const validExpiry = (value) => {
  const match = value.match(/^(\d{2})\/(\d{2})$/);

  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(match[2]);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  return (
    year > currentYear ||
    (year === currentYear && month >= currentMonth)
  );
};

const Payment = ({ navigation }) => {
  const { paymentMethod, setPaymentMethod, bill } = useShop();

  const [type, setType] = useState(paymentMethod?.type || "upi");

  const [upiId, setUpiId] = useState(paymentMethod?.upiId || "");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const [errors, setErrors] = useState({});

  // Format card number
  const formatCard = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  // Format expiry date as MM/YY
  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    return digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  };

  // Confirm payment method
  const handleConfirm = () => {
    const newErrors = {};

    if (type === "upi") {
      const validUpi = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

      if (!validUpi.test(upiId.trim())) {
        newErrors.upi =
          "Enter a valid UPI ID (e.g. name@okaxis)";
      }
    }

    if (type === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.card = "Enter a valid 16-digit card number";
      }

      if (!validExpiry(expiry)) {
        newErrors.expiry = "Enter a valid expiry date";
      }

      if (!/^\d{3}$/.test(cvv)) {
        newErrors.cvv = "Enter a valid 3-digit CVV";
      }

      if (cardName.trim().length < 2) {
        newErrors.cardName = "Enter name on card";
      }
    }

    setErrors(newErrors);

    // Stop if validation fails
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Save selected payment method
    let selectedMethod;

    if (type === "cod") {
      selectedMethod = {
        type: "cod",
        label: "Cash on Delivery",
      };
    }

    if (type === "upi") {
      selectedMethod = {
        type: "upi",
        label: `UPI · ${upiId.trim()}`,
        upiId: upiId.trim(),
      };
    }

    if (type === "card") {
      const last4 = cardNumber.replace(/\s/g, "").slice(-4);

      selectedMethod = {
        type: "card",
        label: `Card •••• ${last4}`,
        last4,
      };
    }

    setPaymentMethod(selectedMethod);

    // Navigate to Payment Success screen
    navigation.replace("PaymentSuccess", {
      paymentId: "PAY123456789",
      paymentMethod: type,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.amount}>
          Amount to pay: {formatINR(bill.grandTotal)}
        </Text>

        {METHODS.map((method) => {
          const active = type === method.type;

          return (
            <View
              key={method.type}
              style={[
                styles.card,
                active && styles.cardActive,
              ]}
            >
              <TouchableOpacity
                style={styles.methodRow}
                onPress={() => {
                  setType(method.type);
                  setErrors({});
                }}
              >
                <Ionicons
                  name={method.icon}
                  size={26}
                  color={COLORS.primary}
                />

                <View style={styles.methodInfo}>
                  <Text style={styles.methodTitle}>
                    {method.title}
                  </Text>

                  <Text style={styles.methodSub}>
                    {method.sub}
                  </Text>
                </View>

                <Ionicons
                  name={
                    active
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color={
                    active ? COLORS.primary : "#9CA3AF"
                  }
                />
              </TouchableOpacity>

              {/* UPI Form */}
              {active && method.type === "upi" && (
                <View style={styles.form}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.upi && styles.inputError,
                    ]}
                    placeholder="yourname@upi"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={upiId}
                    onChangeText={setUpiId}
                  />

                  {errors.upi && (
                    <Text style={styles.error}>
                      {errors.upi}
                    </Text>
                  )}
                </View>
              )}

              {/* Card Form */}
              {active && method.type === "card" && (
                <View style={styles.form}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.card && styles.inputError,
                    ]}
                    placeholder="Card number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={cardNumber}
                    onChangeText={(value) =>
                      setCardNumber(formatCard(value))
                    }
                    maxLength={19}
                  />

                  {errors.card && (
                    <Text style={styles.error}>
                      {errors.card}
                    </Text>
                  )}

                  <View style={styles.cardRow}>
                    <View style={styles.cardHalf}>
                      <TextInput
                        style={[
                          styles.input,
                          errors.expiry && styles.inputError,
                        ]}
                        placeholder="MM/YY"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        value={expiry}
                        onChangeText={(value) =>
                          setExpiry(formatExpiry(value))
                        }
                        maxLength={5}
                      />

                      {errors.expiry && (
                        <Text style={styles.error}>
                          {errors.expiry}
                        </Text>
                      )}
                    </View>

                    <View style={styles.cardHalf}>
                      <TextInput
                        style={[
                          styles.input,
                          errors.cvv && styles.inputError,
                        ]}
                        placeholder="CVV"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        secureTextEntry
                        value={cvv}
                        onChangeText={(value) =>
                          setCvv(
                            value.replace(/\D/g, "").slice(0, 3)
                          )
                        }
                        maxLength={3}
                      />

                      {errors.cvv && (
                        <Text style={styles.error}>
                          {errors.cvv}
                        </Text>
                      )}
                    </View>
                  </View>

                  <TextInput
                    style={[
                      styles.input,
                      styles.nameInput,
                      errors.cardName && styles.inputError,
                    ]}
                    placeholder="Name on card"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    value={cardName}
                    onChangeText={setCardName}
                  />

                  {errors.cardName && (
                    <Text style={styles.error}>
                      {errors.cardName}
                    </Text>
                  )}

                  <Text style={styles.secure}>
                    🔒 Card details are not saved on this device.
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Pay Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            Pay Now · {formatINR(bill.grandTotal)}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scrollContent: {
    padding: 16,
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardActive: {
    borderColor: COLORS.primary,
  },

  methodRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  methodInfo: {
    flex: 1,
    marginLeft: 14,
  },

  methodTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
  },

  methodSub: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },

  form: {
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: "#fff",
  },

  inputError: {
    borderColor: COLORS.danger,
  },

  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },

  cardRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  cardHalf: {
    flex: 1,
    marginRight: 10,
  },

  nameInput: {
    marginTop: 10,
  },

  secure: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 12,
  },

  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
