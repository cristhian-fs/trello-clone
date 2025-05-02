import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetBoard = ({ organizationId, boardId }: { organizationId: string, boardId: string }) => {
  const mutation = useQuery({
    queryKey: ["organizations", organizationId, "boards", boardId],
    queryFn: async () => {
      const response = await client.api.boards[":organizationId"][":boardId"].$get({
        param: {
           organizationId,
           boardId
        }
      });

      if(!response.ok){
        throw new Error("Failed to fetch workspace analytics");
      }

      const data = await response.json();

      return data;
    }
  })

  return mutation;
}