import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.cards[":organizationId"][":cardId"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.cards[":organizationId"][":cardId"]["$patch"]>

interface useUpdateCardProps {
  organizationId: string;
  cardId: string;
  boardId: string;
}

export const useUpdateCard = ({ cardId, organizationId, boardId } : useUpdateCardProps) => {

  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    { form: RequestType["form"] }
  >({
    mutationKey: ["card", cardId],
    mutationFn: async ({ form }) => {
      const response = await client.api.cards[":organizationId"][":cardId"]["$patch"]({ 
        param: { cardId, organizationId }, 
        form 
      });

      if(!response.ok){
        throw new Error("Failed to update board");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["card", cardId]})
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "boards", boardId, "lists"]
      })
      queryClient.invalidateQueries({
        queryKey: ["card", cardId, "logs"]
      })
    }
  });

  return mutation;
}