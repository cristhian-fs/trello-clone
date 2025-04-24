import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>;
type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;

type LoginSuccess = { success: string };
type LoginError = { error: string };

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });
      
      const data: LoginSuccess | LoginError = await response.json();
      
      if (!response.ok) {
        throw new Error((data as LoginError).error || "Failed to login");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Login successfully");
      router.push(DEFAULT_LOGIN_REDIRECT);
      queryClient.invalidateQueries({queryKey: ["current"]})
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login");
    }
  })

  return mutation;
}