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
import { ItineraryType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { ItineraryDay } from "@/components/itinerary/itinerary-day";
import { ItineraryLoading } from "@/components/itinerary/itinerary-loading";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export function ItineraryResults({ query }: { query: string }) {
  const [itinerary, setItinerary] = useState<ItineraryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  // Move fetchItinerary outside of useEffect
  const fetchItinerary = async (isRegenerate = false) => {
    if (!genAI) {
      toast({
        title: "API Key Missing",
        description: "Gemini API key is not configured. Please check your environment variables.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      const currentQuery = isRegenerate ? `${query} (regenerated)` : query;

      const prompt = `
        Generate a detailed travel itinerary based on the following query: "${currentQuery}"

        The response MUST be a valid JSON object adhering to the following TypeScript type structure:

        \`\`\`typescript
        export type Activity = {
          time: string; // e.g., "9:00 AM", "Afternoon"
          title: string;
          type: string; // e.g., "Dining", "Activity", "Sightseeing", "Free Time"
          description: string;
          location?: string;
          duration?: string; // e.g., "2 hours", "All day"
          coordinates?: [number, number]; // [latitude, longitude]
        };

        export type Day = {
          title: string; // e.g., "Day 1: Arrival and City Exploration"
          activities: Activity[];
        };

        export type Flight = {
          airline: string;
          departureTime: string;
          arrivalTime: string;
          duration: string;
          stops: number;
          price: string; // e.g., "$500 - $700 USD"
        };

        export type Hotel = {
          name: string;
          location: string;
          price: string; // e.g., "$150 - $250 USD per night"
          rating: number; // e.g., 4.5
          image: string; // URL to an image (can be a placeholder if real image not available)
        };

        export type Restaurant = {
          name: string;
          cuisine: string;
          location: string;
          priceRange: string; // e.g., "$ - $$", "$$$ - $$$$"
          rating: number;
          image: string; // URL to an image
          coordinates?: [number, number];
        };

        export type Attraction = {
          name: string;
          category: string; // e.g., "Museum", "Landmark", "Park"
          location: string;
          duration: string; // e.g., "1-2 hours"
          price: string; // e.g., "Free", "$20 USD"
          image: string; // URL to an image
          coordinates?: [number, number];
        };

        export type ItineraryType = {
          title: string; // e.g., "Barcelona Adventure: Architecture & Cuisine"
          destination: string; // The main city/country
          summary: string; // A short summary of the trip
          pace: string; // e.g., "Relaxed", "Moderate", "Fast-paced"
          tags: string[]; // e.g., ["Culture", "Foodie", "Adventure"]
          days: Day[];
          flights: Flight[]; // Provide 1-2 flight suggestions
          hotels: Hotel[]; // Provide 1-2 hotel suggestions
          restaurants: Restaurant[]; // Provide 3-5 restaurant suggestions
          attractions: Attraction[]; // Provide 3-5 key attraction suggestions
        };
        \`\`\`

        Important Notes:
        - Ensure all string fields are populated. Use placeholder text like "Details to be confirmed" if specific information is not generated.
        - For \`image\` fields, provide valid image URLs if possible. If not, use a placeholder like "https://via.placeholder.com/300x200.png?text=Image+Not+Available".
        - For \`coordinates\`, provide actual latitude and longitude if easily available for locations; otherwise, omit the field or use [0,0] as a placeholder.
        - Ensure the JSON is well-formed and complete according to the types.
        - Provide a diverse set of activities, and try to make the itinerary engaging.
        - Price fields should be strings and include currency if applicable (e.g., "$100 USD", "€50").
        - Number of stops for flights should be a number.
        - Ratings should be numbers (e.g., 4, 4.5).
        - If the query is too vague or nonsensical, return a valid JSON with a title like "Query Unclear" and an appropriate summary, with empty arrays for other fields.
      `;
      
      console.log(`Sending prompt to Gemini (${isRegenerate ? "regenerate" : "initial"}):`, currentQuery);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log("Gemini API response text:", text);

      // Extract JSON from the response (it might be wrapped in markdown or have extra text)
      let jsonString = text;
      // Try to extract the first JSON object from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      const generatedItinerary: ItineraryType = JSON.parse(jsonString);
      setItinerary(generatedItinerary);

    } catch (error) {
      console.error(`Error generating itinerary with Gemini (${isRegenerate ? "regenerate" : "initial"}):`, error);
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: `Error ${isRegenerate ? "re" : ""}generating itinerary`,
        description: `Failed to get data from AI: ${errorMessage}. Please try again or refine your query. Make sure your API key is valid and has permissions.`,
        variant: "destructive",
        duration: 10000, 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchItinerary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Button variant="outline" size="sm" onClick={() => {
            if (itinerary) {
                setLoading(true);
                setItinerary(null); // Clear current itinerary to show loading
                fetchItinerary(true);
            }
          }}>
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
              <CardTitle>Key Attractions & Activities</CardTitle>
              <CardDescription>
                Must-see sights and experiences in {itinerary.destination}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itinerary.attractions.map((attraction, i) => (
                  <Card key={i}>
                    <img 
                      src={attraction.image || "https://via.placeholder.com/300x200.png?text=Attraction"} 
                      alt={attraction.name} 
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{attraction.name}</CardTitle>
                      <CardDescription>{attraction.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm">
                      <p className="mb-1"><MapPin className="inline mr-1 h-3 w-3 text-muted-foreground" /> {attraction.location}</p>
                      <p className="mb-1"><Clock className="inline mr-1 h-3 w-3 text-muted-foreground" /> {attraction.duration}</p>
                      <p><Calendar className="inline mr-1 h-3 w-3 text-muted-foreground" /> {attraction.price}</p>
                    </CardContent>
                  </Card>
                ))}
                {itinerary.attractions.length === 0 && (
                  <p className="text-muted-foreground col-span-full">No specific attractions recommended by AI. Try a more detailed query or broaden your search.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}