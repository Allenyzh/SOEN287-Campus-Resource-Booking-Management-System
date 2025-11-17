import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock } from "lucide-react";
import { Resource } from "@/stores/bookingStore";

interface ResourceCardProps {
  resource: Resource;
  onBook: (resource: Resource) => void;
}

export function ResourceCard({ resource, onBook }: ResourceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{resource.name}</CardTitle>
          <Badge variant={resource.available ? "default" : "destructive"}>
            {resource.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{resource.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>Capacity: {resource.capacity} people</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <Badge variant="secondary">{resource.category}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onBook(resource)}
          disabled={!resource.available}
          className="w-full disabled:opacity-50"
        >
          {resource.available ? "Book Now" : "Not Available"}
        </Button>
      </CardFooter>
    </Card>
  );
}
