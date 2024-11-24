import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall } from "lucide-react";

const PetInfo = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedData = searchParams.get("data");
  
  if (!encodedData) {
    return <div className="container max-w-md mx-auto px-4 py-12">QR Code inválido</div>;
  }

  const petInfo = JSON.parse(decodeURIComponent(encodedData));

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${petInfo.phone.replace(/\D/g, "")}?text=Olá! Encontrei seu pet ${petInfo.petName}!`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-md mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Informações do Pet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Nome do Pet</h3>
              <p>{petInfo.petName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Nome do Tutor</h3>
              <p>{petInfo.ownerName}</p>
            </div>
            {petInfo.address && (
              <div>
                <h3 className="font-semibold">Endereço</h3>
                <p>{petInfo.address}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Telefone</h3>
              <p>{petInfo.phone}</p>
            </div>
            {petInfo.notes && (
              <div>
                <h3 className="font-semibold">Observações</h3>
                <p>{petInfo.notes}</p>
              </div>
            )}
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              Contatar via WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetInfo;