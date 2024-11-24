import { useState } from "react";
import { PetForm, type PetInfo } from "@/components/PetForm";
import { PetQRCode } from "@/components/PetQRCode";
import { PetList } from "@/components/PetList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (data: PetInfo) => {
    setPetInfo(data);
    setIsEditing(false);
  };

  const handleReset = () => {
    setPetInfo(null);
    setIsEditing(false);
  };

  const handleEdit = (pet?: PetInfo) => {
    if (pet) {
      setPetInfo(pet);
    }
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Pet QR Code</h1>
          <p className="text-muted-foreground">
            Gere um QR Code para identificar seu pet
          </p>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Gerar QR Code</TabsTrigger>
            <TabsTrigger value="list">Lista de Pets</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {petInfo && !isEditing ? (
                <PetQRCode 
                  petInfo={petInfo} 
                  onReset={handleReset}
                  onEdit={() => handleEdit()}
                />
              ) : (
                <PetForm 
                  onSubmit={handleSubmit}
                  initialData={isEditing ? petInfo : undefined}
                  isEditing={isEditing}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <PetList onEdit={handleEdit} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;