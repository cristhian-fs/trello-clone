import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetCardAuditsProps{
  organizationId?: string;
  cardId?: string;
}

export const useGetCardAudits = ({ organizationId, cardId }: useGetCardAuditsProps) => {
  const mutation = useQuery({
    queryKey: ["card", cardId, "logs"],
    queryFn: async () => {
      const response = await client.api.cards[":organizationId"][":cardId"]["logs"]["$get"]({
        param: { 
          organizationId: organizationId as string, 
          cardId: cardId as string }
      });

      if(!response.ok){
        throw new Error("Failed to fetch workspace analytics");
      }

      const rawData = await response.json();

      const data = rawData.data.map((audit) => ({
        ...audit,
        createdAt: new Date(audit.createdAt),
        updatedAt: new Date(audit.updatedAt),
      }));

      return data;
    },
    enabled: !!cardId && !!organizationId
  })

  return mutation;
}