import { client } from "@/lib/rpc";
import { ListWithCards } from "@/types";
import { Card } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useGetLists = ({ organizationId, boardId }: { organizationId: string, boardId: string }) => {
  const mutation = useQuery({
    queryKey: ["organizations", organizationId, "boards", boardId, "lists"],
    queryFn: async () => {
      const response = await client.api.lists[":organizationId"][":boardId"]["lists"].$get({
        param: {
          organizationId,
          boardId
        }
      });

      if(!response.ok){
        throw new Error("Failed to fetch workspace analytics");
      }

      const rawData = await response.json();

      const parsedData: ListWithCards[] = rawData.data.map((list: any) => ({
        ...list,
        createdAt: new Date(list.createdAt),
        updatedAt: new Date(list.updatedAt),
        cards: list.cards.map((card: Card) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        }))
      }))

      return parsedData;
    }
  })

  return mutation;
}