import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.lists[":organizationId"][":boardId"][":listId"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.lists[":organizationId"][":boardId"][":listId"]["$patch"]>

interface useUpdateBoardProps {
  boardId: string;
  organizationId: string;
  listId: string;
}

export const useUpdateList = ({ boardId, organizationId, listId } : useUpdateBoardProps) => {

  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    { form: RequestType["form"] }
  >({
    mutationKey: ["organizations", organizationId, "boards", boardId, "lists", listId],
    mutationFn: async ({ form }) => {
      const response = await client.api.lists[":organizationId"][":boardId"][":listId"]["$patch"]({ 
        param: { boardId, organizationId, listId }, 
        form 
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