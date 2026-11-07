import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  clearCartRequest,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi";
import useAuth from "../hooks/useAuth";
import { parseApiError } from "../utils/errorHelper";
import { CartContext } from "./CartContext";

const EMPTY_CART = { cartId: null, items: [], totalItems: 0, totalAmount: 0 };

export default function CartProvider({ children }) {
  const { user, isCustomer } = useAuth();
  const userId = isCustomer ? user.userId : null;

  // We remember WHOSE cart this is, so one user never sees another user's cart
  const [cartState, setCartState] = useState({ userId: null, cart: null, error: "" });

  // Load the cart when a customer logs in (or the page is refreshed)
  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    getCart()
      .then((response) => {
        if (!ignore) setCartState({ userId, cart: response.data, error: "" });
      })
      .catch((err) => {
        if (!ignore) setCartState({ userId, cart: null, error: parseApiError(err).message });
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  const refreshCart = useCallback(async () => {
    if (!userId) return;
    const response = await getCart();
    setCartState({ userId, cart: response.data, error: "" });
  }, [userId]);

  const addItem = useCallback(
    async (bookId, quantity) => {
      const response = await addCartItem({ bookId, quantity });
      setCartState({ userId, cart: response.data, error: "" });
    },
    [userId]
  );

  const updateItem = useCallback(
    async (cartItemId, quantity) => {
      const response = await updateCartItem(cartItemId, { quantity });
      setCartState({ userId, cart: response.data, error: "" });
    },
    [userId]
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      const response = await removeCartItem(cartItemId);
      setCartState({ userId, cart: response.data, error: "" });
    },
    [userId]
  );

  const clearCart = useCallback(async () => {
    await clearCartRequest();
    setCartState({ userId, cart: EMPTY_CART, error: "" });
  }, [userId]);

  // ---------- Values for the screens (calculated, not stored) ----------
  const isCurrent = cartState.userId === userId;
  const cart = isCurrent && cartState.cart ? cartState.cart : EMPTY_CART;
  const cartLoading = Boolean(userId) && !isCurrent;
  const cartError = isCurrent ? cartState.error : "";

  const value = useMemo(
    () => ({
      cart,
      cartCount: cart.totalItems,
      cartLoading,
      cartError,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      refreshCart,
    }),
    [cart, cartLoading, cartError, addItem, updateItem, removeItem, clearCart, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}