import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../service/api';

const CadastroPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/cadastrar', data);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      setError('');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar');
      setSuccess('');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm p-4">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Cadastro de Usuário</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                  id="nome"
                  {...register('nome', { required: 'Nome é obrigatório' })}
                />
                {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="login" className="form-label">Usuário (Login)</label>
                <input
                  type="text"
                  className={`form-control ${errors.login ? 'is-invalid' : ''}`}
                  id="login"
                  {...register('login', { required: 'Usuário é obrigatório' })}
                />
                {errors.login && <div className="invalid-feedback">{errors.login.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha</label>
                <input
                  type="password"
                  className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
                  id="senha"
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
                  })}
                />
                {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="perfil" className="form-label">Perfil</label>
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