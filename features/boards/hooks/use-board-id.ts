import { useParams } from "next/navigation";

export const useBoardId = () =>{
  const params = useParams();

  return params.boardId as string;
}