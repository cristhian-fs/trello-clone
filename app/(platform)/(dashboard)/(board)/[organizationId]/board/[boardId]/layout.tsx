import { db } from "@/lib/db";
import { BoardIdClient } from "./client";

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
}: { 
  children: React.ReactNode
}) => {
  return (
    <BoardIdClient>{children}</BoardIdClient>
  );
}
 
export default BoardIdLayout;