import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useProfile from "@/hooks/useProfile";

const EditProfile = () => {
  const { userInfo, editProfile, isEditing } = useProfile();

  const [name, setName] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
    }
  }, [userInfo]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <SafeScreen>
        {/* HEADER */}
        <View className="px-6 pb-5 border-b border-surface flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-text-primary text-2xl font-bold">
            Edit Profile
          </Text>
        </View>

        <View className="flex-1 px-6 py-4">
          <View className="items-center justify-center mb-10">
            <View className="relative">
              <Image
                source={
                  userInfo?.imageUrl && !imageError
                    ? { uri: userInfo.imageUrl }
                    : require("../../assets/images/profile_avatar.png")
                }
                onError={() => setImageError(true)}
                style={{ width: 100, height: 100 }}
                className="rounded-full"
              />

              {/* EDIT ICON */}
              <TouchableOpacity className="absolute bottom-0 right-0 ">
                <Ionicons name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* FORM */}
          <View className="p-4">
            {/* FULL NAME */}
            <View className="mb-5">
              <Text className="text-text-primary font-semibold mb-2">
                Full name
              </Text>
              <TextInput
                className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                placeholder="Enter your full name"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>
        </View>

        {/* SAVE BTN */}
        <TouchableOpacity
          className="bg-primary rounded-2xl py-4 items-center mx-6 mb-6"
          onPress={() => editProfile(name)}
          disabled={isEditing}
        >
          <Text className="text-bg font-semibold text-base">Save Changes</Text>
        </TouchableOpacity>
      </SafeScreen>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
