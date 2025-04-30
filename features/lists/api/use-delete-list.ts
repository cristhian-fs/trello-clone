import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.lists[":organizationId"][":boardId"][":listId"]["$delete"]>
type RequestType = InferRequestType<typeof client.api.lists[":organizationId"][":boardId"][":listId"]["$delete"]>

interface useDeleteListProps {
  organizationId: string
  boardId: string
  listId: string
}

export const useDeleteList = ({
  boardId,
  listId,
  organizationId
}: useDeleteListProps) => {

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["organizations", organizationId, "boards", boardId, "lists"],
    mutationFn: async () => {
      const response = await client.api.lists[":organizationId"][":boardId"][":listId"]["$delete"]({ 
        param: {
          boardId,
          organizationId,
          listId
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
