import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../service/api';

const GerenciarUsuarios = () => {
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue } = useForm();
  const { register: registerMedico, handleSubmit: handleSubmitMedico, reset: resetMedico } = useForm();
  const { register: registerRecepcionista, handleSubmit: handleSubmitRecepcionista, reset: resetRecepcionista } = useForm();

  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [medicoEmEdicao, setMedicoEmEdicao] = useState(null);

  const fetchMedicos = async () => {
    try {
        const response = await api.get('/medicos');
        setMedicos(response.data.medicos);
    } catch (error) {
        console.error("Erro ao buscar médicos", error);
    }
  };
  
  const fetchEspecialidades = async () => {
    try {
        const response = await api.get('/especialidades');
        setEspecialidades(response.data.especialidades);
    } catch (error) {
        console.error("Erro ao buscar especialidades", error);
    }
  };

  useEffect(() => {
    fetchMedicos();
    fetchEspecialidades();
  }, []);

  const handleEdit = (medico) => {
    setMedicoEmEdicao(medico);
    setValue('nome', medico.nome);
    setValue('crm', medico.crm);
    setValue('especialidadeIds', medico.Especialidades.map(e => e.id));
  };
  
  const handleCancelEdit = () => {
      setMedicoEmEdicao(null);
      resetEdit();
  }

  const onUpdateMedicoSubmit = async (data) => {
    try {
      await api.put(`/medicos/${medicoEmEdicao.id}`, data);
      alert('Médico atualizado com sucesso!');
      handleCancelEdit();
      fetchMedicos();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar médico.');
    }
  };

  const onRecepcionistaSubmit = async (data) => {
    try {
      await api.post('/auth/cadastrar', { ...data, perfil: 'recepcionista' });
      alert('Recepcionista cadastrado com sucesso!');
      resetRecepcionista();
    } catch (error) {
        alert(error.response?.data?.message || 'Erro ao cadastrar recepcionista.');
    }
  };

  const onMedicoSubmit = async (data) => {
    try {
      await api.post('/medicos', data);
      alert('Médico cadastrado com sucesso!');
      resetMedico();
      fetchMedicos();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cadastrar médico.');
    }
  };

  return (
    <div>
      {medicoEmEdicao && (
        <div className="card p-3 mb-4 bg-light shadow-sm">
          <h5 className="mb-3">Editando Médico: <strong>{medicoEmEdicao.nome}</strong></h5>
          <form onSubmit={handleSubmitEdit(onUpdateMedicoSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor='edit-nome' className="form-label">Nome</label>
                <input id='edit-nome' className="form-control" {...registerEdit('nome')} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor='edit-crm' className="form-label">CRM</label>
                <input id='edit-crm' className="form-control" {...registerEdit('crm')} />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor='edit-especialidades' className="form-label">Especialidades</label>
              <select multiple id='edit-especialidades' className="form-select" style={{height: '150px'}} {...registerEdit('especialidadeIds')}>
                {especialidades.map(e => (<option key={e.id} value={e.id}>{e.nome}</option>))}
              </select>
              <small className="form-text text-muted">Segure Ctrl (ou Cmd no Mac) para selecionar mais de uma.</small>
            </div>
            <button type="submit" className="btn btn-success me-2">Salvar Alterações</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancelar</button>
          </form>
        </div>
      )}
      <div className="mb-4">
        <h5>Médicos Cadastrados</h5>
        <table className="table table-striped table-hover">
          <thead>
            <tr><th>Nome</th><th>CRM</th><th>Especialidades</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {medicos.map(medico => (
              <tr key={medico.id}>
                <td>{medico.nome}</td>
                <td>{medico.crm}</td>
                <td>{medico.Especialidades.map(e => e.nome).join(', ')}</td>
                <td><button className="btn btn-sm btn-warning" onClick={() => handleEdit(medico)}>Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card p-3 h-100">
            <h5>Cadastrar Novo Médico</h5>
            <form onSubmit={handleSubmitMedico(onMedicoSubmit)} className="d-flex flex-column h-100">
              <div className="mb-2"><input className="form-control" {...registerMedico('nome', { required: true })} placeholder="Nome Completo" /></div>
              <div className="mb-2"><input className="form-control" {...registerMedico('crm', { required: true })} placeholder="CRM" /></div>
              <div className="mb-2"><input className="form-control" {...registerMedico('login', { required: true })} placeholder="Login de acesso" /></div>
              <div className="mb-2"><input className="form-control" type="password" {...registerMedico('senha', { required: true })} placeholder="Senha de acesso" /></div>
              <button type="submit" className="btn btn-success w-100 mt-auto">Cadastrar Médico</button>
            </form>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card p-3 h-100">
            <h5>Cadastrar Recepcionista</h5>
            <form onSubmit={handleSubmitRecepcionista(onRecepcionistaSubmit)} className="d-flex flex-column h-100">
              <div className="mb-2"><input className="form-control" {...registerRecepcionista('nome', { required: true })} placeholder="Nome Completo" /></div>
              <div className="mb-2"><input className="form-control" {...registerRecepcionista('login', { required: true })} placeholder="Login" /></div>
              <div className="mb-2"><input className="form-control" type="password" {...registerRecepcionista('senha', { required: true })} placeholder="Senha" /></div>
              <button type="submit" className="btn btn-primary w-100 mt-auto">Cadastrar Recepcionista</button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GerenciarUsuarios;