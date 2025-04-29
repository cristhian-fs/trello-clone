import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.boards[":organizationId"][":boardId"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.boards[":organizationId"][":boardId"]["$patch"]>

interface useUpdateBoardProps {
  boardId: string;
  organizationId: string;
}

export const useUpdateBoard = ({ boardId, organizationId } : useUpdateBoardProps) => {

  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    { form: RequestType["form"] }
  >({
    mutationKey: ["organizations", organizationId, "boards", boardId],
    mutationFn: async ({ form }) => {
      const response = await client.api.boards[":organizationId"][":boardId"]["$patch"]({ 
        param: { boardId, organizationId }, 
        form 
      });

      if(!response.ok){
        throw new Error("Failed to update board");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["organizations", organizationId, "boards", boardId]})
    }
  });

  return mutation;
}