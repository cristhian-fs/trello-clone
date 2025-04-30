import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.cards[":organizationId"][":boardId"][":listId"]["$post"]>
type ResponseType = InferResponseType<typeof client.api.cards[":organizationId"][":boardId"][":listId"]["$post"]>;

interface useCreateCardProps {
  boardId: string
  organizationId: string
  listId: string
}

export const useCreateCard = ({ boardId, organizationId, listId } : useCreateCardProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    {form: RequestType["form"]}
  >({
    mutationKey: ["organizations", organizationId, "boards", boardId, "lists"],
    mutationFn: async ({ form }) => {
      const response = await client.api.cards[":organizationId"][":boardId"][":listId"].$post({ 
        form ,
        param: { boardId, organizationId, listId }
      });

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
      queryClient.invalidateQueries({queryKey: ["organizations", organizationId, "boards", boardId, "lists"]});
    },
  })

  return mutation
}
