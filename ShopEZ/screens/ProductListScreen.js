import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, Button } from "react-native";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Logout" onPress={handleLogout} color="#D81B60" />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              marginBottom: 10,
              padding: 10,
              backgroundColor: "#fff",
            }}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          >
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100, alignSelf: "center" }} resizeMode="contain" />
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>{item.title}</Text>
            <Text style={{ textAlign: "center", color: "green" }}>${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
