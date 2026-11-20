
import React from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";

import { useShop } from "../Context/ShopContext";

const Product = ({ route, navigation }) => {

  const { product } = route.params;

  const { addToCart } = useShop();

  const handleAddToCart = () => {

    if (addToCart) {
      addToCart(product);

      Alert.alert(
        "Success",
        "Product added to your cart!"
      );
    } else {
      Alert.alert(
        "Error",
        "Add to cart function is not available."
      );
    }

  };

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.imageContainer}>

          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />

        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>

          {/* Category */}
          <Text style={styles.category}>
            {product.category}
          </Text>

          {/* Product Name */}
          <Text style={styles.title}>
            {product.title}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>

            <Text style={styles.rating}>
              ⭐ {product.rating?.rate ?? "N/A"}
            </Text>

            <Text style={styles.review}>
              ({product.rating?.count ?? 0} reviews)
            </Text>

          </View>

          {/* Price */}
          <Text style={styles.price}>
            ₹{Number(product.price).toFixed(2)}
          </Text>

          {/* Description */}
          <Text style={styles.sectionTitle}>
            Product Description
          </Text>

          <Text style={styles.description}>
            {product.description || "No description available."}
          </Text>

          {/* Product Information */}
          <View style={styles.infoContainer}>

            <Text style={styles.infoTitle}>
              Product Information
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>
                {product.category}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Product ID</Text>
              <Text style={styles.infoValue}>
                #{product.id}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Availability</Text>
              <Text style={styles.available}>
                In Stock
              </Text>
            </View>

          </View>

        </View>

      </ScrollView>

      {/* Bottom Add to Cart Button */}
      <View style={styles.bottomContainer}>

        <View>
          <Text style={styles.bottomLabel}>
            Total Price
          </Text>

          <Text style={styles.bottomPrice}>
            ₹{Number(product.price).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleAddToCart}
        >

          <Text style={styles.cartButtonText}>
            🛒 Add to Cart
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
};

export default Product;


// STYLES
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 25,
  },

  imageContainer: {
    height: 300,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    borderRadius: 18,
    elevation: 3,
  },

  productImage: {
    width: "80%",
    height: "85%",
  },

  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  category: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    lineHeight: 30,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  rating: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#F59E0B",
  },

  review: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 8,
  },

  price: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 25,
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 23,
    textAlign: "justify",
  },

  infoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    elevation: 2,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  infoValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },

  available: {
    fontSize: 13,
    color: "#16A34A",
    fontWeight: "bold",
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  bottomLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  bottomPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 3,
  },

  cartButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 12,
  },

  cartButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

});
