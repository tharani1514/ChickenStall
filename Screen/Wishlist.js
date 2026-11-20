import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { useShop } from "../Context/ShopContext";
import ProductCart from "../Components/ProductCard";
import { COLORS } from "../Utils/helpers";

const Wishlist = ({ navigation }) => {
  const { wishlist } = useShop();

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 15, flexGrow: 1 }}
        renderItem={({ item }) => <ProductCart product={item} navigation={navigation} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 60 }}>💙</Text>
            <Text style={styles.title}>No favourites yet</Text>
            <Text style={styles.text}>Tap the heart on any dish to save it here.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("HomeTabs")}>
              <Text style={styles.btnText}>Browse Food</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 19, fontWeight: "bold", color: COLORS.text, marginTop: 10 },
  text: { color: COLORS.muted, marginTop: 6, marginBottom: 18 },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 13, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
