import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetCardProps{
  organizationId?: string;
  cardId?: string;
}

export const useGetCard = ({ organizationId, cardId }: useGetCardProps) => {
  const mutation = useQuery({
    queryKey: ["card", cardId],
    queryFn: async () => {
      const response = await client.api.cards[":organizationId"][":cardId"]["$get"]({
        param: { 
          organizationId: organizationId as string, 
          cardId: cardId as string
        }
      });

      if(!response.ok){
        throw new Error("Failed to fetch workspace analytics");
      }

      const data = await response.json();

      return data;
    },
    enabled: !!cardId && !!organizationId
  })

  return mutation;
}