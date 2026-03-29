import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  console.log("product id is:", id);
  return (
    <View>
      <Text>ProductDetailsScreen</Text>
    </View>
  );
};

export default ProductDetailsScreen;
