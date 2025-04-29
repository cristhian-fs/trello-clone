import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetBoards = ({ organizationId }: { organizationId: string }) => {
  const mutation = useQuery({
    queryKey: ["organizations", organizationId, "boards"],
    queryFn: async () => {
      const response = await client.api.boards[":organizationId"].$get({
        param: {
           organizationId
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