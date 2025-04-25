import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.organizations["$post"]>
type ResponseType = InferResponseType<typeof client.api.organizations["$post"]>;

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["organizations"],
    mutationFn: async ({ form }) => {
      const response = await client.api.organizations.$post({ form });

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
      toast.success("Organization created successfully");
      queryClient.invalidateQueries({queryKey: ["organizations"]});
    },
  })

  return mutation
}
