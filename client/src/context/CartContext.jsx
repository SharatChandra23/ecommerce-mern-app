import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";
import {
    getGuestCart,
    saveGuestCart,
    clearGuestCart,
} from "../utils/cartStorage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem("accessToken");

    const loadCart = async () => {
        if (!token) {
            setCartItems(getGuestCart());
        } else {
            const { data } = await API.get("/cart");
            setCartItems(data.items || []);
        }
    };

    const mergeGuestCart = async () => {
        if (!token) return;

        const guestCart = getGuestCart();
        if (guestCart.length === 0) return;

        try {
            await API.post("/cart/merge", { guestItems: guestCart });
            clearGuestCart();
            await loadCart();
        } catch (err) {
            if (err.name === "CanceledError") return; // unmount cleanup, ignore
            console.warn("Cart merge failed:", err);
            // guest cart intentionally NOT cleared — preserve items on failure
        }
    };

    useEffect(() => {
        const syncCart = () => {
            if (!token) {
                setCartItems(getGuestCart());
            }
        };

        window.addEventListener("storage", syncCart);

        return () =>
            window.removeEventListener("storage", syncCart);
    }, []);

    // ---------------- ADD TO CART ----------------
    const addToCart = async (product, qty = 1) => {
        if (!token) {
            const existing = getGuestCart();
            const found = existing.find(
                (i) => i.product._id === product._id
            );

            let updated;

            if (found) {
                updated = existing.map((i) =>
                    i.product._id === product._id
                        ? { ...i, quantity: i.quantity + qty }
                        : i
                );
            } else {
                updated = [...existing, { product, quantity: qty }];
            }

            saveGuestCart(updated);
            setCartItems(updated);
        } else {
            // Optimistic update
            const optimistic = [...cartItems];
            const found = optimistic.find(
                (i) => i.product._id === product._id
            );

            if (found) {
                found.quantity += qty;
            } else {
                optimistic.push({ product, quantity: qty });
            }

            setCartItems(optimistic);

            try {
                await API.post("/cart", {
                    productId: product._id,
                    quantity: qty,
                });
            } catch (error) {
                // rollback
                loadCart();
            }
        }
    };

    // ---------------- INCREASE ----------------
    const increaseQty = async (productId) => {
        const item = cartItems.find(
            (i) => i.product._id === productId
        );

        if (!item) return;

        // prevent exceeding stock (frontend safety)
        if (item.product.stock <= item.quantity) {
            alert("Stock limit reached");
            return;
        }

        if (!token) {
            const updated = cartItems.map((i) =>
                i.product._id === productId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            );

            saveGuestCart(updated);
            setCartItems(updated);
        } else {
            const optimistic = cartItems.map((i) =>
                i.product._id === productId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            );

            setCartItems(optimistic);

            try {
                await API.put(`/cart/increase/${productId}`);
            } catch {
                loadCart();
            }
        }
    };

    // ---------------- DECREASE ----------------
    const decreaseQty = async (productId) => {
        if (!token) {
            const updated = cartItems
                .map((item) =>
                    item.product._id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);

            saveGuestCart(updated);
            setCartItems(updated);
        } else {
            await API.put(`/cart/decrease/${productId}`);
            await loadCart();
        }
    };

    // ---------------- REMOVE ----------------
    const removeItem = async (productId) => {
        if (!token) {
            const updated = cartItems.filter(
                (item) => item.product._id !== productId
            );
            saveGuestCart(updated);
            setCartItems(updated);
        } else {
            await API.delete(`/cart/${productId}`);
            await loadCart();
        }
    };

    // ---------------- CLEAR ----------------
    const clearCart = async () => {
        if (!token) {
            clearGuestCart();
            setCartItems([]);
        } else {
            await API.delete("/cart/clear");
            setCartItems([]);
        }
    };

    // ---------------- COUNT ----------------
    const cartCount = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    const cartTotal = cartItems.reduce(
        (acc, item) =>
            acc +
            (item.product.discountPrice || item.product.price) *
            item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQty,
                decreaseQty,
                removeItem,
                clearCart,
                mergeGuestCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);