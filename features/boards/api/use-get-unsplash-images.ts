import { useQuery } from "@tanstack/react-query";

import { unsplash } from "@/lib/unsplash";
import { defaultImages } from "../consts";

export const useGetUnsplashImages = () => {
  const mutation = useQuery({
    queryKey: ["unsplash-query"],
    queryFn: async () => {
      try{
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9
        })
  
        if(!result || !result.response){
          return defaultImages;
        }
  
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const images = (result.response as Array<Record<string, any>>)

        return images
      } catch(error){
        console.log(error)
        return defaultImages;
      }
    }
  })

  return mutation;
}