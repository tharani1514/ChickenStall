
import React from "react";

import {
  Alert,
  Pressable,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useShop } from "../Context/ShopContext";

const ProductCart = ({ product, navigation }) => {

  const {
    addToCart,
    toggleWishlist,
    wishlist
  } = useShop();

  const isFav = wishlist.some(
    (item) => item.id === product.id
  );

  return (

    <View style={Styles.Card}>

      {/* Wishlist Icon */}

      <TouchableOpacity
        style={Styles.wishlistButton}
        onPress={() => toggleWishlist(product)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFav ? "heart" : "heart-outline"}
          size={25}
          color={isFav ? "#EF4444" : "#64748B"}
        />
      </TouchableOpacity>


      {/* Product Image and Details */}

      <Pressable
        onPress={() => {
          if (navigation) {
            navigation.navigate("Product", { product });
          }
        }}

        onLongPress={() =>
          Alert.alert(
            product.title,
            `Price: ₹${product.price}`
          )
        }

        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >

        <View style={Styles.imageContainer}>

          <Image
            source={{ uri: product.image }}
            style={Styles.image}
            resizeMode="contain"
          />

        </View>

        <Text
          style={Styles.category}
          numberOfLines={1}
        >
          {product.category}
        </Text>

        <Text
          style={Styles.title}
          numberOfLines={2}
        >
          {product.title}
        </Text>

        <View style={Styles.priceContainer}>

          <Text style={Styles.price}>
            ₹{product.price.toFixed(2)}
          </Text>

          <Text style={Styles.currency}>
            INR
          </Text>

        </View>

      </Pressable>


      {/* Add to Cart Button */}

      <TouchableOpacity
        style={Styles.CartButton}
        activeOpacity={0.8}
        onPress={() => addToCart(product)}
      >

        <Ionicons
          name="cart-outline"
          size={18}
          color="#FFFFFF"
        />

        <Text style={Styles.buttonText}>
          Add to Cart
        </Text>

      </TouchableOpacity>

    </View>
  );
};

export default ProductCart;


const Styles = StyleSheet.create({

  Card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,

    elevation: 4,
    boxShadow: "0px 2px 10px rgba(20, 19, 19, 0.08)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    position: "relative",
  },

  wishlistButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,

    width: 36,
    height: 36,
    borderRadius: 20,

    backgroundColor: "#fefeff",

    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    height: 200,
    width: "100%",

    backgroundColor: "#F8FAFC",
    borderRadius: 12,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
  },

  image: {
    width: "85%",
    height: "85%",
  },

  category: {
    fontSize: 11,
    color: "#64748B",
    textTransform: "capitalize",
    marginBottom: 5,
  },

  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    lineHeight: 19,
    height: 38,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },

  currency: {
    fontSize: 10,
    color: "#64748B",
    marginLeft: 5,
  },

  CartButton: {
    backgroundColor: "#2563EB",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    paddingVertical: 11,
    borderRadius: 9,
    gap: 7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

});
