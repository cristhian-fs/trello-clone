import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.boards[":organizationId"][":boardId"]["reorder-card"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.boards[":organizationId"][":boardId"]["reorder-card"]["$patch"]>

interface useUpdateCardOrderProps {
  boardId: string;
  organizationId: string;
}

export const useUpdateCardOrder = ({ boardId, organizationId } : useUpdateCardOrderProps) => {

  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    { json: RequestType["json"] }
  >({
    mutationKey: ["organizations", organizationId, "boards", boardId, "lists"],
    mutationFn: async ({ json }) => {
      
      const response = await client.api.boards[":organizationId"][":boardId"]["reorder-card"]["$patch"]({ 
        param: { boardId, organizationId }, 
        json
      });

      if(!response.ok){
        throw new Error("Failed to reorder lists");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["organizations", organizationId, "boards", boardId, "lists"]});
      toast.success("Card updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
}