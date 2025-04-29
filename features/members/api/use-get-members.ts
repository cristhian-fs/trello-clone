import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetMembersProps{
  organizationId: string;
}

export const useGetMembers = ({ organizationId }:useGetMembersProps) => {
  const mutation = useQuery({
    queryKey: ["members", organizationId],
    queryFn: async () => {
      const response = await client.api.members[":organizationId"]["$get"]({
        param: { organizationId}
      });

      if(!response.ok){
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();

      return data;
    }
  })

  return mutation;
}