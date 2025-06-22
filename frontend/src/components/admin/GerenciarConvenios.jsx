import React, { useState, useEffect } from 'react';
import api from '../../service/api';

const GerenciarConvenios = () => {
  const [convenios, setConvenios] = useState([]);
  const [convenioEmEdicao, setConvenioEmEdicao] = useState(null);
  const [error, setError] = useState('');

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

  const handleSave = async (e) => {
    e.preventDefault();
    const { id, nome, tabelaPrecos } = convenioEmEdicao;
    
    try {
      if (id) {
        await api.put(`/convenios/${id}`, { nome, tabelaPrecos });
      } else {
        await api.post('/convenios', { nome, tabelaPrecos });
      }
      setConvenioEmEdicao(null);
      fetchConvenios();
    } catch (err) {
      alert('Erro ao salvar convênio.');
    }
  };

  const handleEdit = (convenio) => {
    setConvenioEmEdicao({ ...convenio });
  };
  
  const handleAddNew = () => {
    setConvenioEmEdicao({ id: null, nome: '', tabelaPrecos: '' });
  };

  if (convenioEmEdicao) {
    return (
      <div>
        <h5 className="mb-3">{convenioEmEdicao.id ? 'Editar Convênio' : 'Adicionar Novo Convênio'}</h5>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input 
              id="nome"
              type="text" 
              className="form-control" 
              value={convenioEmEdicao.nome} 
              onChange={e => setConvenioEmEdicao({...convenioEmEdicao, nome: e.target.value})} 
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tabelaPrecos" className="form-label">Tabela de Preços / Informações</label>
            <textarea 
              id="tabelaPrecos"
              className="form-control" 
              rows="4" 
              value={convenioEmEdicao.tabelaPrecos} 
              onChange={e => setConvenioEmEdicao({...convenioEmEdicao, tabelaPrecos: e.target.value})}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success me-2">Salvar</button>
          <button type="button" className="btn btn-secondary" onClick={() => setConvenioEmEdicao(null)}>Cancelar</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary mb-3" onClick={handleAddNew}>Adicionar Novo Convênio</button>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tabela de Preços</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {convenios.map(c => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.tabelaPrecos}</td>
              <td>
                <button 
                  className="btn btn-sm btn-warning" 
                  onClick={() => handleEdit(c)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GerenciarConvenios;