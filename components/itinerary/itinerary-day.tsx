import { Activity } from "@/lib/types";
import { 
  Clock,
  MapPin,
  Coffee,
  UtensilsCrossed,
  Waves,
  Camera,
  Bus,
  Building,
  Plane,
  Hotel,
  Ticket
} from "lucide-react";

type ItineraryDayProps = {
  day: {
    title: string;
    activities: Activity[];
  };
  dayNumber: number;
};

export function ItineraryDay({ day, dayNumber }: ItineraryDayProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
      case 'coffee':
        return <Coffee className="h-4 w-4" />;
      case 'lunch':
      case 'dinner':
        return <UtensilsCrossed className="h-4 w-4" />;
      case 'museum':
      case 'gallery':
        return <Building className="h-4 w-4" />;
      case 'sightseeing':
        return <Camera className="h-4 w-4" />;
      case 'beach':
      case 'relax':
        return <Waves className="h-4 w-4" />;
      case 'transport':
      case 'transfer':
        return <Bus className="h-4 w-4" />;
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'hotel':
      case 'check-in':
      case 'check-out':
        return <Hotel className="h-4 w-4" />;
      case 'show':
      case 'performance':
        return <Ticket className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <h3 className="font-medium text-lg mb-3">
        Day {dayNumber}: {day.title}
      </h3>
      <div className="space-y-4">
        {day.activities.map((activity, index) => (
          <div 
            key={index} 
            className="relative pl-6 pb-4 border-l last:border-l-0 last:pb-0"
          >
            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                  <div className="flex items-center text-primary text-sm">
                    {getActivityIcon(activity.type)}
                    <span className="ml-1">{activity.type}</span>
                  </div>
                </div>
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </div>
              {activity.duration && (
                <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.duration}
                </div>
              )}
            </div>
            {activity.location && (
              <div className="text-xs flex items-center text-muted-foreground mt-2">
                <MapPin className="h-3 w-3 mr-1" />
                {activity.location}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}