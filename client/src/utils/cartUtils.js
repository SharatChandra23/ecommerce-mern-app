export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveGuestCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToGuestCart = (product) => {
  const cart = getGuestCart();

  const existingItem = cart.find(
    (item) => item._id === product._id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveGuestCart(cart);
};