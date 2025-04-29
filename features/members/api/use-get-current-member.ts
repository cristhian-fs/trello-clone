import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetCurrentMemberProps {
  organizationId: string
}

export const useGetCurrentMember = ({ organizationId }: useGetCurrentMemberProps) => {
  const mutation = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.members.current[":organizationId"]["$get"]({ param: { organizationId }});

      if(!response.ok){
        throw new Error("Failed to fetch current member");
      }

      const data = await response.json();

      return data;
    }
  })

  return mutation;
}