import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Button, Alert } from "react-native";
import { ref, set, get } from "firebase/database";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const userId = auth.currentUser.uid;

  const addToCart = async () => {
    try {
      const cartRef = ref(db, `carts/${userId}/${product.id}`);
      const snapshot = await get(cartRef);

      if (snapshot.exists()) {

        const currentQty = snapshot.val().quantity;
        await set(cartRef, { ...snapshot.val(), quantity: currentQty + 1 });
      } else {

        await set(cartRef, {
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }

      Alert.alert("Success", "Product added to cart!");
    } catch (error) {
      console.error("Add to Cart Error:", error);
      Alert.alert("Error", "Failed to add product to cart.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.category}>Category: {product.category}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <TouchableOpacity style={[styles.button, { marginBottom: 10 }]} onPress={addToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#888", marginBottom: 10 }]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Products</Text>
      </TouchableOpacity>

      <Button title="Go to Cart" color="#D81B60" onPress={() => navigation.navigate("Cart")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  image: { width: "100%", height: 300, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  category: { fontSize: 16, color: "#555", marginBottom: 10 },
  price: { fontSize: 18, color: "green", marginBottom: 15 },
  description: { fontSize: 16, color: "#333", marginBottom: 20 },
  button: { backgroundColor: "#D81B60", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
