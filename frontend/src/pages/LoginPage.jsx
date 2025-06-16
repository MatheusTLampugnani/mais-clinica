import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../service/api";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("perfil", response.data.perfil);
      localStorage.setItem("nome", response.data.nome);
      localStorage.setItem("id", response.data.id);
      
      const { perfil } = response.data;

      switch (perfil) {
        case 'recepcionista':
          navigate('/recepcionista');
          break;
        case 'medico':
          navigate('/medico');
          break;
        case 'paciente':
          navigate('/paciente');
          break;
        case 'admin':
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm p-4">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Login da Clínica</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="login" className="form-label">Usuário</label>
                <input
                  type="text"
                  className={`form-control ${errors.login ? "is-invalid" : ""}`}
                  id="login"
                  {...register("login", { required: "Usuário é obrigatório" })}
                />
                {errors.login && <div className="invalid-feedback">{errors.login.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha</label>
                <input
                  type="password"
                  className={`form-control ${errors.senha ? "is-invalid" : ""}`}
                  id="senha"
                  {...register("senha", { required: "Senha é obrigatória" })}
                />
                {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">
                  Entrar
                </button>
              </div>
              <p className="mt-3 text-center">
                Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;