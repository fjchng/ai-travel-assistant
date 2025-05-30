import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ItineraryLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex items-center justify-center mb-8 animate-pulse">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-center">Creating Your Perfect Itinerary</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Our AI is crafting a personalized travel plan just for you. This should take just a moment...
      </p>
      
      <div className="w-full max-w-4xl mx-auto grid gap-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}