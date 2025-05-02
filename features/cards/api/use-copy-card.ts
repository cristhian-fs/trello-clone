import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.cards["copy"][":organizationId"][":cardId"]["$post"]>
type ResponseType = InferResponseType<typeof client.api.cards["copy"][":organizationId"][":cardId"]["$post"]>;

interface useCopyCardProps {
  boardId: string
  organizationId: string
  cardId: string
}

export const useCopyCard = ({ boardId, organizationId, cardId } : useCopyCardProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    RequestType
  >({
    mutationKey: ["organizations", organizationId, "boards", boardId, "lists"],
    mutationFn: async () => {
      const response = await client.api.cards["copy"][":organizationId"][":cardId"].$post({ 
        param: { organizationId, cardId }
      });

      const data = await response.json();

      if (!response.ok) {
        const error= {
          message: "error" in data ? data.error : "Failed to copy card",
          field: "field" in data ? data.field : undefined,
        };
    
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["organizations", organizationId, "boards", boardId, "lists"]});
      queryClient.invalidateQueries({
        queryKey: ["cards", cardId, "logs"]
      });
    },
  })

  return mutation
}
