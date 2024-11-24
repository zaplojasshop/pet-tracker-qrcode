import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PetInfo } from "./PetForm";

interface PetListProps {
  onEdit: (pet: PetInfo) => void;
}

export const PetList = ({ onEdit }: PetListProps) => {
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data.map(pet => ({
        id: pet.id,
        qr_id: pet.qr_id,
        petName: pet.pet_name,
        ownerName: pet.owner_name,
        address: pet.address || '',
        phone: pet.phone,
        notes: pet.notes || '',
        reward: pet.reward || 0
      })));
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      toast.error("Erro ao carregar lista de pets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter(pet =>
    pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por nome do pet, tutor ou telefone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pet</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Recompensa</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredPets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum pet encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredPets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell>{pet.petName}</TableCell>
                  <TableCell>{pet.ownerName}</TableCell>
                  <TableCell>{pet.phone}</TableCell>
                  <TableCell>
                    {pet.reward ? `R$ ${pet.reward.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(pet)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};