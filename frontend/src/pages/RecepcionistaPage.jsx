import React, { useState, useEffect } from 'react';
import api from '../service/api';

const RecepcionistaPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [filaEspera, setFilaEspera] = useState([]);
  const [agendamento, setAgendamento] = useState({
    pacienteId: '',
    medicoId: '',
    convenioId: '',
    data: '',
    hora: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [pacientesRes, medicosRes, conveniosRes, filaRes] = await Promise.all([
        api.get('/pacientes'),
        api.get('/medicos'),
        api.get('/convenios'),
        api.get('/consultas/fila-espera')
      ]);
      setPacientes(pacientesRes.data.pacientes);
      setMedicos(medicosRes.data.medicos);
      setConvenios(conveniosRes.data.convenios);
      setFilaEspera(filaRes.data.fila);
    } catch (err) {
      setError('Erro ao carregar dados.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAgendamento = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/consultas', {
        pacienteId: agendamento.pacienteId,
        medicoId: agendamento.medicoId,
        convenioId: agendamento.convenioId,
        dataHora: `${agendamento.data}T${agendamento.hora}:00`
      });
      setSuccess('Consulta agendada com sucesso!');
      setAgendamento({ pacienteId: '', medicoId: '', convenioId: '', data: '', hora: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao agendar consulta');
    }
  };
  
  const handleChange = (e) => {
    setAgendamento({ ...agendamento, [e.target.name]: e.target.value });
  };

  return (
    <div className="card border-info">
      <h4 className="card-header text-white bg-info text-center">Painel do Recepcionista</h4>
      <div className="card-body">
        <div className="row">
          <div className="col-md-7">
             <div className="card p-4 shadow-sm">
              <h5 className="card-title text-center mb-4">Agendamento de Consulta</h5>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleAgendamento}>
                 <div className="mb-3">
                  <label htmlFor="convenioId" className="form-label">Convênio (Opcional)</label>
                  <select id="convenioId" name="convenioId" className="form-select" value={agendamento.convenioId} onChange={handleChange}>
                    <option value="">Nenhum</option>
                    {convenios.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
                  </select>
                </div>
                <div className="d-grid"><button type="submit" className="btn btn-info btn-lg text-white">Agendar</button></div>
              </form>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card p-3">
                <h5 className="text-center">Fila de Espera (Hoje)</h5>
                <ul className="list-group" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {filaEspera.length > 0 ? filaEspera.map(c => (
                        <li key={c.id} className="list-group-item">
                            <strong>{new Date(c.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong> - {c.Paciente.nome}
                            <br/>
                            <small className="text-muted">Dr(a). {c.Medico.nome}</small>
                        </li>
                    )) : <p className="text-muted text-center">Nenhuma consulta na fila.</p>}
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecepcionistaPage;