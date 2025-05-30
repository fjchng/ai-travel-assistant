export type Activity = {
  time: string;
  title: string;
  type: string;
  description: string;
  location?: string;
  duration?: string;
  coordinates?: [number, number]; // [latitude, longitude]
};

export type Day = {
  title: string;
  activities: Activity[];
};

export type Flight = {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: string;
};

export type Hotel = {
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
};

export type Restaurant = {
  name: string;
  cuisine: string;
  location: string;
  priceRange: string;
  rating: number;
  image: string;
  coordinates?: [number, number];
};

export type Attraction = {
  name: string;
  category: string;
  location: string;
  duration: string;
  price: string;
  image: string;
  coordinates?: [number, number];
};

export type ItineraryType = {
  title: string;
  destination: string;
  summary: string;
  pace: string;
  tags: string[];
  days: Day[];
  flights: Flight[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
};