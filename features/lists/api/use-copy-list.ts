import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.lists[":organizationId"][":boardId"][":listId"]["copy-list"]["$post"]>
type ResponseType = InferResponseType<typeof client.api.lists[":organizationId"][":boardId"][":listId"]["copy-list"]["$post"]>;

interface useCopyListProps {
  boardId: string
  organizationId: string
  listId: string
}

export const useCopyList = ({ boardId, organizationId, listId } : useCopyListProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType, 
    Error, 
    RequestType
  >({
    mutationKey: ["organizations", organizationId, "boards", boardId, "lists"],
    mutationFn: async () => {
      const response = await client.api.lists[":organizationId"][":boardId"][":listId"]["copy-list"].$post({
        param: {
          boardId,
          organizationId,
          listId
        }
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
