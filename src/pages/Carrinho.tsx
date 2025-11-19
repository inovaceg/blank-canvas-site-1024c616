import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Carrinho = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redireciona para área do cliente se estiver logado, senão para autenticação
    if (user) {
      navigate("/area-do-cliente");
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  return null;
};

export default Carrinho;
