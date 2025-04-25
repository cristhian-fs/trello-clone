import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetOrganizations = () => {
  const mutation = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await client.api.organizations.$get();

      if(!response.ok){
        throw new Error("Failed to fetch workspace analytics");
      }

      const data = await response.json();

      return data;
    }
  })

  return mutation;
}