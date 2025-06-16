import React, { useState, useEffect } from 'react';
import api from '../service/api';

const MedicoPage = () => {
  const [consultas, setConsultas] = useState([]);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [prontuario, setProntuario] = useState({ historico: '', diagnostico: '', prescricao: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConsultas = async () => {
      const medicoId = localStorage.getItem('id');
      try {
        const response = await api.get(`/consultas/medico/${medicoId}`);
        setConsultas(response.data.consultas);
      } catch (err) {
        setError('Erro ao carregar consultas');
      }
    };
    fetchConsultas();
  }, []);

  const handleSelectConsulta = (consulta) => {
    setConsultaSelecionada(consulta);
    // Busca o prontuário existente ou inicializa um novo
    if (consulta.Prontuario) {
      setProntuario(consulta.Prontuario);
    } else {
      setProntuario({ historico: '', diagnostico: '', prescricao: '' });
    }
  };

  const handleSaveProntuario = async () => {
    setError('');
    setSuccess('');
    try {
      await api.post(`/prontuarios/consulta/${consultaSelecionada.id}`, prontuario);
      setSuccess('Prontuário salvo com sucesso!');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar prontuário');
    }
  };
  
  const handleChange = (e) => {
      setProntuario({...prontuario, [e.target.name]: e.target.value});
  }

  return (
    <div className="card border-success">
      <h4 className="card-header text-white bg-success text-center">Painel do Médico</h4>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="row">
          <div className="col-md-5">
            <h5 className="mb-3">Consultas Agendadas</h5>
            <div className="list-group" style={{maxHeight: '500px', overflowY: 'auto'}}>
              {consultas.map((consulta) => (
                <button
                  key={consulta.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${consultaSelecionada?.id === consulta.id ? 'active' : ''}`}
                  onClick={() => handleSelectConsulta(consulta)}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{consulta.Paciente.nome}</h6>
                    <small>{new Date(consulta.dataHora).toLocaleDateString()}</small>
                  </div>
                  <p className="mb-1">{new Date(consulta.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-7">
            {consultaSelecionada ? (
              <div className="card p-3">
                <h5 className="mb-3">Prontuário - {consultaSelecionada.Paciente.nome}</h5>
                 <div className="mb-3">
                    <label htmlFor="historico" className="form-label">Histórico Médico</label>
                    <textarea id="historico" name="historico" className="form-control" rows="4" value={prontuario.historico} onChange={handleChange}></textarea>
                </div>
                 <div className="mb-3">
                    <label htmlFor="diagnostico" className="form-label">Diagnóstico</label>
                    <textarea id="diagnostico" name="diagnostico" className="form-control" rows="3" value={prontuario.diagnostico} onChange={handleChange}></textarea>
                </div>
                 <div className="mb-3">
                    <label htmlFor="prescricao" className="form-label">Prescrição</label>
                    <textarea id="prescricao" name="prescricao" className="form-control" rows="3" value={prontuario.prescricao} onChange={handleChange}></textarea>
                </div>
                <button className="btn btn-success" onClick={handleSaveProntuario}>
                  Salvar Registro
                </button>
              </div>
            ) : (
              <div className="text-center p-5 border rounded bg-light">
                <p className="text-muted">Selecione uma consulta para visualizar ou editar o prontuário.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicoPage;