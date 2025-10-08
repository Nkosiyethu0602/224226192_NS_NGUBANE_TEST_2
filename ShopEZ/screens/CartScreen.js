import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ref, onValue, set, remove } from "firebase/database";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const cartRef = ref(db, `carts/${userId}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val() || {};

      const itemsArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setCartItems(itemsArray);
    });

    return () => unsubscribe();
  }, []);

  const updateQuantity = (itemId, newQty) => {
    if (newQty < 1) return;
    const itemRef = ref(db, `carts/${userId}/${itemId}`);
    set(itemRef, { ...cartItems.find(item => item.id === itemId), quantity: newQty });
  };

  const removeItem = (itemId) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", onPress: () => remove(ref(db, `carts/${userId}/${itemId}`)) }
    ]);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text>Price: ${item.price}</Text>
        <Text>Quantity: {item.quantity}</Text>
        <Text>Subtotal: ${(item.price * item.quantity).toFixed(2)}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyButton}>
            <Text>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyButton}>
            <Text>➖</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
            <Text style={{ color: "white" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#f8f8f8" }}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Your cart is empty</Text>}
      />
      <View style={styles.total}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: { width: 80, height: 80 },
  details: { flex: 1, marginLeft: 10 },
  title: { fontWeight: "bold", marginBottom: 5 },
  buttons: { flexDirection: "row", marginTop: 5 },
  qtyButton: { marginRight: 10, backgroundColor: "#ddd", padding: 5, borderRadius: 5 },
  removeButton: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  total: { padding: 15, borderTopWidth: 1, borderColor: "#ccc", backgroundColor: "#fff", borderRadius: 8 },
  totalText: { fontSize: 18, fontWeight: "bold", textAlign: "right" },
});
