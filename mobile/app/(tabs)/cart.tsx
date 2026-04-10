import { View, Text } from "react-native";
import React from "react";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import useAddresses from "@/hooks/useAddresses";

const CartScreen = () => {
  const api = useApi();
  const { addToCart, isAddingToCart } = useCart();
  const { addresses } = useAddresses();
  return (
    <View>
      <Text>CartScreen</Text>
    </View>
  );
};

export default CartScreen;
