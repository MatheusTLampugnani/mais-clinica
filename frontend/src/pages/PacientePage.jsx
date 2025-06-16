import React, { useState, useEffect } from 'react';
import api from '../service/api';

const PacientePage = () => {
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState('');

  const fetchConsultas = async () => {
    const pacienteId = localStorage.getItem('id');
    try {
      const response = await api.get(`/consultas/paciente/${pacienteId}`);
      setConsultas(response.data.consultas);
    } catch (err) {
      setError('Erro ao carregar consultas');
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleCancelConsulta = async (consultaId) => {
    if (window.confirm("Tem certeza que deseja cancelar esta consulta?")) {
      try {
        await api.delete(`/consultas/${consultaId}`);
        fetchConsultas(); // Recarrega a lista de consultas
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao cancelar consulta');
      }
    }
  };

  const agora = new Date();
  const historicoConsultas = consultas.filter(c => new Date(c.dataHora) < agora);
  const proximasConsultas = consultas.filter(c => new Date(c.dataHora) >= agora);

  return (
    <div className="card" style={{borderColor: '#8a2be2'}}>
      <h4 className="card-header text-white text-center" style={{ backgroundColor: '#8a2be2' }}>Área do Paciente</h4>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <h5 className="mb-3">Próximas Consultas</h5>
        {proximasConsultas.length > 0 ? (
          proximasConsultas.map((consulta) => (
            <div key={consulta.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <p><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString('pt-BR')}</p>
                <p><strong>Médico:</strong> {consulta.Medico.nome}</p>
                <p className="text-muted small">Lembrete: Comparecer 15 minutos antes do horário.</p>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelConsulta(consulta.id)}>
                  Cancelar Consulta
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Nenhuma consulta agendada.</p>
        )}

        <hr className="my-4"/>

        <h5 className="mb-3">Histórico de Consultas</h5>
        {historicoConsultas.length > 0 ? (
          historicoConsultas.map((consulta) => (
            <div key={consulta.id} className="card bg-light mb-3">
               <div className="card-body">
                <p><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString('pt-BR')}</p>
                <p><strong>Médico:</strong> {consulta.Medico.nome}</p>
                 {consulta.Prontuario && (
                    <>
                      <p><strong>Diagnóstico:</strong> {consulta.Prontuario.diagnostico}</p>
                      <p><strong>Prescrição:</strong> {consulta.Prontuario.prescricao}</p>
                    </>
                  )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Nenhuma consulta no histórico.</p>
        )}
      </div>
    </div>
  );
};

export default PacientePage;