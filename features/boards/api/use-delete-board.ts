import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.boards[":organizationId"][":boardId"]["$delete"]>
type RequestType = InferRequestType<typeof client.api.boards[":organizationId"][":boardId"]["$delete"]>

interface useDeleteBoardProps {
  organizationId: string,
  boardId: string
}

export const useDeleteBoard = ({ organizationId, boardId } : useDeleteBoardProps) => {

  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    RequestType
  >({
    mutationKey: ["organizations", organizationId, "boards"],
    mutationFn: async () => {
      const response = await client.api.boards[":organizationId"][":boardId"]["$delete"]({ 
        param: { boardId, organizationId }
      });

      if(!response.ok){
        throw new Error("Failed to update board");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["organizations", organizationId, "boards"]});
      queryClient.invalidateQueries({queryKey: [boardId, "boardCount"]});
    }
  });

  return mutation;
}