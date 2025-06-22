import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../service/api";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário já tiver um token, redireciona para a página principal
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      
      // Armazena os dados do usuário no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("perfil", response.data.perfil);
      localStorage.setItem("nome", response.data.nome);
      localStorage.setItem("id", response.data.id);
      
      // Navega para o painel correto com base no perfil
      const { perfil } = response.data;
      if (perfil === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/${perfil}`);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg p-4 border-0">
          <div className="card-body">
            <div className="text-center mb-4">
              <img src="./src/assets/logo_mais_clinica.png" alt="Mais Clínica Logo" style={{ maxWidth: '150px' }} />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.login ? "is-invalid" : ""}`}
                  id="login"
                  placeholder="Seu usuário"
                  {...register("login", { required: "Usuário é obrigatório" })}
                />
                <label htmlFor="login">Usuário</label>
                {errors.login && <div className="invalid-feedback">{errors.login.message}</div>}
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className={`form-control ${errors.senha ? "is-invalid" : ""}`}
                  id="senha"
                  placeholder="Sua senha"
                  {...register("senha", { required: "Senha é obrigatória" })}
                />
                <label htmlFor="senha">Senha</label>
                {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg">
                  Entrar
                </button>
              </div>
              <p className="mt-4 text-center text-muted">
                Não tem uma conta? <Link to="/cadastro">Cadastre-se aqui</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;