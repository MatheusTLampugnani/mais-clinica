import React, { useState, useEffect } from 'react';
import api from '../service/api';
import CadastrarPaciente from '../components/recepcionista/CadastrarPaciente';

const RecepcionistaPage = () => {
  const [activeTab, setActiveTab] = useState('agendamento');
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
  const [feedback, setFeedback] = useState({ type: '', message: '' });

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
      setFeedback({type: 'danger', message: 'Erro ao carregar dados da página.'});
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAgendamento = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    try {
      await api.post('/consultas', {
        pacienteId: agendamento.pacienteId,
        medicoId: agendamento.medicoId,
        convenioId: agendamento.convenioId,
        dataHora: `${agendamento.data}T${agendamento.hora}:00`
      });
      setFeedback({ type: 'success', message: 'Consulta agendada com sucesso!' });
      setAgendamento({ pacienteId: '', medicoId: '', convenioId: '', data: '', hora: '' });
      fetchData();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Erro ao agendar consulta' });
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgendamento(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="card shadow-sm border-info">
      <h4 className="card-header text-white text-center bg-info">Painel da Recepcionista</h4>
      <div className="card-body">
        <ul className="nav nav-tabs nav-fill mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'agendamento' ? 'active' : ''}`} onClick={() => setActiveTab('agendamento')}>Agendamento e Fila</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'cadastro' ? 'active' : ''}`} onClick={() => setActiveTab('cadastro')}>Cadastrar Paciente</button>
          </li>
        </ul>
        {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
        {activeTab === 'agendamento' && (
          <div className="row">
            <div className="col-md-7">
              <div className="card p-4 shadow-sm">
                <h5 className="card-title text-center mb-4">Agendar Nova Consulta</h5>
                <form onSubmit={handleAgendamento}>
                  {/* Formulário de agendamento aqui */}
                  <div className="mb-3">
                    <label htmlFor="pacienteId" className="form-label">Paciente</label>
                    <select id="pacienteId" name="pacienteId" className="form-select" value={agendamento.pacienteId} onChange={handleChange} required>
                      <option value="" disabled>Selecione um paciente</option>
                      {pacientes.map((paciente) => (<option key={paciente.id} value={paciente.id}>{paciente.nome}</option>))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="medicoId" className="form-label">Médico</label>
                    <select id="medicoId" name="medicoId" className="form-select" value={agendamento.medicoId} onChange={handleChange} required>
                      <option value="" disabled>Selecione um médico</option>
                      {medicos.map((medico) => (<option key={medico.id} value={medico.id}>{medico.nome}</option>))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="convenioId" className="form-label">Convênio (Opcional)</label>
                    <select id="convenioId" name="convenioId" className="form-select" value={agendamento.convenioId} onChange={handleChange}>
                      <option value="">Nenhum</option>
                      {convenios.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="data" className="form-label">Data</label>
                      <input id="data" name="data" type="date" className="form-control" value={agendamento.data} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="hora" className="form-label">Hora</label>
                      <input id="hora" name="hora" type="time" className="form-control" value={agendamento.hora} onChange={handleChange} required />
                    </div>
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
                  )) : <p className="text-muted text-center mt-3">Nenhuma consulta na fila para hoje.</p>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cadastro' && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <CadastrarPaciente onPatientRegistered={fetchData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecepcionistaPage;