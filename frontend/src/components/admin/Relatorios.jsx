import React, { useState } from 'react';
import api from '../../service/api';

const Relatorios = () => {
  const [relatorio, setRelatorio] = useState(null);
  const [datas, setDatas] = useState({ dataInicio: '', dataFim: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleGerarRelatorio = async () => {
    if (!datas.dataInicio || !datas.dataFim) {
      setFeedback({ type: 'warning', message: 'Por favor, selecione a data de início e a data de fim.' });
      return;
    }
    setLoading(true);
    setFeedback({ type: '', message: '' }); // Limpa feedback anterior
    try {
      const response = await api.get('/relatorios/consultas', { params: datas });
      setRelatorio(response.data.relatorio);
    } catch (error) {
      setFeedback({ type: 'danger', message: error.response?.data?.message || 'Erro ao gerar relatório.' });
      setRelatorio([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setDatas({ ...datas, [e.target.name]: e.target.value });

  return (
    <div className="p-3">
      <h5 className="mb-3">Consultas Realizadas por Médico</h5>
      {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
      <div className="row g-3 align-items-center mb-4 p-3 border rounded bg-white">
        <div className="col-md-5">
          <div className="form-floating">
            <input type="date" name="dataInicio" className="form-control" id="dataInicio" onChange={handleChange} />
            <label htmlFor="dataInicio">Data de Início</label>
          </div>
        </div>
        <div className="col-md-5">
          <div className="form-floating">
            <input type="date" name="dataFim" className="form-control" id="dataFim" onChange={handleChange} />
            <label htmlFor="dataFim">Data de Fim</label>
          </div>
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-secondary btn-lg" onClick={handleGerarRelatorio} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Gerar'}
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nome do Médico</th>
              <th>Total de Consultas</th>
            </tr>
          </thead>
          <tbody>
            {relatorio && relatorio.length > 0 ? (
              relatorio.map((item, index) => (
                <tr key={index}>
                  <td>{item['Medico.nome']}</td>
                  <td>{item.total_consultas}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-muted p-4">
                  {relatorio === null ? 'Selecione um período para gerar o relatório.' : 'Nenhum resultado encontrado para o período selecionado.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Relatorios;