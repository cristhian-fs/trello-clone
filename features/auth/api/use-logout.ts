import { client } from "@/lib/rpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => client.api.auth.logout.$post(),
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({queryKey: ["current"]})
    }
  })

  return mutation;
}