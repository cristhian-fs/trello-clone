import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  data: Board;
}

export const BoardNavbar = ({
  data
}: BoardNavbarProps) => {

  return (
    <div className="w-full h-14 z-40 bg-black/50 fixed top-14 flex items-center justify-between px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />
      <BoardOptions data={data} />
    </div>
  )
}