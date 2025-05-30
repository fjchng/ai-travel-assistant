"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function TravelForm() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // In the MVP, we'll redirect to the results page
      // In a real implementation, we'd send the query to the API first
      const encodedQuery = encodeURIComponent(query);
      router.push(`/itinerary?q=${encodedQuery}`);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setIsLoading(false);
    }
  };

  const placeholderExamples = [
    "Plan a 3-day trip to Barcelona with a focus on architecture and local cuisine",
    "Weekend getaway to New York City on a moderate budget, interested in theater and art",
    "7-day family vacation in Tokyo with kid-friendly activities and cultural experiences"
  ];
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Rotate through placeholder examples
  useState(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
    }, 5000);
    
    return () => clearInterval(interval);
  });

  return (
    <form onSubmit={handleSubmit} className="relative mt-8">
      <div className="relative">
        <Textarea 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderExamples[placeholderIndex]}
          className={cn(
            "min-h-32 p-4 pr-12 text-base md:text-lg resize-none rounded-lg shadow-md border border-input focus-visible:ring-2 focus-visible:ring-offset-2",
            isLoading && "opacity-70"
          )}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-3 bottom-3 shadow-sm"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Describe your ideal trip in natural language. Include destination, duration, interests, and budget.
      </p>
    </form>
  );
}