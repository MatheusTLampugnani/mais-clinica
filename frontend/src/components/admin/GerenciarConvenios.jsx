import React, { useState, useEffect } from 'react';
import api from '../../service/api';

const GerenciarConvenios = () => {
    const [convenios, setConvenios] = useState([]);
    const [convenioEmEdicao, setConvenioEmEdicao] = useState(null);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const fetchConvenios = async () => {
        try {
            const response = await api.get('/convenios');
            setConvenios(response.data.convenios || []);
        } catch (err) {
            setFeedback({ type: 'danger', message: 'Erro ao carregar convênios.' });
        }
    };

    useEffect(() => {
        fetchConvenios();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });
        const { id, nome, tabelaPrecos } = convenioEmEdicao;
        
        try {
            if (id) {
                await api.put(`/convenios/${id}`, { nome, tabelaPrecos });
                setFeedback({ type: 'success', message: 'Convênio atualizado com sucesso!' });
            } else {
                await api.post('/convenios', { nome, tabelaPrecos });
                setFeedback({ type: 'success', message: 'Convênio criado com sucesso!' });
            }
            setConvenioEmEdicao(null);
            fetchConvenios();
        } catch (err) {
            setFeedback({ type: 'danger', message: err.response?.data?.message || 'Erro ao salvar convênio.' });
        }
    };

    const handleEdit = (convenio) => {
        setFeedback({ type: '', message: '' });
        setConvenioEmEdicao({ ...convenio });
    };
    
    const handleAddNew = () => {
        setFeedback({ type: '', message: '' });
        setConvenioEmEdicao({ id: null, nome: '', tabelaPrecos: '' });
    };

    if (convenioEmEdicao) {
        return (
            <div className="card p-4 shadow-sm">
                <h5 className="mb-3">{convenioEmEdicao.id ? 'Editar Convênio' : 'Adicionar Novo Convênio'}</h5>
                <form onSubmit={handleSave}>
                    <div className="form-floating mb-3">
                        <input 
                            id="nome-convenio" 
                            type="text" 
                            className="form-control" 
                            value={convenioEmEdicao.nome} 
                            onChange={e => setConvenioEmEdicao({...convenioEmEdicao, nome: e.target.value})} 
                            required
                            placeholder="Nome do Convênio" 
                        />
                        <label htmlFor="nome-convenio">Nome do Convênio</label>
                    </div>
                    <div className="form-floating mb-3">
                        <textarea 
                            id="tabelaPrecos" 
                            className="form-control" 
                            value={convenioEmEdicao.tabelaPrecos || ''} 
                            onChange={e => setConvenioEmEdicao({...convenioEmEdicao, tabelaPrecos: e.target.value})}
                            placeholder="Tabela de Preços / Informações" 
                            style={{height: '100px'}}
                        ></textarea>
                        <label htmlFor="tabelaPrecos">Tabela de Preços / Informações</label>
                    </div>
                    <button type="submit" className="btn btn-success me-2">Salvar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setConvenioEmEdicao(null)}>Cancelar</button>
                </form>
            </div>
        );
    }
    return (
        <div className="card p-4 shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Convênios Cadastrados</h5>
                <button className="btn btn-primary" onClick={handleAddNew}>Adicionar Novo</button>
            </div>
            {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Tabela de Preços / Infos</th>
                            <th className="text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {convenios.length > 0 ? (
                            convenios.map(c => (
                                <tr key={c.id}>
                                    <td>{c.nome}</td>
                                    <td>{c.tabelaPrecos}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(c)}>Editar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center text-muted">Nenhum convênio cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GerenciarConvenios;