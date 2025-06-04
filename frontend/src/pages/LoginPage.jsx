import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "../service/api";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("perfil", response.data.perfil);
      localStorage.setItem("nome", response.data.nome);

      switch(response.data.perfil) {
        case "recepcionista":
          navigate("/recepcionista");
          break;
        case "medico":
          navigate("/medico");
          break;
        case "paciente":
          navigate("/paciente");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ /* estilos */ }}>
      {/* Formulário de login existente */}
    </Box>
  );
};

export default LoginPage;