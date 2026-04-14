import { useApi } from "@/lib/api";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useOrders = () => {
  const api = useApi();

  const result = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data.orders;
    },
  });

  return result;
};
