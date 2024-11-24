import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export interface PetInfo {
  petName: string;
  ownerName: string;
  address: string;
  phone: string;
  notes: string;
}

interface PetFormProps {
  onSubmit: (data: PetInfo) => void;
}

export const PetForm = ({ onSubmit }: PetFormProps) => {
  const [formData, setFormData] = useState<PetInfo>({
    petName: "",
    ownerName: "",
    address: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petName || !formData.ownerName || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    onSubmit(formData);
    toast.success("QR Code gerado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="petName">Nome do Pet *</Label>
        <Input
          id="petName"
          value={formData.petName}
          onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
          placeholder="Ex: Rex"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerName">Nome do Tutor *</Label>
        <Input
          id="ownerName"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          placeholder="Ex: João Silva"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Ex: Rua Example, 123"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Ex: (11) 99999-9999"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Informações adicionais sobre seu pet"
          className="h-24"
        />
      </div>

      <Button type="submit" className="w-full">
        Gerar QR Code
      </Button>
    </form>
  );
};