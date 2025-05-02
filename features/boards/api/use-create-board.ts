import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.boards[":organizationId"]["$post"]>
type ResponseType = InferResponseType<typeof client.api.boards[":organizationId"]["$post"]>;

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["organizations", "boards"],
    mutationFn: async ({ form, param }) => {
      const response = await client.api.boards[":organizationId"].$post({ form, param });

      const data = await response.json();

      if (!response.ok) {
        const error= {
          message: "error" in data ? data.error : "Failed to create organization",
          field: "field" in data ? data.field : undefined,
        };
    
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["organizations", "boards"]});
      queryClient.invalidateQueries({queryKey: ["boardCount"]});
    },
  })

  return mutation
}
