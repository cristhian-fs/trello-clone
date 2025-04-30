"use client"

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable
} from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { useUpdateListsReorder } from "@/features/boards/api/use-update-lists-order";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { useUpdateCardOrder } from "@/features/boards/api/use-update-card-order";

interface ListContainerProps{
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({
  data,
  boardId
}: ListContainerProps) => {

  const [orderedData, setOrderedData] = useState(data);

  const organizationId = useOrganizationId();
  const { mutate: reorderLists } = useUpdateListsReorder({ boardId, organizationId });
  const { mutate: reorderCard } = useUpdateCardOrder({ boardId, organizationId})

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if(!destination) return;

    // if dropped in the same position
    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ){
      return;
    }

    // if user moves a list
    if(type === "list"){
      const items = reorder(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));

      setOrderedData(items);
      console.log("Called API");
      reorderLists({ json: { 
        items
       }});
    }

    // if user moves a card
    if(type === "card"){
      const newOrderedData = [...orderedData];

      // source and destination list
      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destList = newOrderedData.find(list => list.id === destination.droppableId);

      if(!sourceList || !destList) return;

      // check if cards exists on the sourceList
      if(!sourceList.cards){
        sourceList.cards = [];
      }

      // check if cards exists on the destList
      if(!destList.cards){
        destList.cards = [];
      }

      // moving the card in the same list
      if(source.droppableId === destination.droppableId){
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        )

        reorderedCards.forEach((card, index) => {
          card.order = index;
        })

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        reorderCard({ json: {
          items: reorderedCards
        }})
        // User moves the card to another list
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the card to the new list
        movedCard.listId = destination.droppableId;

        // add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx
        });

        // update the order for each card in the destination list
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        reorderCard({ json: {
          items: destList.cards
        }})
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />  
            <div className="flex shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  )
}