import { useState } from "react";
import { PetForm, type PetInfo } from "@/components/PetForm";
import { PetQRCode } from "@/components/PetQRCode";

const Index = () => {
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);

  const handleSubmit = (data: PetInfo) => {
    setPetInfo(data);
  };

  const handleReset = () => {
    setPetInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Pet QR Code</h1>
          <p className="text-muted-foreground">
            Gere um QR Code para identificar seu pet
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {petInfo ? (
            <PetQRCode petInfo={petInfo} onReset={handleReset} />
          ) : (
            <PetForm onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;