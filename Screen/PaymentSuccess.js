
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PaymentSuccess = ({ navigation, route }) => {
  const paymentId =
    route?.params?.paymentId || "PAY123456789";

  const paymentMethod =
    route?.params?.paymentMethod || "upi";

  const isCOD = paymentMethod === "cod";

  const goHome = () => {
    navigation.navigate("HomeTabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.successCircle}>
        <Ionicons
          name={isCOD ? "checkmark" : "checkmark-done"}
          size={75}
          color="#fff"
        />
      </View>

      <Text style={styles.title}>
        {isCOD ? "Order Confirmed!" : "Payment Successful!"}
      </Text>

      <Text style={styles.subtitle}>
        {isCOD
          ? "Your order has been placed successfully. Pay when your food arrives."
          : "Your payment has been completed successfully."}
      </Text>

      <View style={styles.detailsCard}>
        <Text style={styles.label}>
          {isCOD ? "Order Reference" : "Transaction ID"}
        </Text>

        <Text style={styles.paymentId}>
          {paymentId}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Payment Method</Text>

        <Text style={styles.value}>
          {paymentMethod.toUpperCase()}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.status}>
          <Ionicons
            name="checkmark-circle"
            size={17}
            color="#16A34A"
          />{" "}
          {isCOD ? "Order Placed" : "Payment Completed"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={goHome}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          Back to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#172033",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 23,
  },

  detailsCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 35,
    elevation: 3,
  },

  label: {
    color: "#64748B",
    fontSize: 13,
  },

  paymentId: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#172033",
    marginTop: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#172033",
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  status: {
    fontSize: 15,
    fontWeight: "600",
    color: "#16A34A",
  },

  button: {
    width: "100%",
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
