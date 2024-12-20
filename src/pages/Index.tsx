import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PetList } from "@/components/PetList";
import type { PetInfo } from "@/components/PetForm";

const Index = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();
          
          setIsAdmin(profile?.is_admin || false);
        } else {
          setIsAdmin(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        toast.error("Erro ao verificar permissões do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      } else {
        setIsAdmin(false);
        navigate("/login");
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const handleEditPet = (pet: PetInfo) => {
    navigate("/pet-info", { state: { pet } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bem-vindo</h1>
          <div className="space-x-4">
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Painel Admin
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Gerar QR Code</h2>
            <Button onClick={() => navigate("/pet-info")}>
              Gerar Novo QR Code
            </Button>
          </div>

          {isAdmin && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Lista de Pets</h2>
              <PetList onEdit={handleEditPet} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;