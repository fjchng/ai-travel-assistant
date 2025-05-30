"use client"

import { useEffect, useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft,
  RefreshCw,
  Plane,
  Hotel,
  Utensils,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItineraryMap } from "@/components/itinerary/itinerary-map";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { generateMockItinerary } from "@/lib/mock-data";
import { ItineraryType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { ItineraryDay } from "@/components/itinerary/itinerary-day";
import { ItineraryLoading } from "@/components/itinerary/itinerary-loading";

export function ItineraryResults({ query }: { query: string }) {
  const [itinerary, setItinerary] = useState<ItineraryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real implementation, we would call the OpenAI API here
    // For the MVP, we'll use mock data
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockItinerary = generateMockItinerary(query);
        setItinerary(mockItinerary);
      } catch (error) {
        console.error("Error generating itinerary:", error);
        toast({
          title: "Error generating itinerary",
          description: "Please try again with a different query.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchItinerary();
    }
  }, [query, toast]);
  
  if (loading || !itinerary) {
    return <ItineraryLoading />;
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{itinerary.title}</h1>
          <p className="text-muted-foreground mt-1">{itinerary.summary}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button size="sm">
            Save Itinerary
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {itinerary.days.length} Days
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            {itinerary.destination}
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {itinerary.pace}
          </Badge>
          {itinerary.tags.map((tag, i) => (
            <Badge key={i} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flights">
            <Plane className="mr-2 h-4 w-4" />
            Flights
          </TabsTrigger>
          <TabsTrigger value="hotels">
            <Hotel className="mr-2 h-4 w-4" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="dining">
            <Utensils className="mr-2 h-4 w-4" />
            Dining
          </TabsTrigger>
          <TabsTrigger value="attractions">
            <Camera className="mr-2 h-4 w-4" />
            Activities
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Trip Overview</CardTitle>
                  <CardDescription>
                    Your personalized {itinerary.days.length}-day itinerary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[50vh] pr-4">
                    <div className="space-y-6">
                      {itinerary.days.map((day, index) => (
                        <ItineraryDay 
                          key={index} 
                          day={day} 
                          dayNumber={index + 1} 
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle>Trip Map</CardTitle>
                  <CardDescription>
                    Explore your itinerary locations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ItineraryMap itinerary={itinerary} className="h-[50vh] rounded-b-lg" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="flights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flight Recommendations</CardTitle>
              <CardDescription>
                Suggested flights to {itinerary.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {itinerary.flights.map((flight, i) => (
                  <div key={i} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="font-medium">{flight.airline}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {flight.departureTime} - {flight.arrivalTime}
                      </div>
                      <div className="text-sm">
                        {flight.duration} • {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      <div className="text-lg font-bold">{flight.price}</div>
                      <Button size="sm" className="mt-2">View Deal</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hotels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accommodation Options</CardTitle>
              <CardDescription>
                Places to stay in {itinerary.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {itinerary.hotels.map((hotel, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div 
                      className="h-48 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${hotel.image})` }}
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{hotel.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {hotel.location}
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <div className="font-bold">{hotel.price}</div>
                          <div className="text-xs text-muted-foreground">per night</div>
                        </div>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dining" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dining Recommendations</CardTitle>
              <CardDescription>
                Places to eat in {itinerary.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {itinerary.restaurants.map((restaurant, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${restaurant.image})` }}
                    />
                    <div className="p-4">
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <div className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm">{restaurant.priceRange}</div>
                        <Badge variant="outline">{restaurant.rating}/5</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attractions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activities & Attractions</CardTitle>
              <CardDescription>
                Things to do in {itinerary.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {itinerary.attractions.map((attraction, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${attraction.image})` }}
                    />
                    <div className="p-4">
                      <h3 className="font-medium">{attraction.name}</h3>
                      <div className="text-sm text-muted-foreground mb-2">{attraction.category}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm">{attraction.duration}</div>
                        <div className="text-sm font-medium">{attraction.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}