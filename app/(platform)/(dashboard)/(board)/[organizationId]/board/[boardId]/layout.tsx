import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

type Props = {
  params: Promise<{ boardId: string }>
}

export async function generateMetadata({ params }: Props){
  const slug = (await params).boardId;

  const board = await db.board.findFirst({
    where: {
      id: slug
    }
  });

  if(!board){
    return {
      title: "Board not found"
    }
  }

  return {
    title: board.title,
  }

}

const BoardIdLayout = async ({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: { boardId: string } 
}) => {

  const { boardId } = await params

  const board = await db.board.findUnique({
    where: {
      id: boardId
    }
  })

  if(!board){
    console.log("board not found");
    notFound();
  }

  return (
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
  );
}
 
export default BoardIdLayout;