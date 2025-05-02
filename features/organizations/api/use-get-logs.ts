import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetLogsProps{
  organizationId: string;
}

export const useGetLogs = ({ organizationId }: useGetLogsProps) => {
  const mutation = useQuery({
    queryKey: ["organizations", organizationId, "logs"],
    queryFn: async () => {
      const response = await client.api.organizations[":organizationId"]["logs"]["$get"]({
        param: { organizationId }
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