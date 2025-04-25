import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetOrganizationProps{
  organizationId: string;
}

export const useGetOrganization = ({ organizationId }: useGetOrganizationProps) => {
  const mutation = useQuery({
    queryKey: ["organizations", organizationId],
    queryFn: async () => {
      const response = await client.api.organizations[":organizationId"]["$get"]({
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