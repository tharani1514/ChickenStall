
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Image,
} from "react-native";

import { useShop } from "../Context/ShopContext";

const Cart = ({ navigation }) => {
  const { cart, updateQuantity } = useShop();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>My Cart</Text>
      <Text style={styles.subHeading}>
        {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
      </Text>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyText}>
            Add some products to your cart!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>

                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.details}>

                  <Text style={styles.category}>
                    {item.category}
                  </Text>

                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text style={styles.price}>
                    ₹{item.price.toFixed(2)}
                  </Text>

                  <View style={styles.qtyRow}>

                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Text style={styles.qtyText}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>
                      {item.quantity || 1}
                    </Text>

                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
            )}
          />

          <View style={styles.bottomContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalPrice}>
                ₹{total.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={styles.checkoutText}>
                Proceed to Checkout →
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#2563EB",
  },

  subHeading: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    marginBottom: 18,
  },

  list: {
    paddingBottom: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  imageContainer: {
    width: 105,
    height: 125,
    backgroundColor: "#F8F6FC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  productImage: {
    width: "85%",
    height: "85%",
  },

  details: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  category: {
    fontSize: 11,
    color: "#888",
    textTransform: "capitalize",
    marginBottom: 5,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    lineHeight: 20,
  },

  price: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 8,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  quantityBtn: {
    width: 30,
    height: 30,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  quantity: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginHorizontal: 15,
  },

  bottomContainer: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: -18,
    elevation: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },

  totalPrice: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#2392d2",
  },

  checkoutBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  checkoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 65,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#111827",
  },

  emptyText: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
});
