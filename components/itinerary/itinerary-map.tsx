"use client"

import { useEffect, useRef, useState } from "react";
import { MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItineraryType } from "@/lib/types";

type ItineraryMapProps = {
  itinerary: ItineraryType;
  className?: string;
};

export function ItineraryMap({ itinerary, className }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // In a real implementation, we would use the Google Maps API
  // For the MVP, we'll just show a placeholder
  
  useEffect(() => {
    // This would normally load the Google Maps API script
    // For demo purposes, we'll just simulate it
    const timeout = setTimeout(() => {
      setScriptLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  useEffect(() => {
    if (scriptLoaded && mapRef.current) {
      // This would normally initialize the map
      // For demo purposes, we'll just simulate it
      const timeout = setTimeout(() => {
        setMapLoaded(true);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [scriptLoaded]);
  
  // In a real implementation, we would extract coordinates from the itinerary
  // and plot them on the map
  
  if (!scriptLoaded || !mapLoaded) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/30", className)}>
        <div className="flex flex-col items-center text-muted-foreground">
          <MapIcon className="h-10 w-10 mb-2 animate-pulse" />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={mapRef} className={cn("relative", className)}>
      {/* This would be replaced with the actual Google Maps component */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4097159/pexels-photo-4097159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center">
          <MapIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="text-lg font-medium">Interactive Map</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            In the full implementation, this would be an interactive map showing all locations in your itinerary.
          </p>
        </div>
      </div>
    </div>
  );
}