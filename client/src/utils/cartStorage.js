export const getGuestCart = () =>
  JSON.parse(localStorage.getItem("cart")) || [];

export const saveGuestCart = (cart) =>
  localStorage.setItem("cart", JSON.stringify(cart));

export const clearGuestCart = () =>
  localStorage.removeItem("cart");