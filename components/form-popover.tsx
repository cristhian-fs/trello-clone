import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { CreateBoardForm } from "@/features/boards/components/create-board-form";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export const FormPopover = ({
  children,
  side = "bottom",
  sideOffset = 0,
  align = "center",
}: FormPopoverProps) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        side={side} 
        sideOffset={sideOffset} 
        align={align}
        className="w-80 pt-3"
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create board
        </div>
        <PopoverClose asChild>
          <Button
            variant="ghost"
            className="size-auto p-2 absolute top-2 right-2 text-neutral-600"
          >
            <XIcon className="size-4" />
          </Button>
        </PopoverClose>
        <CreateBoardForm />
      </PopoverContent>
    </Popover>
  )
}