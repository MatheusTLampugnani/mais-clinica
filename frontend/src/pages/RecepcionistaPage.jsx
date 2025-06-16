import React, { useState, useEffect } from 'react';
import api from '../service/api';

const RecepcionistaPage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [agendamento, setAgendamento] = useState({
    pacienteId: '',
    medicoId: '',
    data: '',
    hora: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pacientesRes, medicosRes] = await Promise.all([
          api.get('/pacientes'),
          api.get('/medicos')
        ]);
        setPacientes(pacientesRes.data.pacientes);
        setMedicos(medicosRes.data.medicos);
      } catch (err) {
        setError('Erro ao carregar dados de pacientes e médicos.');
      }
    };
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
        dataHora: `${agendamento.data}T${agendamento.hora}:00`
      });
      setSuccess('Consulta agendada com sucesso!');
      setAgendamento({ pacienteId: '', medicoId: '', data: '', hora: '' }); // Limpa o formulário
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao agendar consulta');
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
    <div className="card border-info">
      <h4 className="card-header text-white bg-info text-center">Painel do Recepcionista</h4>
      <div className="card-body">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card p-4 shadow-sm">
              <h5 className="card-title text-center mb-4">Agendamento de Consulta</h5>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleAgendamento}>
                <div className="mb-3">
                  <label htmlFor="pacienteId" className="form-label">Paciente</label>
                  <select
                    id="pacienteId"
                    name="pacienteId"
                    className="form-select"
                    value={agendamento.pacienteId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>{paciente.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="medicoId" className="form-label">Médico</label>
                  <select
                    id="medicoId"
                    name="medicoId"
                    className="form-select"
                    value={agendamento.medicoId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Selecione um médico</option>
                    {medicos.map((medico) => (
                      <option key={medico.id} value={medico.id}>{medico.nome}</option>
                    ))}
                  </select>
                </div>
                
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="data" className="form-label">Data</label>
                        <input
                            id="data"
                            name="data"
                            type="date"
                            className="form-control"
                            value={agendamento.data}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                         <label htmlFor="hora" className="form-label">Hora</label>
                        <input
                            id="hora"
                            name="hora"
                            type="time"
                            className="form-control"
                            value={agendamento.hora}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-info btn-lg text-white">Agendar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecepcionistaPage;