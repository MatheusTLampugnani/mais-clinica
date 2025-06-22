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
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const fetchMedicos = async () => {
        try {
            const response = await api.get('/medicos');
            setMedicos(response.data.medicos);
        } catch (error) {
            setFeedback({ type: 'danger', message: 'Erro ao buscar médicos.' });
        }
    };
    
    const fetchEspecialidades = async () => {
        try {
            const response = await api.get('/especialidades');
            setEspecialidades(response.data.especialidades);
        } catch (error) {
            setFeedback({ type: 'danger', message: 'Erro ao buscar especialidades.' });
        }
    };

    useEffect(() => {
        fetchMedicos();
        fetchEspecialidades();
    }, []);

    const handleEdit = (medico) => {
        setFeedback({ type: '', message: '' });
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
        setFeedback({ type: '', message: '' });
        try {
            await api.put(`/medicos/${medicoEmEdicao.id}`, data);
            setFeedback({ type: 'success', message: 'Médico atualizado com sucesso!' });
            handleCancelEdit();
            fetchMedicos();
        } catch (error) {
            setFeedback({ type: 'danger', message: error.response?.data?.message || 'Erro ao atualizar médico.' });
        }
    };

    const onRecepcionistaSubmit = async (data) => {
        setFeedback({ type: '', message: '' });
        try {
            await api.post('/auth/cadastrar', { ...data, perfil: 'recepcionista' });
            setFeedback({ type: 'success', message: 'Recepcionista cadastrado com sucesso!' });
            resetRecepcionista();
        } catch (error) {
            setFeedback({ type: 'danger', message: error.response?.data?.message || 'Erro ao cadastrar recepcionista.' });
        }
    };

    const onMedicoSubmit = async (data) => {
        setFeedback({ type: '', message: '' });
        try {
            await api.post('/medicos', data);
            setFeedback({ type: 'success', message: 'Médico cadastrado com sucesso!' });
            resetMedico();
            fetchMedicos();
        } catch (error) {
            setFeedback({ type: 'danger', message: error.response?.data?.message || 'Erro ao cadastrar médico.' });
        }
    };

    return (
        <div className="p-3">
            {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
            {medicoEmEdicao && (
                <div className="card p-4 mb-4 bg-light shadow-sm">
                    <h5 className="mb-3">Editando Médico: <strong>{medicoEmEdicao.nome}</strong></h5>
                    <form onSubmit={handleSubmitEdit(onUpdateMedicoSubmit)}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input id='edit-nome' className="form-control" {...registerEdit('nome')} placeholder="Nome"/>
                                    <label htmlFor='edit-nome'>Nome</label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input id='edit-crm' className="form-control" {...registerEdit('crm')} placeholder="CRM"/>
                                    <label htmlFor='edit-crm'>CRM</label>
                                </div>
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
            <div className="card shadow-sm p-4 mb-4">
                <h5>Médicos Cadastrados</h5>
                <div className="table-responsive">
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
            </div>
            <div className="row">
                <div className="col-lg-6 mb-4 mb-lg-0">
                    <div className="card shadow-sm p-4 h-100">
                        <h5 className="mb-3 text-center">Cadastrar Novo Médico</h5>
                        <form onSubmit={handleSubmitMedico(onMedicoSubmit)} className="d-flex flex-column h-100">
                            <div className="form-floating mb-3"><input className="form-control" {...registerMedico('nome', { required: true })} placeholder="Nome Completo" /> <label>Nome Completo</label></div>
                            <div className="form-floating mb-3"><input className="form-control" {...registerMedico('crm', { required: true })} placeholder="CRM" /><label>CRM</label></div>
                            <div className="form-floating mb-3"><input className="form-control" {...registerMedico('login', { required: true })} placeholder="Login de acesso" /><label>Login de acesso</label></div>
                            <div className="form-floating mb-3"><input className="form-control" type="password" {...registerMedico('senha', { required: true })} placeholder="Senha de acesso" /><label>Senha de acesso</label></div>
                            <button type="submit" className="btn btn-success w-100 mt-auto">Cadastrar Médico</button>
                        </form>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow-sm p-4 h-100">
                        <h5 className="mb-3 text-center">Cadastrar Recepcionista</h5>
                        <form onSubmit={handleSubmitRecepcionista(onRecepcionistaSubmit)} className="d-flex flex-column h-100">
                            <div className="form-floating mb-3"><input className="form-control" {...registerRecepcionista('nome', { required: true })} placeholder="Nome Completo" /><label>Nome Completo</label></div>
                            <div className="form-floating mb-3"><input className="form-control" {...registerRecepcionista('login', { required: true })} placeholder="Login" /><label>Login</label></div>
                            <div className="form-floating mb-3"><input className="form-control" type="password" {...registerRecepcionista('senha', { required: true })} placeholder="Senha" /><label>Senha</label></div>
                            <button type="submit" className="btn btn-primary w-100 mt-auto">Cadastrar Recepcionista</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GerenciarUsuarios;