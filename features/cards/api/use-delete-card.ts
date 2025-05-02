import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.cards[":organizationId"][":cardId"]["$delete"]>
type RequestType = InferRequestType<typeof client.api.cards[":organizationId"][":cardId"]["$delete"]>

interface useDeleteCardProps {
  organizationId: string
  boardId: string
  cardId: string
}

export const useDeleteCard = ({
  boardId,
  cardId,
  organizationId
}: useDeleteCardProps) => {

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["organizations", organizationId, "boards", boardId, "lists"],
    mutationFn: async () => {
      const response = await client.api.cards[":organizationId"][":cardId"]["$delete"]({ 
        param: {
          organizationId,
          cardId
        }
      });

      if(!response.ok){
        throw new Error("Failed to update board");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["organizations", organizationId, "boards", boardId, "lists"]})
    }
  });

  return mutation;
}
