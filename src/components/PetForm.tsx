import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface PetInfo {
  petName: string;
  ownerName: string;
  address: string;
  phone: string;
  notes: string;
  reward?: number;
  qr_id?: string;
  id?: string;
}

interface PetFormProps {
  onSubmit: (data: PetInfo) => void;
  initialData?: PetInfo;
  isEditing?: boolean;
}

export const PetForm = ({ onSubmit, initialData, isEditing = false }: PetFormProps) => {
  const [formData, setFormData] = useState<PetInfo>(initialData || {
    petName: "",
    ownerName: "",
    address: "",
    phone: "",
    notes: "",
    reward: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petName || !formData.ownerName || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && formData.id) {
        const { data, error } = await supabase
          .from('pets')
          .update({
            pet_name: formData.petName,
            owner_name: formData.ownerName,
            address: formData.address,
            phone: formData.phone,
            notes: formData.notes,
            reward: formData.reward || 0
          })
          .eq('id', formData.id)
          .select()
          .single();

        if (error) throw error;
        onSubmit({
          ...formData,
          qr_id: data.qr_id
        });
        toast.success("Informações atualizadas com sucesso!");
      } else {
        const { data, error } = await supabase
          .from('pets')
          .insert({
            pet_name: formData.petName,
            owner_name: formData.ownerName,
            address: formData.address,
            phone: formData.phone,
            notes: formData.notes,
            reward: formData.reward || 0
          })
          .select()
          .single();

        if (error) throw error;
        onSubmit({
          ...formData,
          qr_id: data.qr_id
        });
        toast.success("QR Code gerado com sucesso!");
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error(isEditing ? "Erro ao atualizar informações." : "Erro ao gerar QR Code. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
        <Label htmlFor="reward">Recompensa (R$)</Label>
        <Input
          id="reward"
          type="number"
          min="0"
          step="0.01"
          value={formData.reward || 0}
          onChange={(e) => setFormData({ ...formData, reward: parseFloat(e.target.value) || 0 })}
          placeholder="Ex: 100.00"
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Gerar QR Code"}
      </Button>
    </form>
  );
};