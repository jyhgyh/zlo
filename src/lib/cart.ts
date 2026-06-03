export type CartItem = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  currency: "EUR" | "USD";
};

export const CART_STORAGE_KEY = "zlata-cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  window.localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(items)
  );
}

export function addCartItem(item: CartItem) {
  const items = getCartItems();

  const alreadyExists = items.some(
    (cartItem) => cartItem.id === item.id
  );

  if (alreadyExists) {
    return items;
  }

  const nextItems = [...items, item];

  saveCartItems(nextItems);

  return nextItems;
}

export function removeCartItem(id: string) {
  const items = getCartItems();

  const nextItems = items.filter(
    (item) => item.id !== id
  );

  saveCartItems(nextItems);

  return nextItems;
}

export function clearCart() {
  saveCartItems([]);
}