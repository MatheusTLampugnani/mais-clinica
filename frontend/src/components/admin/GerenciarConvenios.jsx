import React, { useState, useEffect } from 'react';
import api from '../../service/api';

const GerenciarConvenios = () => {
  const [convenios, setConvenios] = useState([]);
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchConvenios = async () => {
    try {
      const response = await api.get('/convenios');
      setConvenios(response.data.convenios);
    } catch (err) {
      setError('Erro ao carregar convênios.');
    }
  };

  useEffect(() => {
    fetchConvenios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/convenios', { nome });
      setSuccess('Convênio criado com sucesso!');
      setNome('');
      fetchConvenios();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar convênio.');
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
        <h5>Novo Convênio</h5>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nome do convênio"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Adicionar</button>
        </div>
      </form>

      <h5>Convênios Existentes</h5>
      <ul className="list-group">
        {convenios.map(c => (
          <li key={c.id} className="list-group-item">{c.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default GerenciarConvenios;