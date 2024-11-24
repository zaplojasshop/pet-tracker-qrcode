import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Location {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  timestamp: string;
}

interface LocationHistory {
  locations: Location[];
}

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
  const [locationHistory, setLocationHistory] = useState<LocationHistory>({ locations: [] });
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const encodedData = searchParams.get("data");

  useEffect(() => {
    const getLocation = async () => {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;
          
          // Usando a API de geocodificação reversa do OpenStreetMap
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

  if (!encodedData) {
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

  const petInfo = JSON.parse(decodeURIComponent(encodedData));

  const handleWhatsAppClick = () => {
    const locationText = userLocation.city 
      ? ` na região de ${userLocation.city}, ${userLocation.country}`
      : "";
    const whatsappUrl = `https://wa.me/${petInfo.phone.replace(/\D/g, "")}?text=Olá! Encontrei seu pet ${
      petInfo.petName
    }${locationText}!`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMapClick = () => {
    if (userLocation.latitude && userLocation.longitude) {
      window.open(
        `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-md mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-primary/5">
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Informações do Pet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {isLoading && (
              <Alert>
                <AlertDescription>
                  Obtendo sua localização...
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Nome do Pet</h3>
                <p className="text-lg">{petInfo.petName}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Nome do Tutor</h3>
                <p className="text-lg">{petInfo.ownerName}</p>
              </div>
              {petInfo.address && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Endereço</h3>
                  <p className="text-lg">{petInfo.address}</p>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Telefone</h3>
                <p className="text-lg">{petInfo.phone}</p>
              </div>
              {petInfo.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Observações</h3>
                  <p className="text-lg">{petInfo.notes}</p>
                </div>
              )}
              {userLocation.city && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Localização Atual</h3>
                  <p className="text-lg">
                    {userLocation.city}, {userLocation.country}
                  </p>
                  <Button
                    onClick={handleMapClick}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Ver no Mapa
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contatar via WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetInfo;