"use client";
import { useState } from "react";
import {
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export const ListItem = ({
  data,
  index
}: ListItemProps) => {

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
  }

  const disabledEditing = () => {
    setIsEditing(false);
  }

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef} 
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps} 
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 ? "mt-2" : ""
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem
                      key={card.id}
                      index={index}
                      data={card}
                    />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            
            <CardForm
              listId={data.id}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disabledEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
    
  )
}