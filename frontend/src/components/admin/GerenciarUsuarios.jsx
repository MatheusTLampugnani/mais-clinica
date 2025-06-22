import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../service/api';

const GerenciarUsuarios = () => {
  const { register: registerMedico, handleSubmit: handleSubmitMedico, reset: resetMedico } = useForm();
  const { register: registerPaciente, handleSubmit: handleSubmitPaciente, reset: resetPaciente } = useForm();
  
  const onMedicoSubmit = async (data) => {
    try {
      await api.post('/medicos', data);
      alert('Médico cadastrado com sucesso!');
      resetMedico();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cadastrar médico.');
    }
  };

  const onPacienteSubmit = async (data) => {
    try {
      await api.post('/pacientes', data);
      alert('Paciente cadastrado com sucesso!');
      resetPaciente();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cadastrar paciente.');
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card p-3">
          <h5>Cadastrar Novo Médico</h5>
          <form onSubmit={handleSubmitMedico(onMedicoSubmit)}>
            <div className="mb-2"><input className="form-control" {...registerMedico('nome', { required: true })} placeholder="Nome Completo" /></div>
            <div className="mb-2"><input className="form-control" {...registerMedico('crm', { required: true })} placeholder="CRM" /></div>
            <div className="mb-2"><input className="form-control" {...registerMedico('login', { required: true })} placeholder="Login" /></div>
            <div className="mb-2"><input className="form-control" type="password" {...registerMedico('senha', { required: true })} placeholder="Senha" /></div>
            <button type="submit" className="btn btn-success w-100">Cadastrar Médico</button>
          </form>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card p-3">
          <h5>Cadastrar Novo Paciente</h5>
          <form onSubmit={handleSubmitPaciente(onPacienteSubmit)}>
            <div className="mb-2"><input className="form-control" {...registerPaciente('nome', { required: true })} placeholder="Nome Completo" /></div>
            <div className="mb-2"><input className="form-control" {...registerPaciente('cpf', { required: true })} placeholder="CPF" /></div>
            <div className="mb-2"><input className="form-control" type="date" {...registerPaciente('dataNascimento', { required: true })} placeholder="Data de Nascimento" /></div>
            <div className="mb-2"><input className="form-control" {...registerPaciente('contato', { required: true })} placeholder="Contato (Telefone)" /></div>
            <div className="mb-2"><input className="form-control" {...registerPaciente('login', { required: true })} placeholder="Login" /></div>
            <div className="mb-2"><input className="form-control" type="password" {...registerPaciente('senha', { required: true })} placeholder="Senha" /></div>
            <button type="submit" className="btn btn-info w-100 text-white">Cadastrar Paciente</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GerenciarUsuarios;