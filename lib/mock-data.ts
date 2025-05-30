import { ItineraryType } from "./types";

// Function to parse natural language query and generate mock itinerary
export function generateMockItinerary(query: string): ItineraryType {
  // In a real implementation, this would use the OpenAI API
  // For the MVP, we'll analyze the query string for keywords
  
  const lowerQuery = query.toLowerCase();
  
  // Extract destination (simple approach for MVP)
  let destination = "Barcelona";
  const cities = [
    "barcelona", "paris", "rome", "tokyo", "new york", "london", 
    "amsterdam", "berlin", "kyoto", "bangkok"
  ];
  
  for (const city of cities) {
    if (lowerQuery.includes(city)) {
      destination = city.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      break;
    }
  }
  
  // Extract duration
  let days = 3;
  const durationMatch = lowerQuery.match(/(\d+)[ -]day/);
  if (durationMatch) {
    days = parseInt(durationMatch[1]);
  }
  
  // Extract interests
  const interests = [];
  const interestKeywords = [
    "food", "cuisine", "dining", "restaurant", "eat",
    "museum", "art", "history", "culture",
    "beach", "nature", "outdoor", "hiking",
    "shopping", "luxury", "budget", "family",
    "architecture", "photography"
  ];
  
  for (const keyword of interestKeywords) {
    if (lowerQuery.includes(keyword)) {
      interests.push(keyword);
    }
  }
  
  // Extract budget level
  let budget = "moderate";
  if (lowerQuery.includes("luxury") || lowerQuery.includes("high-end") || lowerQuery.includes("expensive")) {
    budget = "luxury";
  } else if (lowerQuery.includes("budget") || lowerQuery.includes("cheap") || lowerQuery.includes("affordable")) {
    budget = "budget";
  }
  
  // Generate tags based on interests and budget
  const tags = [...new Set([...interests, budget])].map(tag => 
    tag.charAt(0).toUpperCase() + tag.slice(1)
  ).slice(0, 5);
  
  // Generate pace based on number of days and interests
  let pace = "Balanced";
  if (days <= 2) {
    pace = "Fast-paced";
  } else if (days >= 7) {
    pace = "Relaxed";
  }
  
  // Generate mock itinerary based on destination
  let mockItinerary: ItineraryType;
  
  switch (destination.toLowerCase()) {
    case "barcelona":
      mockItinerary = getBarcelonaItinerary(days, budget, interests);
      break;
    case "paris":
      mockItinerary = getParisItinerary(days, budget, interests);
      break;
    default:
      // Default to Barcelona
      mockItinerary = getBarcelonaItinerary(days, budget, interests);
  }
  
  // Set common fields
  mockItinerary.destination = destination;
  mockItinerary.pace = pace;
  mockItinerary.tags = tags;
  
  return mockItinerary;
}

function getBarcelonaItinerary(days: number, budget: string, interests: string[]): ItineraryType {
  const hasInterest = (keywords: string[]) => 
    keywords.some(keyword => interests.includes(keyword));
  
  const focusOnFood = hasInterest(["food", "cuisine", "dining", "restaurant", "eat"]);
  const focusOnCulture = hasInterest(["museum", "art", "history", "culture"]);
  const focusOnArchitecture = hasInterest(["architecture"]);
  
  let title = `Exploring ${days} Days in Barcelona`;
  let summary = `A ${days}-day journey through Barcelona's iconic architecture, vibrant culture, and delicious cuisine.`;
  
  if (focusOnFood) {
    title = `Barcelona Food Tour: ${days} Days of Culinary Delights`;
    summary = `A ${days}-day culinary adventure through Barcelona's best restaurants, tapas bars, and food markets.`;
  } else if (focusOnCulture) {
    title = `Cultural Immersion: ${days} Days in Barcelona`;
    summary = `A ${days}-day exploration of Barcelona's rich cultural heritage, museums, and historical sites.`;
  } else if (focusOnArchitecture) {
    title = `Barcelona's Architectural Wonders: ${days}-Day Tour`;
    summary = `A ${days}-day journey through Barcelona's stunning architectural masterpieces, from Gaudí to modern design.`;
  }
  
  // Generate mock days based on duration
  const mockDays = [];
  const allActivities = [
    {
      title: "La Sagrada Familia",
      type: "Sightseeing",
      description: "Visit Antoni Gaudí's masterpiece, the iconic Sagrada Familia basilica.",
      location: "Carrer de Mallorca, 401, Barcelona",
      duration: "2 hours"
    },
    {
      title: "Park Güell",
      type: "Sightseeing",
      description: "Explore the colorful Park Güell, another Gaudí masterpiece with amazing views of the city.",
      location: "Carrer d'Olot, Barcelona",
      duration: "1.5 hours"
    },
    {
      title: "La Rambla",
      type: "Sightseeing",
      description: "Stroll down Barcelona's famous pedestrian street filled with shops, cafes, and street performers.",
      location: "La Rambla, Barcelona",
      duration: "1 hour"
    },
    {
      title: "Mercat de la Boqueria",
      type: "Market",
      description: "Explore Barcelona's most famous food market with local produce, meats, cheeses, and more.",
      location: "La Rambla, 91, Barcelona",
      duration: "1 hour"
    },
    {
      title: "Barri Gòtic",
      type: "Sightseeing",
      description: "Wander through the narrow medieval streets of Barcelona's Gothic Quarter.",
      location: "Gothic Quarter, Barcelona",
      duration: "2 hours"
    },
    {
      title: "Picasso Museum",
      type: "Museum",
      description: "Visit the museum dedicated to one of the greatest artists of the 20th century.",
      location: "Carrer Montcada, 15-23, Barcelona",
      duration: "1.5 hours"
    },
    {
      title: "Casa Batlló",
      type: "Sightseeing",
      description: "Explore another of Gaudí's masterpieces, the fantastic Casa Batlló.",
      location: "Passeig de Gràcia, 43, Barcelona",
      duration: "1 hour"
    },
    {
      title: "Barceloneta Beach",
      type: "Beach",
      description: "Relax at Barcelona's most popular beach and enjoy the Mediterranean Sea.",
      location: "Barceloneta Beach, Barcelona",
      duration: "3 hours"
    },
    {
      title: "Camp Nou",
      type: "Sightseeing",
      description: "Tour the famous home stadium of FC Barcelona.",
      location: "C. d'Arístides Maillol, 12, Barcelona",
      duration: "2 hours"
    },
    {
      title: "Montjuïc",
      type: "Sightseeing",
      description: "Visit the mountain overlooking the harbor with gardens, museums, and great views.",
      location: "Montjuïc, Barcelona",
      duration: "3 hours"
    }
  ];
  
  const breakfastOptions = [
    {
      title: "Breakfast at Hoffman Bakery",
      type: "Breakfast",
      description: "Start your day with pastries and coffee at this famous bakery.",
      location: "Carrer dels Flassaders, 44, Barcelona",
      duration: "45 minutes"
    },
    {
      title: "Breakfast at Granja La Pallaresa",
      type: "Breakfast",
      description: "Enjoy traditional churros with hot chocolate at this historic café.",
      location: "Carrer de Petritxol, 11, Barcelona",
      duration: "45 minutes"
    }
  ];
  
  const lunchOptions = [
    {
      title: "Lunch at El Quim de la Boqueria",
      type: "Lunch",
      description: "Enjoy fresh seafood at this famous stall in La Boqueria market.",
      location: "La Boqueria Market, Barcelona",
      duration: "1 hour"
    },
    {
      title: "Lunch at Bar del Pla",
      type: "Lunch",
      description: "Traditional Catalan tapas in a cozy atmosphere.",
      location: "Carrer Montcada, 2, Barcelona",
      duration: "1 hour"
    },
    {
      title: "Lunch at Can Culleretes",
      type: "Lunch",
      description: "Dine at one of the oldest restaurants in Barcelona, serving Catalan cuisine since 1786.",
      location: "Carrer d'en Quintana, 5, Barcelona",
      duration: "1.5 hours"
    }
  ];
  
  const dinnerOptions = [
    {
      title: "Dinner at Tickets",
      type: "Dinner",
      description: "Experience avant-garde tapas at this world-renowned restaurant by Albert Adrià.",
      location: "Av. del Paraŀlel, 164, Barcelona",
      duration: "2 hours"
    },
    {
      title: "Dinner at 7 Portes",
      type: "Dinner",
      description: "Enjoy traditional paella at this classic Barcelona restaurant.",
      location: "Passeig Isabel II, 14, Barcelona",
      duration: "2 hours"
    },
    {
      title: "Tapas Tour in El Born",
      type: "Dinner",
      description: "Hop between tapas bars in the trendy El Born district, sampling local specialties.",
      location: "El Born, Barcelona",
      duration: "3 hours"
    }
  ];
  
  // Create day-by-day itinerary
  for (let i = 0; i < days; i++) {
    const dayActivities = [];
    
    // Add breakfast
    dayActivities.push({
      time: "9:00 AM",
      ...breakfastOptions[i % breakfastOptions.length]
    });
    
    // Add morning activity
    dayActivities.push({
      time: "10:00 AM",
      ...allActivities[(i * 2) % allActivities.length]
    });
    
    // Add lunch
    dayActivities.push({
      time: "1:00 PM",
      ...lunchOptions[i % lunchOptions.length]
    });
    
    // Add afternoon activity
    dayActivities.push({
      time: "3:00 PM",
      ...allActivities[(i * 2 + 1) % allActivities.length]
    });
    
    // Add dinner
    dayActivities.push({
      time: "8:00 PM",
      ...dinnerOptions[i % dinnerOptions.length]
    });
    
    mockDays.push({
      title: i === 0 ? "Arrival & City Introduction" : 
             i === days - 1 ? "Final Explorations" : 
             `Exploring Barcelona Day ${i + 1}`,
      activities: dayActivities
    });
  }
  
  // Generate mock flights based on budget
  const mockFlights = [
    {
      airline: "Vueling Airlines",
      departureTime: "10:25 AM",
      arrivalTime: "12:40 PM",
      duration: "2h 15m",
      stops: 0,
      price: budget === "luxury" ? "$450" : budget === "moderate" ? "$320" : "$240"
    },
    {
      airline: "Iberia",
      departureTime: "2:15 PM",
      arrivalTime: "4:35 PM",
      duration: "2h 20m",
      stops: 0,
      price: budget === "luxury" ? "$520" : budget === "moderate" ? "$380" : "$290"
    },
    {
      airline: "Ryanair",
      departureTime: "7:05 AM",
      arrivalTime: "9:30 AM",
      duration: "2h 25m",
      stops: 0,
      price: budget === "luxury" ? "$350" : budget === "moderate" ? "$220" : "$150"
    }
  ];
  
  // Generate mock hotels based on budget
  const mockHotels = [
    {
      name: budget === "luxury" ? "Hotel Arts Barcelona" : 
            budget === "moderate" ? "H10 Madison" : 
            "Hotel Market",
      location: budget === "luxury" ? "Marina Coastal Area" : 
                budget === "moderate" ? "Gothic Quarter" : 
                "Sant Antoni",
      price: budget === "luxury" ? "$450" : 
             budget === "moderate" ? "$180" : 
             "$95",
      rating: budget === "luxury" ? 4.8 : 
              budget === "moderate" ? 4.5 : 
              4.2,
      image: "https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: budget === "luxury" ? "Mandarin Oriental Barcelona" : 
            budget === "moderate" ? "Hotel 1898" : 
            "Hostal Grau",
      location: budget === "luxury" ? "Passeig de Gràcia" : 
                budget === "moderate" ? "La Rambla" : 
                "El Raval",
      price: budget === "luxury" ? "$520" : 
             budget === "moderate" ? "$210" : 
             "$85",
      rating: budget === "luxury" ? 4.9 : 
              budget === "moderate" ? 4.6 : 
              4.1,
      image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: budget === "luxury" ? "Cotton House Hotel" : 
            budget === "moderate" ? "Kimpton Vividora Hotel" : 
            "Casa Camper",
      location: budget === "luxury" ? "Eixample" : 
                budget === "moderate" ? "Gothic Quarter" : 
                "Raval",
      price: budget === "luxury" ? "$480" : 
             budget === "moderate" ? "$195" : 
             "$110",
      rating: budget === "luxury" ? 4.7 : 
              budget === "moderate" ? 4.4 : 
              4.3,
      image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  // Generate mock restaurants based on interests
  const mockRestaurants = [
    {
      name: "Disfrutar",
      cuisine: "Contemporary Catalan",
      location: "Eixample",
      priceRange: budget === "luxury" ? "€€€€" : "€€€",
      rating: 4.9,
      image: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "El Quim de la Boqueria",
      cuisine: "Spanish, Seafood",
      location: "La Boqueria Market",
      priceRange: "€€",
      rating: 4.7,
      image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Can Culleretes",
      cuisine: "Traditional Catalan",
      location: "Gothic Quarter",
      priceRange: "€€",
      rating: 4.5,
      image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Tickets",
      cuisine: "Creative Tapas",
      location: "Poble Sec",
      priceRange: "€€€€",
      rating: 4.8,
      image: "https://images.pexels.com/photos/370984/pexels-photo-370984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "La Paradeta",
      cuisine: "Seafood",
      location: "Born",
      priceRange: "€€",
      rating: 4.6,
      image: "https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  // Generate mock attractions based on interests
  const mockAttractions = [
    {
      name: "Sagrada Familia",
      category: "Architecture",
      location: "Eixample",
      duration: "2 hours",
      price: "€26",
      image: "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Park Güell",
      category: "Architecture, Park",
      location: "Gràcia",
      duration: "1.5 hours",
      price: "€10",
      image: "https://images.pexels.com/photos/3254459/pexels-photo-3254459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Picasso Museum",
      category: "Art, Museum",
      location: "Born",
      duration: "1.5 hours",
      price: "€12",
      image: "https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Barceloneta Beach",
      category: "Beach",
      location: "Barceloneta",
      duration: "3 hours",
      price: "Free",
      image: "https://images.pexels.com/photos/7078264/pexels-photo-7078264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Camp Nou",
      category: "Sports",
      location: "Les Corts",
      duration: "2 hours",
      price: "€28",
      image: "https://images.pexels.com/photos/12858016/pexels-photo-12858016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Gothic Quarter",
      category: "Historical, Sightseeing",
      location: "Ciutat Vella",
      duration: "2 hours",
      price: "Free",
      image: "https://images.pexels.com/photos/4917073/pexels-photo-4917073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  return {
    title,
    destination: "Barcelona",
    summary,
    pace: "Balanced",
    tags: [],
    days: mockDays,
    flights: mockFlights,
    hotels: mockHotels,
    restaurants: mockRestaurants,
    attractions: mockAttractions
  };
}

function getParisItinerary(days: number, budget: string, interests: string[]): ItineraryType {
  const hasInterest = (keywords: string[]) => 
    keywords.some(keyword => interests.includes(keyword));
  
  const focusOnFood = hasInterest(["food", "cuisine", "dining", "restaurant", "eat"]);
  const focusOnCulture = hasInterest(["museum", "art", "history", "culture"]);
  const focusOnArchitecture = hasInterest(["architecture"]);
  
  let title = `Exploring ${days} Days in Paris`;
  let summary = `A ${days}-day journey through Paris's iconic landmarks, world-class museums, and exquisite cuisine.`;
  
  if (focusOnFood) {
    title = `Paris Food Tour: ${days} Days of Culinary Delights`;
    summary = `A ${days}-day culinary adventure through Paris's best restaurants, bakeries, and markets.`;
  } else if (focusOnCulture) {
    title = `Cultural Immersion: ${days} Days in Paris`;
    summary = `A ${days}-day exploration of Paris's rich cultural heritage, world-famous museums, and historical sites.`;
  } else if (focusOnArchitecture) {
    title = `Paris's Architectural Wonders: ${days}-Day Tour`;
    summary = `A ${days}-day journey through Paris's stunning architectural masterpieces, from Gothic cathedrals to modern design.`;
  }
  
  // Generate mock days based on duration
  const mockDays = [];
  const allActivities = [
    {
      title: "Eiffel Tower",
      type: "Sightseeing",
      description: "Visit the iconic symbol of Paris and enjoy panoramic views of the city.",
      location: "Champ de Mars, 5 Avenue Anatole France, Paris",
      duration: "2 hours"
    },
    {
      title: "Louvre Museum",
      type: "Museum",
      description: "Explore one of the world's largest art museums, home to the Mona Lisa and thousands of other masterpieces.",
      location: "Rue de Rivoli, Paris",
      duration: "3 hours"
    },
    {
      title: "Notre-Dame Cathedral",
      type: "Sightseeing",
      description: "Admire the exterior of this Gothic masterpiece (interior closed for renovation after the 2019 fire).",
      location: "Parvis Notre-Dame - Pl. Jean-Paul II, Paris",
      duration: "1 hour"
    },
    {
      title: "Montmartre",
      type: "Sightseeing",
      description: "Explore this charming historic district known for its artistic history and the beautiful Sacré-Cœur Basilica.",
      location: "Montmartre, Paris",
      duration: "2 hours"
    },
    {
      title: "Champs-Élysées",
      type: "Sightseeing",
      description: "Stroll down one of the world's most famous avenues, lined with shops, cafés, and theaters.",
      location: "Champs-Élysées, Paris",
      duration: "1.5 hours"
    },
    {
      title: "Musée d'Orsay",
      type: "Museum",
      description: "Visit this museum housed in a former railway station, featuring a remarkable collection of Impressionist art.",
      location: "1 Rue de la Légion d'Honneur, Paris",
      duration: "2 hours"
    },
    {
      title: "Luxembourg Gardens",
      type: "Park",
      description: "Relax in these beautiful gardens surrounding the Luxembourg Palace, the seat of the French Senate.",
      location: "Rue de Médicis, Paris",
      duration: "1 hour"
    },
    {
      title: "Seine River Cruise",
      type: "Sightseeing",
      description: "See Paris from a different perspective on a leisurely boat cruise along the Seine River.",
      location: "Pont de l'Alma, Paris",
      duration: "1 hour"
    },
    {
      title: "Arc de Triomphe",
      type: "Sightseeing",
      description: "Visit this iconic monument honoring those who fought for France, with spectacular views from the top.",
      location: "Place Charles de Gaulle, Paris",
      duration: "1 hour"
    },
    {
      title: "Centre Pompidou",
      type: "Museum",
      description: "Explore this inside-out building housing Europe's largest collection of modern and contemporary art.",
      location: "Place Georges-Pompidou, Paris",
      duration: "2 hours"
    }
  ];
  
  const breakfastOptions = [
    {
      title: "Breakfast at Café de Flore",
      type: "Breakfast",
      description: "Start your day at this iconic Parisian café with coffee and pastries.",
      location: "172 Boulevard Saint-Germain, Paris",
      duration: "45 minutes"
    },
    {
      title: "Breakfast at Du Pain et des Idées",
      type: "Breakfast",
      description: "Enjoy some of the best pastries in Paris at this famous bakery.",
      location: "34 Rue Yves Toudic, Paris",
      duration: "45 minutes"
    }
  ];
  
  const lunchOptions = [
    {
      title: "Lunch at Bouillon Chartier",
      type: "Lunch",
      description: "Experience traditional French cuisine at this historic restaurant with affordable prices.",
      location: "7 Rue du Faubourg Montmartre, Paris",
      duration: "1 hour"
    },
    {
      title: "Lunch at Le Comptoir du Relais",
      type: "Lunch",
      description: "Enjoy creative French bistro cuisine in the heart of Saint-Germain-des-Prés.",
      location: "9 Carrefour de l'Odéon, Paris",
      duration: "1 hour"
    },
    {
      title: "Lunch at Marché des Enfants Rouges",
      type: "Lunch",
      description: "Sample diverse cuisines at Paris's oldest covered market.",
      location: "39 Rue de Bretagne, Paris",
      duration: "1.5 hours"
    }
  ];
  
  const dinnerOptions = [
    {
      title: "Dinner at Le Jules Verne",
      type: "Dinner",
      description: "Experience fine dining with a view at this restaurant located on the Eiffel Tower.",
      location: "Eiffel Tower, Avenue Gustave Eiffel, Paris",
      duration: "2 hours"
    },
    {
      title: "Dinner at Bistrot Paul Bert",
      type: "Dinner",
      description: "Enjoy classic French bistro fare at this beloved local institution.",
      location: "18 Rue Paul Bert, Paris",
      duration: "2 hours"
    },
    {
      title: "Wine and Cheese Tasting",
      type: "Dinner",
      description: "Sample various French wines and cheeses at a cozy wine bar.",
      location: "Le Marais, Paris",
      duration: "2 hours"
    }
  ];
  
  // Create day-by-day itinerary
  for (let i = 0; i < days; i++) {
    const dayActivities = [];
    
    // Add breakfast
    dayActivities.push({
      time: "9:00 AM",
      ...breakfastOptions[i % breakfastOptions.length]
    });
    
    // Add morning activity
    dayActivities.push({
      time: "10:00 AM",
      ...allActivities[(i * 2) % allActivities.length]
    });
    
    // Add lunch
    dayActivities.push({
      time: "1:00 PM",
      ...lunchOptions[i % lunchOptions.length]
    });
    
    // Add afternoon activity
    dayActivities.push({
      time: "3:00 PM",
      ...allActivities[(i * 2 + 1) % allActivities.length]
    });
    
    // Add dinner
    dayActivities.push({
      time: "8:00 PM",
      ...dinnerOptions[i % dinnerOptions.length]
    });
    
    mockDays.push({
      title: i === 0 ? "Arrival & City Introduction" : 
             i === days - 1 ? "Final Explorations" : 
             `Discovering Paris Day ${i + 1}`,
      activities: dayActivities
    });
  }
  
  // Generate mock flights based on budget
  const mockFlights = [
    {
      airline: "Air France",
      departureTime: "9:15 AM",
      arrivalTime: "11:30 AM",
      duration: "2h 15m",
      stops: 0,
      price: budget === "luxury" ? "$550" : budget === "moderate" ? "$420" : "$320"
    },
    {
      airline: "British Airways",
      departureTime: "1:30 PM",
      arrivalTime: "3:50 PM",
      duration: "2h 20m",
      stops: 0,
      price: budget === "luxury" ? "$580" : budget === "moderate" ? "$440" : "$350"
    },
    {
      airline: "EasyJet",
      departureTime: "6:45 AM",
      arrivalTime: "9:05 AM",
      duration: "2h 20m",
      stops: 0,
      price: budget === "luxury" ? "$380" : budget === "moderate" ? "$250" : "$180"
    }
  ];
  
  // Generate mock hotels based on budget
  const mockHotels = [
    {
      name: budget === "luxury" ? "Ritz Paris" : 
            budget === "moderate" ? "Hôtel Le Relais Montmartre" : 
            "Generator Paris",
      location: budget === "luxury" ? "Place Vendôme" : 
                budget === "moderate" ? "Montmartre" : 
                "Canal Saint-Martin",
      price: budget === "luxury" ? "$950" : 
             budget === "moderate" ? "$220" : 
             "$80",
      rating: budget === "luxury" ? 4.9 : 
              budget === "moderate" ? 4.5 : 
              4.3,
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: budget === "luxury" ? "Four Seasons Hotel George V" : 
            budget === "moderate" ? "Hôtel Fabric" : 
            "Hôtel Paradis",
      location: budget === "luxury" ? "Champs-Élysées" : 
                budget === "moderate" ? "Oberkampf" : 
                "10th Arrondissement",
      price: budget === "luxury" ? "$1,200" : 
             budget === "moderate" ? "$240" : 
             "$110",
      rating: budget === "luxury" ? 4.9 : 
              budget === "moderate" ? 4.6 : 
              4.2,
      image: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: budget === "luxury" ? "Hôtel Plaza Athénée" : 
            budget === "moderate" ? "Le Pavillon de la Reine" : 
            "The Loft Boutique Hostel",
      location: budget === "luxury" ? "Avenue Montaigne" : 
                budget === "moderate" ? "Le Marais" : 
                "Belleville",
      price: budget === "luxury" ? "$1,100" : 
             budget === "moderate" ? "$280" : 
             "$70",
      rating: budget === "luxury" ? 4.8 : 
              budget === "moderate" ? 4.7 : 
              4.1,
      image: "https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  // Generate mock restaurants based on interests
  const mockRestaurants = [
    {
      name: "Le Jules Verne",
      cuisine: "Contemporary French",
      location: "Eiffel Tower",
      priceRange: budget === "luxury" ? "€€€€" : "€€€€",
      rating: 4.7,
      image: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Bouillon Chartier",
      cuisine: "Traditional French",
      location: "9th Arrondissement",
      priceRange: "€€",
      rating: 4.3,
      image: "https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "L'As du Fallafel",
      cuisine: "Middle Eastern",
      location: "Le Marais",
      priceRange: "€",
      rating: 4.6,
      image: "https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Septime",
      cuisine: "Modern French",
      location: "11th Arrondissement",
      priceRange: "€€€",
      rating: 4.8,
      image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Breizh Café",
      cuisine: "Breton (Crêpes)",
      location: "Le Marais",
      priceRange: "€€",
      rating: 4.5,
      image: "https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  // Generate mock attractions based on interests
  const mockAttractions = [
    {
      name: "Eiffel Tower",
      category: "Landmark",
      location: "7th Arrondissement",
      duration: "2 hours",
      price: "€26",
      image: "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Louvre Museum",
      category: "Art Museum",
      location: "1st Arrondissement",
      duration: "3 hours",
      price: "€17",
      image: "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Musée d'Orsay",
      category: "Art Museum",
      location: "7th Arrondissement",
      duration: "2 hours",
      price: "€14",
      image: "https://images.pexels.com/photos/2675268/pexels-photo-2675268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Montmartre & Sacré-Cœur",
      category: "District, Church",
      location: "18th Arrondissement",
      duration: "2 hours",
      price: "Free",
      image: "https://images.pexels.com/photos/705764/pexels-photo-705764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Seine River Cruise",
      category: "Boat Tour",
      location: "Various departure points",
      duration: "1 hour",
      price: "€15",
      image: "https://images.pexels.com/photos/981682/pexels-photo-981682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
      name: "Palace of Versailles",
      category: "Historic Palace",
      location: "Versailles (day trip)",
      duration: "5 hours",
      price: "€20",
      image: "https://images.pexels.com/photos/1483778/pexels-photo-1483778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
  ];
  
  return {
    title,
    destination: "Paris",
    summary,
    pace: "Balanced",
    tags: [],
    days: mockDays,
    flights: mockFlights,
    hotels: mockHotels,
    restaurants: mockRestaurants,
    attractions: mockAttractions
  };
}