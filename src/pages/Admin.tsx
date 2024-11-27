import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PetForm } from "@/components/PetForm";
import { PetList } from "@/components/PetList";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPetForm, setShowPetForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error || !profiles?.is_admin) {
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao verificar admin:", error);
      toast.error("Erro ao verificar permissões");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar usuários");
      return;
    }

    setUsers(profiles || []);
  };

  const toggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentIsAdmin })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Permissões atualizadas com sucesso");
      fetchUsers();
    } catch (error) {
      toast.error("Erro ao atualizar permissões");
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: Math.random().toString(36).slice(-8),
        email_confirm: true,
      });

      if (error) throw error;

      toast.success("Um email será enviado com as instruções de acesso");
      setNewUserEmail("");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePetSubmit = () => {
    setShowPetForm(false);
    setSelectedPet(null);
  };

  const handlePetEdit = (pet: any) => {
    setSelectedPet(pet);
    setShowPetForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gerenciar Pets</h2>
              <Button onClick={() => setShowPetForm(true)} disabled={showPetForm}>
                Adicionar Pet
              </Button>
            </div>
            
            {showPetForm ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedPet ? "Editar Pet" : "Novo Pet"}
                </h3>
                <PetForm
                  onSubmit={handlePetSubmit}
                  initialData={selectedPet}
                  isEditing={!!selectedPet}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPetForm(false);
                    setSelectedPet(null);
                  }}
                  className="mt-4"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <PetList onEdit={handlePetEdit} />
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Usuários</h2>
            <form onSubmit={createUser} className="flex gap-4 mb-6">
              <Input
                type="email"
                placeholder="Email do novo usuário"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                required
              />
              <Button type="submit">Criar Usuário</Button>
            </form>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.is_admin ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAdmin(user.id, user.is_admin)}
                        >
                          {user.is_admin ? "Remover Admin" : "Tornar Admin"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;