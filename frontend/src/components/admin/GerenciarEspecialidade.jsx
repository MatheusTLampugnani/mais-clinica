import React, { useState, useEffect } from 'react';
import api from '../../service/api';

const GerenciarEspecialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEspecialidades = async () => {
    try {
      const response = await api.get('/especialidades');
      setEspecialidades(response.data.especialidades);
    } catch (err) {
      setError('Erro ao carregar especialidades.');
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/especialidades', { nome });
      setSuccess('Especialidade criada com sucesso!');
      setNome('');
      fetchEspecialidades(); // Recarrega a lista
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar especialidade.');
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nova especialidade"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </div>
      </form>

      <ul className="list-group">
        {especialidades.map(e => (
          <li key={e.id} className="list-group-item">{e.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciarEspecialidades;