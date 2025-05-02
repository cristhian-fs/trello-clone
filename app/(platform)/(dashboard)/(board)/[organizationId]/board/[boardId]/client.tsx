"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useGetBoard } from "@/features/boards/api/use-get-board";
import { useBoardId } from "@/features/boards/hooks/use-board-id";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { BoardNavbar } from "./_components/board-navbar";

export const BoardIdClient = ({children}: { children: React.ReactNode}) => {

  const boardId = useBoardId();
  const organizationId = useOrganizationId();
  const { data: boardData, isLoading: boardIsLoading } = useGetBoard({
    boardId,
    organizationId
  });

  if(boardIsLoading){
    return <LoadingScreen />;
  }

  if(!boardData){
    return null;
  }

  const board = {
    ...boardData.data,
    createdAt: new Date(boardData.data.createdAt),
    updatedAt: new Date(boardData.data.updatedAt)
  }

  return(
    <div
        className="relative h-full bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${board.imageFullUrl})`}}
      >
        <BoardNavbar data={board} />
        <div className="absolute inset-0 bg-black/10"/>
        <main className="relative pt-28 h-full">
          {children}
        </main>
      </div>
  )
}