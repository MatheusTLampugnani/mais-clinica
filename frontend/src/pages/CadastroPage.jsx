import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../service/api';

const CadastroPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/cadastrar', data);
      setFeedback({ type: 'success', message: 'Cadastro realizado com sucesso! Redirecionando para o login...' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Erro ao cadastrar' });
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-lg p-4">
          <div className="card-body">
            <div className="text-center mb-4">
              <img src="./src/assets/logo_mais_clinica.png" alt="Mais Clínica Logo" style={{ maxWidth: '150px' }} />
              <h3 className="card-title mt-3">Crie sua Conta</h3>
              <p className="text-muted">Preencha os campos abaixo para se registrar.</p>
            </div>

            {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                  id="nome"
                  placeholder="Seu nome completo"
                  {...register('nome', { required: 'Nome é obrigatório' })}
                />
                <label htmlFor="nome">Nome Completo</label>
                {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.login ? 'is-invalid' : ''}`}
                  id="login"
                  placeholder="Seu usuário"
                  {...register('login', { required: 'Usuário é obrigatório' })}
                />
                <label htmlFor="login">Usuário (Login)</label>
                {errors.login && <div className="invalid-feedback">{errors.login.message}</div>}
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
                  id="senha"
                  placeholder="Sua senha"
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
                  })}
                />
                <label htmlFor="senha">Senha</label>
                {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
              </div>
              
              <div className="form-floating mb-3">
                <select
                  className={`form-select ${errors.perfil ? 'is-invalid' : ''}`}
                  id="perfil"
                  defaultValue="recepcionista"
                  {...register('perfil', { required: 'Perfil é obrigatório' })}
                >
                  <option value="admin">Administrador</option>
                  <option value="medico">Médico</option>
                  <option value="recepcionista">Recepcionista</option>
                </select>
                <label htmlFor="perfil">Perfil</label>
                {errors.perfil && <div className="invalid-feedback">{errors.perfil.message}</div>}
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">Cadastrar</button>
              </div>
               <p className="mt-3 text-center">
                Já tem uma conta? <Link to="/login">Faça o login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPage;