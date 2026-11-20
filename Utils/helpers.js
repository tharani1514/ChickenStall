// Shared constants + helpers for the checkout flow

export const COLORS = {
  primary: "#2563EB",
  primaryLight: "#DBEAFE",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  danger: "#EF4444",
  warning: "#F59E0B",
};

export const formatINR = (n) => `₹${Number(n || 0).toFixed(2)}`;

// ---------- Billing ----------
export const DELIVERY_FEE = 35;
export const FREE_DELIVERY_ABOVE = 499;
export const PLATFORM_FEE = 5;
export const GST_RATE = 0.05;

export const COUPONS = [
  { code: "WELCOME50", title: "50% off up to ₹100", minOrder: 199, type: "percent", value: 50, maxDiscount: 100 },
  { code: "FOODIE20", title: "20% off up to ₹80", minOrder: 149, type: "percent", value: 20, maxDiscount: 80 },
  { code: "FREEDEL", title: "Free delivery", minOrder: 99, type: "freedelivery" },
];

export const calculateBill = (items, coupon, tip = 0) => {
  const itemTotal = items.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
  const deliveryFee =
    itemTotal === 0 ? 0 : itemTotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const platformFee = itemTotal > 0 ? PLATFORM_FEE : 0;
  const gst = +(itemTotal * GST_RATE).toFixed(2);

  let discount = 0;
  if (coupon && itemTotal >= coupon.minOrder) {
    if (coupon.type === "percent") {
      discount = Math.min((itemTotal * coupon.value) / 100, coupon.maxDiscount);
    } else if (coupon.type === "freedelivery") {
      discount = deliveryFee;
    }
  }
  discount = +discount.toFixed(2);

  const grandTotal = Math.max(
    0,
    itemTotal + deliveryFee + platformFee + gst + tip - discount
  );

  return {
    itemTotal: +itemTotal.toFixed(2),
    deliveryFee,
    platformFee,
    gst,
    discount,
    tip,
    grandTotal: +grandTotal.toFixed(2),
  };
};

// ---------- Order tracking ----------
// DEMO timings (seconds after order is placed). Increase for a realistic feel,
// e.g. 0 / 300 / 900 / 1800.
export const ORDER_STAGES = [
  { key: "placed", title: "Order Placed", subtitle: "We've received your order", at: 0, icon: "receipt-outline" },
  { key: "preparing", title: "Preparing your food", subtitle: "The restaurant is cooking", at: 10, icon: "restaurant-outline" },
  { key: "onway", title: "Out for delivery", subtitle: "Your partner is on the way", at: 30, icon: "bicycle-outline" },
  { key: "delivered", title: "Delivered", subtitle: "Enjoy your meal!", at: 60, icon: "checkmark-done-outline" },
];

export const TOTAL_DELIVERY_SECONDS = ORDER_STAGES[ORDER_STAGES.length - 1].at;

// -1 = cancelled, otherwise index into ORDER_STAGES
export const getStageIndex = (order, now = Date.now()) => {
  if (order.cancelled) return -1;
  const elapsed = (now - order.createdAt) / 1000;
  let idx = 0;
  ORDER_STAGES.forEach((s, i) => {
    if (elapsed >= s.at) idx = i;
  });
  return idx;
};

export const getStatusLabel = (order, now = Date.now()) => {
  const idx = getStageIndex(order, now);
  if (idx === -1) return "Cancelled";
  return ORDER_STAGES[idx].title;
};
