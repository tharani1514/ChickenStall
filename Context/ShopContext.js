
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { COUPONS, calculateBill } from "../Utils/helpers";

// Create Context
const ShopContext = createContext(null);

// Provider Component
const ShopContextProvider = ({ children }) => {

  // Catalogue
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cart / Wishlist
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Checkout
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState({
    type: "cod",
    label: "Cash on Delivery",
  });

  const [coupon, setCoupon] = useState(null);
  const [tip, setTip] = useState(0);
  const [orders, setOrders] = useState([]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const formattedProducts = Array.isArray(data.meals)
        ? data.meals.map((item) => ({
            image: item.strMealThumb,
            category: item.strCategory,
            description: item.strInstructions,
            id: item.idMeal,
            title: item.strMeal,
            area: item.strArea,
            price: 89.90,
          }))
        : [];

      setProducts(formattedProducts);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + change),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return prev.filter(
          (item) => item.id !== product.id
        );
      }

      return [...prev, product];
    });
  };

  // Addresses
  const addAddress = (data) => {
    const id = Date.now().toString();

    setAddresses((prev) => [
      ...prev,
      { ...data, id },
    ]);

    setSelectedAddressId(id);
    return id;
  };

  const updateAddress = (id, data) => {
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, ...data } : a
      )
    );
  };

  const removeAddress = (id) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);

      if (selectedAddressId === id) {
        setSelectedAddressId(
          next.length ? next[0].id : null
        );
      }

      return next;
    });
  };

  const selectAddress = (id) => {
    setSelectedAddressId(id);
  };

  // Bill Calculation
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const bill = useMemo(
    () => calculateBill(cart, coupon, tip),
    [cart, coupon, tip]
  );

  const cartTotal = bill.itemTotal;

  // Coupons
  const applyCoupon = (code) => {
    const found = COUPONS.find(
      (c) =>
        c.code === String(code).trim().toUpperCase()
    );

    if (!found) {
      return {
        ok: false,
        message: "Invalid coupon code",
      };
    }

    if (bill.itemTotal < found.minOrder) {
      const need = (
        found.minOrder - bill.itemTotal
      ).toFixed(2);

      return {
        ok: false,
        message: `Add items worth ₹${need} more to use ${found.code}`,
      };
    }

    setCoupon(found);

    return {
      ok: true,
      message: `${found.code} applied!`,
    };
  };

  const removeCoupon = () => setCoupon(null);

  // Orders
  const placeOrder = ({
    instructions = [],
    note = "",
  } = {}) => {
    const address = addresses.find(
      (a) => a.id === selectedAddressId
    );

    const order = {
      id: `FW${Date.now().toString().slice(-8)}`,
      items: cart,
      bill,
      address,
      payment: paymentMethod,
      coupon: coupon ? coupon.code : null,
      instructions,
      note,
      createdAt: Date.now(),
      cancelled: false,
    };

    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setCoupon(null);
    setTip(0);

    return order;
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, cancelled: true }
          : o
      )
    );
  };

  // Context Values
  const value = {
    products,
    cart,
    wishlist,
    loading,
    error,

    addresses,
    selectedAddressId,
    paymentMethod,
    coupon,
    tip,
    orders,
    bill,

    fetchProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,

    addAddress,
    updateAddress,
    removeAddress,
    selectAddress,
    setPaymentMethod,
    setTip,
    applyCoupon,
    removeCoupon,
    placeOrder,
    cancelOrder,

    cartCount,
    cartTotal,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

// Export Provider
export default ShopContextProvider;

// Custom Hook
export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used within a ShopContextProvider"
    );
  }

  return context;
};
