import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../service/api';

const CadastrarPaciente = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const onPacienteSubmit = async (data) => {
    try {
      await api.post('/pacientes', data);
      alert('Paciente cadastrado com sucesso!');
      reset();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cadastrar paciente.');
    }
  };

  return (
    <div className="card p-3">
      <h5 className="text-center mb-3">Cadastrar Novo Paciente</h5>
      <form onSubmit={handleSubmit(onPacienteSubmit)}>
        <div className="row">
          <div className="col-md-6 mb-2"><input className="form-control" {...register('nome', { required: true })} placeholder="Nome Completo" /></div>
          <div className="col-md-6 mb-2"><input className="form-control" {...register('cpf', { required: true })} placeholder="CPF" /></div>
          <div className="col-md-6 mb-2"><input className="form-control" type="date" {...register('dataNascimento', { required: true })} placeholder="Data de Nascimento" /></div>
          <div className="col-md-6 mb-2"><input className="form-control" {...register('contato', { required: true })} placeholder="Contato (Telefone)" /></div>
          <div className="col-md-6 mb-2"><input className="form-control" {...register('login', { required: true })} placeholder="Login de acesso" /></div>
          <div className="col-md-6 mb-2"><input className="form-control" type="password" {...register('senha', { required: true })} placeholder="Senha de acesso" /></div>
        </div>
        <div className="d-grid mt-2">
          <button type="submit" className="btn btn-info text-white">Cadastrar Paciente</button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarPaciente;