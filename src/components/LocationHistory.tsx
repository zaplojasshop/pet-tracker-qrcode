import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Location {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timestamp: string;
}

interface LocationHistoryProps {
  locations: Location[];
  onMapClick: (lat: number, lon: number) => void;
}

export const LocationHistory = ({ locations, onMapClick }: LocationHistoryProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Histórico de Localizações</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {location.city}, {location.country}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(location.timestamp), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              {location.latitude && location.longitude && (
                <button
                  onClick={() => onMapClick(location.latitude!, location.longitude!)}
                  className="text-sm text-primary hover:underline"
                >
                  Ver no Mapa
                </button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};