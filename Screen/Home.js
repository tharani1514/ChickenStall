
import React, { useState } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Keyboard,
} from "react-native";

import { useShop } from "../Context/ShopContext";
import ProductCart from "../Components/ProductCard";

const Home = ({ navigation }) => {

  const {
    products,
    loading,
    error,
    fetchProducts
  } = useShop();

  // ==============================
  // STATES
  // ==============================

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");


  // ==============================
  // CATEGORIES
  // ==============================

  const cat = [
    "Briyani",
    "Chinese",
    "Vegetarian",
    "Fast Food",
    "Desserts",
    "Beverages",
  ];


  // ==============================
  // FILTER PRODUCTS
  // ==============================

  const filteredProducts = products.filter((item) => {

    const searchText = search.trim().toLowerCase();

    // Search filter
    const matchesSearch =
      !searchText ||
      item.title?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText);

    // Category filter
    const matchesCategory =
      selectedCategory === "All" ||
      item.category?.toLowerCase().includes(
        selectedCategory.toLowerCase()
      );

    return matchesSearch && matchesCategory;

  });


  // ==============================
  // SEARCH SUGGESTIONS
  // ==============================

  const suggestions = filteredProducts.slice(0, 5);


  // ==============================
  // HANDLE SUGGESTION
  // ==============================

  const handleSuggestion = (item) => {

    setShowSuggestions(false);
    setSearch("");

    Keyboard.dismiss();

    navigation.navigate("Product", {
      product: item,
    });

  };


  // ==============================
  // HANDLE CATEGORY
  // ==============================

  const handleCategory = (category) => {

    setSelectedCategory(category);

    setShowSuggestions(false);

    Keyboard.dismiss();

  };


  // ==============================
  // HOME HEADER
  // ==============================

  const renderHome = () => (

    <View>

      {/* WELCOME SECTION */}

      <Text style={Styles.heading}>
        Welcome to Chicken World
      </Text>

      <Text style={Styles.welcomeText}>
        Find your favourite Chicken Dishes
      </Text>


      {/* SEARCH BAR */}

      <View style={Styles.searchContainer}>

        <Text style={Styles.searchIcon}>
          🔍
        </Text>

        <TextInput
          style={Styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={search}

          onChangeText={(value) => {

            setSearch(value);
            setShowSuggestions(true);

          }}

          onFocus={() => setShowSuggestions(true)}

          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />

        {search.length > 0 && (

          <TouchableOpacity
            onPress={() => {

              setSearch("");
              setShowSuggestions(true);

            }}
          >

            <Text style={Styles.clearIcon}>
              ✕
            </Text>

          </TouchableOpacity>

        )}

      </View>


      {/* SEARCH SUGGESTIONS */}

      {search.trim().length > 0 && showSuggestions && (

        <View style={Styles.suggestionContainer}>

          {suggestions.length > 0 ? (

            suggestions.map((item) => (

              <TouchableOpacity
                key={item.id}
                style={Styles.suggestionItem}
                onPress={() => handleSuggestion(item)}
              >

                <Image
                  source={{ uri: item.image }}
                  style={Styles.suggestionImage}
                  resizeMode="contain"
                />

                <View style={Styles.suggestionDetails}>

                  <Text
                    style={Styles.suggestionTitle}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <Text style={Styles.suggestionPrice}>
                    ₹{Number(item.price).toFixed(2)}
                  </Text>

                </View>

              </TouchableOpacity>

            ))

          ) : (

            <Text style={Styles.noSuggestion}>
              No products found
            </Text>

          )}

        </View>

      )}


      {/* EXPLORE CATEGORIES */}

      <Text style={Styles.subHeading}>
        Explore Categories
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={Styles.categoryScroll}
      >

        {["All", ...cat].map((c) => (

          <TouchableOpacity
            key={c}

            style={[
              Styles.catCard,
              selectedCategory === c &&
                Styles.activeCatCard
            ]}

            onPress={() => handleCategory(c)}
          >

            <Text
              style={[
                Styles.catText,
                selectedCategory === c &&
                  Styles.activeCatText
              ]}
            >
              {c}
            </Text>

          </TouchableOpacity>

        ))}

      </ScrollView>


      {/* HORIZONTAL IMAGE BANNERS */}

      <Text style={Styles.subHeading}>
        Special Offers
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={Styles.bannerScroll}
      >

        {/* BANNER 1 */}

        <ImageBackground
          source={require("../assets/images (1).jpg")}
          style={Styles.banner}
          imageStyle={Styles.bannerImage}
          resizeMode="cover"
        >

          <View style={Styles.bannerOverlay}>

            <Text style={Styles.bannerTitle}>
              Delicious Food
            </Text>

            <Text style={Styles.bannerSubTitle}>
              Discover your favourite dishes!
            </Text>

          </View>

        </ImageBackground>


        {/* BANNER 2 */}

        <ImageBackground
          source={require("../assets/images (2).jpg")}
          style={Styles.banner}
          imageStyle={Styles.bannerImage}
          resizeMode="cover"
        >

          <View style={Styles.bannerOverlay}>

            <Text style={Styles.bannerTitle}>
              Special Food Offers
            </Text>

            <Text style={Styles.bannerSubTitle}>
              Enjoy delicious meals every day!
            </Text>

          </View>

        </ImageBackground>

      </ScrollView>


      {/* PRODUCT HEADING */}

      <Text style={Styles.subHeading}>

        {selectedCategory !== "All"
          ? `${selectedCategory} Products`
          : search.trim()
          ? "Search Results"
          : "All Products"}

      </Text>

    </View>

  );


  // ==============================
  // LOADING SCREEN
  // ==============================

  if (loading && products.length === 0) {

    return (

      <View style={Styles.center}>

        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={Styles.loadingText}>
          Loading Products...
        </Text>

      </View>

    );

  }


  // ==============================
  // ERROR SCREEN
  // ==============================

  if (error && products.length === 0) {

    return (

      <View style={Styles.center}>

        <Text style={Styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={Styles.retryBtn}
          onPress={fetchProducts}
        >

          <Text style={Styles.retryText}>
            Try Again
          </Text>

        </TouchableOpacity>

      </View>

    );

  }


  // ==============================
  // MAIN HOME SCREEN
  // ==============================

  return (

    <View style={Styles.container}>

      <FlatList

        data={filteredProducts}

        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }

        renderItem={({ item }) => (

          <ProductCart
            product={item}
            navigation={navigation}
          />

        )}

        numColumns={2}

        columnWrapperStyle={{
          justifyContent: "space-between"
        }}

        ListHeaderComponent={renderHome}

        ListEmptyComponent={

          <Text style={Styles.empty}>

            {search.trim() || selectedCategory !== "All"
              ? "No matching products found!"
              : "No Products Available"}

          </Text>

        }

        refreshing={loading}

        onRefresh={fetchProducts}

        showsVerticalScrollIndicator={false}

        contentContainerStyle={Styles.listContent}

        keyboardShouldPersistTaps="handled"

      />

    </View>

  );

};

export default Home;


// ==========================================
// STYLES
// ==========================================

const Styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  listContent: {
    padding: 15,
    paddingBottom: 30,
  },


  // WELCOME

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },

  welcomeText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 15,
  },


  // SEARCH BAR

  searchContainer: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },

  searchIcon: {
    fontSize: 19,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#54668c",
  },

  clearIcon: {
    fontSize: 19,
    color: "#6B7280",
    padding: 5,
  },


  // SEARCH SUGGESTIONS

  suggestionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#413e3e",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    overflow: "hidden",
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  suggestionImage: {
    width: 55,
    height: 55,
    marginRight: 12,
  },

  suggestionDetails: {
    flex: 1,
  },

  suggestionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  suggestionPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 5,
  },

  noSuggestion: {
    textAlign: "center",
    color: "#888",
    padding: 18,
    fontSize: 14,
  },


  // CATEGORIES

  subHeading: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 15,
    marginBottom: 15,
  },

  categoryScroll: {
    marginBottom: 15,
  },

  catCard: {
    backgroundColor: "#DBEAFE",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginRight: 12,
  },

  catText: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "bold",
  },

  activeCatCard: {
    backgroundColor: "#2563EB",
    borderWidth: 1,
    borderColor: "#1D4ED8",
  },

  activeCatText: {
    color: "#FFFFFF",
  },


  // HORIZONTAL BANNERS

  bannerScroll: {
    marginBottom: 10,
  },

  banner: {
    height: 170,
    width: 330,
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
    borderRadius: 12,
  },

  bannerImage: {
    borderRadius: 12,
  },

  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
    borderRadius: 12,
  },

  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  bannerSubTitle: {
    fontSize: 13,
    color: "#FFFFFF",
    marginTop: 8,
  },


  // LOADING AND ERROR

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },

  errorText: {
    color: "red",
    fontSize: 16,
  },

  retryBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },


  // EMPTY PRODUCTS

  empty: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#6B7280",
  },

});
