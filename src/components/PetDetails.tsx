import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Location } from "@/types/location";

interface PetDetailsProps {
  petInfo: any;
  userLocation: Location;
  onWhatsAppClick: () => void;
  onMapClick: (lat: number, lon: number) => void;
}

export const PetDetails = ({ petInfo, userLocation, onWhatsAppClick, onMapClick }: PetDetailsProps) => {
  useEffect(() => {
    const saveLocation = async () => {
      if (userLocation.latitude && userLocation.longitude) {
        try {
          await supabase.from('pet_locations').insert({
            pet_id: petInfo.id,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            city: userLocation.city,
            country: userLocation.country
          });

          // Enviar mensagem automática via WhatsApp
          const locationText = userLocation.city 
            ? `Foi detectada uma localização do seu pet ${petInfo.pet_name} na região de ${userLocation.city}, ${userLocation.country}. `
            : `Foi detectada uma nova localização do seu pet ${petInfo.pet_name}. `;
          
          const mapLink = `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
          const message = `${locationText}Veja no mapa: ${mapLink}`;
          const whatsappUrl = `https://wa.me/${petInfo.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        } catch (error) {
          console.error('Erro ao salvar localização:', error);
        }
      }
    };

    saveLocation();
  }, [userLocation, petInfo]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-primary/5">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Informações do Pet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {petInfo.photo_url && (
          <div className="flex justify-center">
            <img
              src={petInfo.photo_url}
              alt={petInfo.pet_name}
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {petInfo.reward > 0 && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center animate-pulse">
            <h3 className="text-xl font-bold text-green-700 mb-1">Recompensa</h3>
            <p className="text-2xl font-bold text-green-600">
              R$ {petInfo.reward.toFixed(2)}
            </p>
          </div>
        )}

        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-primary">Nome do Pet</h3>
            <p className="text-lg">{petInfo.pet_name}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-primary">Nome do Tutor</h3>
            <p className="text-lg">{petInfo.owner_name}</p>
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
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(userLocation.timestamp), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
              <Button
                onClick={() => onMapClick(userLocation.latitude!, userLocation.longitude!)}
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
          onClick={onWhatsAppClick}
          className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Contatar via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};