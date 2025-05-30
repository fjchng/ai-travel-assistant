import { 
  Globe, 
  Calendar, 
  Map, 
  Utensils, 
  Hotel, 
  Plane,
  PencilRuler
} from "lucide-react";

const features = [
  {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: "Personalized Itineraries",
    description: "Get detailed day-by-day plans tailored to your preferences and travel style."
  },
  {
    icon: <Map className="h-6 w-6 text-chart-2" />,
    title: "Interactive Maps",
    description: "Visualize your trip with interactive maps showing all recommended locations."
  },
  {
    icon: <Utensils className="h-6 w-6 text-chart-4" />,
    title: "Dining Recommendations",
    description: "Discover local cuisine and restaurants that match your taste and budget."
  },
  {
    icon: <Hotel className="h-6 w-6 text-chart-3" />,
    title: "Accommodation Options",
    description: "Find the perfect place to stay, from luxury hotels to budget-friendly hostels."
  },
  {
    icon: <Plane className="h-6 w-6 text-chart-1" />,
    title: "Flight Suggestions",
    description: "Get estimated flight options to start planning your journey."
  },
  {
    icon: <PencilRuler className="h-6 w-6 text-chart-5" />,
    title: "Customizable Plans",
    description: "Easily refine and adjust your itinerary to make it perfect for you."
  }
];

export function Features() {
  return (
    <section className="py-10 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Plan Your Perfect Trip</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered travel assistant helps you create personalized travel experiences with just a few words.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}