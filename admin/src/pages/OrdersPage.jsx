import { orderApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const OrdersPage = () => {
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateMutationStatus = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateMutationStatus.mutate({ orderId, newStatus });
  };

  const orders = ordersData?.orders || [];

  return <div>OrdersPage</div>;
};

export default OrdersPage;
