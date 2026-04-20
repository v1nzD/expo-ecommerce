import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Alert } from "react-native";
import { router } from "expo-router";

const useProfile = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-info"],
    queryFn: async () => {
      const { data } = await api.get("/users/userInfo");
      return data.user;
    },
  });

  const editProfileMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.put("/users/editProfile", { name });
      console.log("editProfile response:", data);
      return data.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user-info"], updatedUser);
      Alert.alert("Success", "Your profile has been updated!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to edit profile");
    },
  });

  return {
    userInfo: userInfo,
    isLoading,
    isError,
    editProfile: editProfileMutation.mutate,
    isEditing: editProfileMutation.isPending,
  };
};

export default useProfile;
