
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../Context/CartContext';

const products = [
  { id: '1', name: 'Bijili', price: 120, image: require('../assets/bijili.png') },
  { id: '2', name: 'Bomb', price: 250, image: require('../assets/bomb.png') },
  { id: '3', name: 'Fancy ', price: 180, image: require('../assets/fancy.png') },
  { id: '4', name: 'Flower pot', price: 300, image: require('../assets/flowerpot.png') },
  { id: '5', name: 'Ground Chakara', price: 220, image: require('../assets/groundchakra.png') },
  { id: '6', name: 'Paper Bombs', price: 150, image: require('../assets/paperbomb.png') },
  { id: '7', name: 'Peacock Crackers', price: 100, image: require('../assets/peacock.png') },
  { id: '8', name: 'Rocket', price: 350, image: require('../assets/rocket.png') },
  { id: '9', name: 'Sky Shots', price: 280, image: require('../assets/skyshot.png') },
  { id: '10', name: 'Sparkler', price: 999, image: require('../assets/sparkler.png') },
];

const categories = [
  'All', 'Sparklers', 'Flower Pots', 'Chakkars',
  'Aerial', 'Sound Crackers', 'Fancy', 'Combos',
];

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Crackers</Text>
      <Text style={styles.subtitle}>
        Search the CrackersKart collection
      </Text>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={22} color="#D4AF37" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search sparklers, rockets..."
          placeholderTextColor="#A69AB8"
          style={styles.input}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={21} color="#A69AB8" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryList}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.activeChip,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultText}>
        {filteredProducts.length} products found
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.card}>
              <Image
                source={product.image}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.details}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.price}>₹{product.price}</Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    addToCart(product);
                    Alert.alert('Added to cart', `${product.name} added.`);
                  }}
                >
                  <Ionicons name="cart-outline" size={17} color="#170D26" />
                  <Text style={styles.addText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={55} color="#806A99" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              Try another name or choose All categories.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.resetText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100B1D',
    paddingHorizontal: 14,
    paddingTop: 50,
  },
  title: {
    color: '#D4AF37',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#C4B8D8',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#211532',
    borderColor: '#49345F',
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    height: 52,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 10,
  },
  categoryScroll: {
    flexGrow: 0,
    marginTop: 17,
    marginBottom: 12,
  },
  categoryList: {
    gap: 8,
    paddingRight: 8,
  },
  categoryChip: {
    borderColor: '#49345F',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#211532',
  },
  activeChip: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  categoryText: {
    color: '#C4B8D8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#170D26',
  },
  resultText: {
    color: '#A69AB8',
    fontSize: 12,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  card: {
    width: '48.5%',
    backgroundColor: '#211532',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#49345F',
    marginBottom: 14,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#170D26',
  },
  details: {
    padding: 10,
  },
  productName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    minHeight: 36,
  },
  price: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 9,
  },
  addButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  addText: {
    color: '#170D26',
    fontWeight: 'bold',
    fontSize: 11,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 70,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyText: {
    color: '#C4B8D8',
    textAlign: 'center',
    marginTop: 7,
  },
  resetText: {
    color: '#D4AF37',
    marginTop: 18,
    fontWeight: 'bold',
  },
});
