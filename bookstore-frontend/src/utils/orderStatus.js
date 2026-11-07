export const ORDER_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

// Which status can come next? (The backend is the real judge. This only decides which buttons we show.)
export const NEXT_STATUSES = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const STATUS_ACTION_LABELS = {
  CONFIRMED: "Confirm order",
  SHIPPED: "Mark as shipped",
  DELIVERED: "Mark as delivered",
  CANCELLED: "Cancel order",
};

export const STATUS_CONFIRM_MESSAGES = {
  CONFIRMED: "Confirm this order? The customer will see it as Confirmed.",
  SHIPPED: "Mark this order as shipped?",
  DELIVERED:
    "Mark this order as delivered? The payment will be marked as Paid (cash on delivery). This cannot be changed later.",
  CANCELLED: "Cancel this order? The books will go back to stock. This cannot be undone.",
};

export const statusLabel = (status) => status.charAt(0) + status.slice(1).toLowerCase();