import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveCartToStorage = async (cart) => {
  try {
    await AsyncStorage.setItem("userCart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

export const loadCartFromStorage = async () => {
  try {
    const cart = await AsyncStorage.getItem("userCart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
};
