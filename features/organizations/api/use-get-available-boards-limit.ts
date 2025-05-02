import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetAvailableBoardsLimit = ({organizationId}:{organizationId: string}) => {
  return useQuery({
    queryKey: [organizationId, "boardCount"],
    queryFn: async () => {
      const response = await client.api.organizations[":organizationId"]["boards-remaining"]["$get"]({
        param: { organizationId }
      });
      if(!response.ok){
        throw new Error("Failed to fetch workspace analytics");
      }
      const data = await response.json();
      return data.data;
    }
  });
};

