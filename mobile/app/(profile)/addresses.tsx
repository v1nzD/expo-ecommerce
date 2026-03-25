import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAddresses from "@/hooks/useAddresses";
import AddressesHeader from "@/components/AddressesHeader";
import { Address } from "@/types";

const AddressesScreen = () => {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    isLoading,
    isError,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);
    setAddressForm({
      label: "",
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert("Delete Address", `Are you sure you want to delete ${label}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAddress(addressId),
      },
    ]);
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode ||
      !addressForm.phoneNumber
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (editingAddressId) {
      // update an existing address
      updateAddress(
        { addressId: editingAddressId, addressData: addressForm },
        {
          onSuccess: () => {
            setShowAddressForm(false);
            setEditingAddressId(null);
            Alert.alert("Success", "Address updated successfully");
          },
          onError: (error: any) => {
            Alert.alert(
              "Error",
              error?.response?.data?.error || "Failed to update address",
            );
          },
        },
      );
    } else {
      // create new address
      addAddress(addressForm, {
        onSuccess: () => {
          setShowAddressForm(false);
          Alert.alert("Success", "New address saved successfully");
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.error || "Failed to save new address",
          );
        },
      });
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  // todo: create reusable components for loading and error states
  if (isLoading) return <LoadingUI />;
  if (isError) return <LoadingUI />;

  return (
    <SafeScreen>
      {/* HEADER */}
      <AddressesHeader />

      {/* USER HAS NO ADDRESS */}
      {addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={80} />
          <Text className="text-text-primary font-semibold text-xl mt-4">
            No addresses yet
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add your first address
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px- py-4 mt-6"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-background font-bold text-base">
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>You have some addresses</Text>
      )}
    </SafeScreen>
  );
};

export default AddressesScreen;

function ErrorUI() {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load addresses
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  );
}

function LoadingUI() {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-secondary mt-4">Loading addresses...</Text>
      </View>
    </SafeScreen>
  );
}
