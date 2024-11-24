import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const PetInfo = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedData = searchParams.get("data");
  
  if (!encodedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
        <div className="container max-w-md mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-lg text-muted-foreground">QR Code inválido</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const petInfo = JSON.parse(decodeURIComponent(encodedData));

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${petInfo.phone.replace(/\D/g, "")}?text=Olá! Encontrei seu pet ${petInfo.petName}!`;
    window.open(whatsappUrl, "_blank");
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