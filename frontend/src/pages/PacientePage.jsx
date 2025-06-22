import React, { useState, useEffect } from 'react';
import api from '../service/api';

const PacientePage = () => {
  const [consultas, setConsultas] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const API_URL = 'http://localhost:3001';

  const fetchConsultas = async () => {
    const pacienteId = localStorage.getItem('id');
    try {
      const response = await api.get(`/consultas/paciente/${pacienteId}`);
      setConsultas(response.data.consultas);
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Erro ao carregar consultas.' });
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleCancelConsulta = async (consultaId) => {
    if (window.confirm("Tem certeza que deseja cancelar esta consulta?")) {
      try {
        await api.delete(`/consultas/${consultaId}`);
        setFeedback({ type: 'success', message: 'Consulta cancelada com sucesso!' });
        fetchConsultas(); // Recarrega a lista de consultas
      } catch (err) {
        setFeedback({ type: 'danger', message: err.response?.data?.message || 'Erro ao cancelar consulta' });
      }
    }
  };

  const agora = new Date();
  const historicoConsultas = consultas.filter(c => new Date(c.dataHora) < agora);
  const proximasConsultas = consultas.filter(c => new Date(c.dataHora) >= agora);

  return (
    <div className="card shadow-sm" style={{borderColor: '#8a2be2'}}>
      <h4 className="card-header text-white text-center" style={{ backgroundColor: '#8a2be2' }}>Área do Paciente</h4>
      <div className="card-body">
        {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
        <div className="accordion" id="accordionPaciente">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingProximas">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProximas" aria-expanded="true" aria-controls="collapseProximas">
                <strong>Próximas Consultas ({proximasConsultas.length})</strong>
              </button>
            </h2>
            <div id="collapseProximas" className="accordion-collapse collapse show" aria-labelledby="headingProximas">
              <div className="accordion-body">
                {proximasConsultas.length > 0 ? (
                  proximasConsultas.map((consulta) => (
                    <div key={consulta.id} className="card mb-3 shadow-sm">
                      <div className="card-body">
                        <p><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                        <p><strong>Médico:</strong> Dr(a). {consulta.Medico.nome}</p>
                        <p className="text-muted small">Lembrete: Comparecer 15 minutos antes do horário.</p>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelConsulta(consulta.id)}>
                          Cancelar Consulta
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center p-3">Nenhuma consulta agendada.</p>
                )}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingHistorico">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHistorico" aria-expanded="false" aria-controls="collapseHistorico">
                <strong>Histórico de Consultas ({historicoConsultas.length})</strong>
              </button>
            </h2>
            <div id="collapseHistorico" className="accordion-collapse collapse" aria-labelledby="headingHistorico">
              <div className="accordion-body">
                {historicoConsultas.length > 0 ? (
                  historicoConsultas.map((consulta) => (
                    <div key={consulta.id} className="card bg-light mb-3">
                       <div className="card-body">
                        <p><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                        <p><strong>Médico:</strong> Dr(a). {consulta.Medico.nome}</p>
                         {consulta.Prontuario ? (
                            <>
                              <hr />
                              <p className="mb-1"><strong>Diagnóstico:</strong> {consulta.Prontuario.diagnostico}</p>
                              <p className="mb-1"><strong>Prescrição:</strong> {consulta.Prontuario.prescricao}</p>
                              {consulta.Prontuario.AnexoExames?.length > 0 && (
                                <>
                                  <p className="mt-2 mb-1"><strong>Exames Anexados:</strong></p>
                                  <ul className="list-group list-group-flush">
                                    {consulta.Prontuario.AnexoExames.map(anexo => (
                                      <li key={anexo.id} className="list-group-item bg-light">
                                        <a href={`${API_URL}/${anexo.caminhoArquivo}`} target="_blank" rel="noopener noreferrer">
                                          {anexo.descricao}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </>
                          ) : (
                            <p className="text-muted small fst-italic">Prontuário ainda não preenchido para esta consulta.</p>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center p-3">Nenhuma consulta no histórico.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PacientePage;