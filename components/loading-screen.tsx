import { Loader } from "lucide-react"

export const LoadingScreen = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader className="animate-spin size-6 text-muted-foreground" />
    </div>
  )
}