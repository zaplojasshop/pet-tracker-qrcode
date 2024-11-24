import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { LocationHistory } from "@/components/LocationHistory";
import { PetDetails } from "@/components/PetDetails";
import { supabase } from "@/integrations/supabase/client";
import type { Location, LocationHistory as LocationHistoryType } from "@/types/location";

const PetInfo = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
    timestamp: new Date().toISOString(),
  });
  const [locationHistory, setLocationHistory] = useState<LocationHistoryType>({ locations: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [petInfo, setPetInfo] = useState<any>(null);

  const searchParams = new URLSearchParams(location.search);
  const qrId = searchParams.get("qr_id");

  useEffect(() => {
    const fetchPetInfo = async () => {
      if (!qrId) return;

      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('qr_id', qrId)
          .single();

        if (error) throw error;
        setPetInfo(data);
      } catch (error) {
        console.error('Erro ao buscar informações:', error);
        toast({
          title: "Erro ao carregar informações",
          description: "Não foi possível carregar as informações do pet.",
          variant: "destructive",
        });
      }
    };

    fetchPetInfo();
  }, [qrId, toast]);

  useEffect(() => {
    const getLocation = async () => {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const newLocation = {
            latitude,
            longitude,
            city: data.address.city || data.address.town,
            country: data.address.country,
            timestamp: new Date().toISOString(),
          };

          setUserLocation(newLocation);
          setLocationHistory(prev => ({
            locations: [...prev.locations, newLocation]
          }));

          toast({
            title: "Localização obtida com sucesso",
            description: `${newLocation.city}, ${newLocation.country}`,
          });
        } catch (error) {
          toast({
            title: "Erro ao obter localização",
            description: "Não foi possível determinar sua localização exata.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    getLocation();
  }, [toast]);

  if (!qrId || !petInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
        <div className="container max-w-md mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <p className="text-lg text-muted-foreground">QR Code inválido</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    const locationText = userLocation.city 
      ? ` na região de ${userLocation.city}, ${userLocation.country}`
      : "";
    const whatsappUrl = `https://wa.me/${petInfo.phone.replace(/\D/g, "")}?text=Olá! Encontrei seu pet ${
      petInfo.pet_name
    }${locationText}!`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMapClick = (lat: number, lon: number) => {
    window.open(
      `https://www.google.com/maps?q=${lat},${lon}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-md mx-auto px-4">
        {isLoading && (
          <Alert>
            <AlertDescription>
              Obtendo sua localização...
            </AlertDescription>
          </Alert>
        )}

        <PetDetails
          petInfo={petInfo}
          userLocation={userLocation}
          onWhatsAppClick={handleWhatsAppClick}
          onMapClick={handleMapClick}
        />

        {locationHistory.locations.length > 1 && (
          <LocationHistory
            locations={locationHistory.locations}
            onMapClick={handleMapClick}
          />
        )}
      </div>
    </div>
  );
};

export default PetInfo;