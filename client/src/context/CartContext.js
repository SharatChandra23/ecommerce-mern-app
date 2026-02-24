import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
    getGuestCart,
    saveGuestCart,
    clearGuestCart,
} from "../utils/cartStorage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem("token");

    // Load Cart
    useEffect(() => {
        const loadCart = async () => {
            if (token) {
                const { data } = await axiosInstance.get("/cart");
                setCartItems(data.items || []);
            } else {
                setCartItems(getGuestCart());
            }
        };

        loadCart();
    }, [token]);

    // Add To Cart
    const addToCart = async (product) => {
        const existing = cartItems.find(
            (item) => item._id === product._id
        );

        if (existing) {
            updateQuantity(product._id, existing.quantity + 1);
            return;
        }

        const newItem = {
            ...product,
            quantity: 1,
        };

        setCartItems([...cartItems, newItem]);

        if (!token) {
            saveGuestCart([...cartItems, newItem]);
        } else {
            await axiosInstance.post("/cart", {
                product: product._id,
                quantity: 1,
            });
        }
    };

    // Update Quantity
    const updateQuantity = async (id, quantity) => {
        const item = cartItems.find((i) => i._id === id);

        if (!item) return;

        if (quantity > item.stock) {
            alert("Not enough stock available");
            return;
        }

        if (quantity < 1) return;

        // Optimistic update
        const updated = cartItems.map((i) =>
            i._id === id ? { ...i, quantity } : i
        );

        setCartItems(updated);

        if (token) {
            try {
                await axiosInstance.put(`/cart/${id}`, { quantity });
            } catch (error) {
                alert("Stock limit reached");
            }
        } else {
            saveGuestCart(updated);
        }
    };

    // Remove Item
    const removeItem = async (id) => {
        if (!token) {
            const cart = getGuestCart().filter(
                (item) => item._id !== id
            );
            saveGuestCart(cart);
            setCartItems(cart);
        } else {
            await axiosInstance.delete(`/cart/${id}`);
            const { data } = await axiosInstance.get("/cart");
            setCartItems(data.items);
        }
    };

    // Merge Guest Cart After Login
    const mergeGuestCart = async () => {
        const guestCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        if (guestCart.length > 0) {
            for (let item of guestCart) {
                await axiosInstance.post("/cart", {
                    product: item._id,
                    quantity: item.quantity,
                });
            }

            localStorage.removeItem("cart");
        }

        const { data } = await axiosInstance.get("/cart");
        setCartItems(data.items);
    };

    const cartCount = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    const cartTotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeItem,
                cartCount,
                cartTotal,
                mergeGuestCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);