import React, { useState, useEffect } from 'react';
import api from '../../service/api';

const GerenciarEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const fetchEspecialidades = async () => {
        try {
            const response = await api.get('/especialidades');
            setEspecialidades(response.data.especialidades || []);
        } catch (err) {
            setFeedback({ type: 'danger', message: 'Erro ao carregar especialidades.' });
        }
    };

    useEffect(() => {
        fetchEspecialidades();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: '', message: '' });
        try {
            await api.post('/especialidades', { nome });
            setFeedback({ type: 'success', message: 'Especialidade criada com sucesso!' });
            setNome('');
            fetchEspecialidades();
        } catch (err) {
            setFeedback({ type: 'danger', message: err.response?.data?.message || 'Erro ao criar especialidade.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 shadow-sm h-100">
            <h5 className="mb-3 text-center">Gerenciar Especialidades</h5>
            {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
            
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="nova-especialidade"
                        placeholder="Nome da nova especialidade"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <label htmlFor="nova-especialidade">Nova Especialidade</label>
                </div>
                <div className="d-grid mt-2">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Adicionar'}
                    </button>
                </div>
            </form>

            <h6>Especialidades Existentes</h6>
            <div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {especialidades.length > 0 ? (
                    especialidades.map(e => (
                        <li key={e.id} className="list-group-item">{e.nome}</li>
                    ))
                ) : (
                    <p className="text-muted small">Nenhuma especialidade cadastrada.</p>
                )}
            </div>
        </div>
    );
};

export default GerenciarEspecialidades;