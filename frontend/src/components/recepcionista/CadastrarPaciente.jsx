import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../service/api';

const CadastrarPaciente = ({ onPatientRegistered }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  
  const onPacienteSubmit = async (data) => {
    setFeedback({ type: '', message: '' });
    try {
      await api.post('/pacientes', data);
      setFeedback({ type: 'success', message: 'Paciente cadastrado com sucesso!' });
      reset();

      if (onPatientRegistered) {
        onPatientRegistered();
      }
    } catch (error) {
      setFeedback({ type: 'danger', message: error.response?.data?.message || 'Erro ao cadastrar paciente.' });
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h5 className="text-center mb-3">Cadastrar Novo Paciente</h5>
      {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
      
      <form onSubmit={handleSubmit(onPacienteSubmit)} noValidate>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="paciente-nome" placeholder="Nome Completo" {...register('nome', { required: 'Nome é obrigatório.' })} />
              <label htmlFor="paciente-nome">Nome Completo</label>
              {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input type="text" className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} id="paciente-cpf" placeholder="CPF" {...register('cpf', { required: 'CPF é obrigatório.' })} />
              <label htmlFor="paciente-cpf">CPF</label>
              {errors.cpf && <div className="invalid-feedback">{errors.cpf.message}</div>}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input type="date" className={`form-control ${errors.dataNascimento ? 'is-invalid' : ''}`} id="paciente-dataNascimento" placeholder="Data de Nascimento" {...register('dataNascimento', { required: 'Data de nascimento é obrigatória.' })} />
              <label htmlFor="paciente-dataNascimento">Data de Nascimento</label>
              {errors.dataNascimento && <div className="invalid-feedback">{errors.dataNascimento.message}</div>}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input type="text" className={`form-control ${errors.contato ? 'is-invalid' : ''}`} id="paciente-contato" placeholder="Contato (Telefone)" {...register('contato', { required: 'Contato é obrigatório.' })} />
              <label htmlFor="paciente-contato">Contato (Telefone)</label>
              {errors.contato && <div className="invalid-feedback">{errors.contato.message}</div>}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input type="text" className={`form-control ${errors.login ? 'is-invalid' : ''}`} id="paciente-login" placeholder="Login de acesso" {...register('login', { required: 'Login é obrigatório.' })} />
              <label htmlFor="paciente-login">Login de acesso</label>
              {errors.login && <div className="invalid-feedback">{errors.login.message}</div>}
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-floating">
              <input type="password" className={`form-control ${errors.senha ? 'is-invalid' : ''}`} id="paciente-senha" placeholder="Senha de acesso" {...register('senha', { required: 'Senha é obrigatória.' })} />
              <label htmlFor="paciente-senha">Senha de acesso</label>
              {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
            </div>
          </div>
        </div>
        <div className="d-grid mt-2">
          <button type="submit" className="btn btn-info text-white">Cadastrar Paciente</button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarPaciente;