import React, { useState, useEffect } from 'react';
import api from '../service/api';

const MedicoPage = () => {
  const [consultas, setConsultas] = useState([]);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [prontuario, setProntuario] = useState({ historico: '', diagnostico: '', prescricao: '' });
  const [anexos, setAnexos] = useState([]);
  const [anexoFile, setAnexoFile] = useState(null);
  const [anexoDesc, setAnexoDesc] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const API_URL = 'http://localhost:3001';

  const fetchConsultas = async () => {
    const medicoId = localStorage.getItem('id');
    try {
      const response = await api.get(`/consultas/medico/${medicoId}`);
      setConsultas(response.data.consultas);
    } catch (err) {
      setError('Erro ao carregar consultas');
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleSelectConsulta = (consulta) => {
    setConsultaSelecionada(consulta);
    setProntuario(consulta.Prontuario || { historico: '', diagnostico: '', prescricao: '' });
    setAnexos(consulta.Prontuario?.AnexoExames || []);
  };

  const handleSaveProntuario = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await api.post(`/prontuarios/consulta/${consultaSelecionada.id}`, prontuario);
      setSuccess('Prontuário salvo com sucesso!');
      setConsultaSelecionada(prev => ({
          ...prev,
          Prontuario: response.data.prontuario
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar prontuário');
    }
  };
  
  const handleChange = (e) => {
    setProntuario({...prontuario, [e.target.name]: e.target.value});
  };

  const handleAnexoUpload = async (e) => {
    e.preventDefault();
    if (!anexoFile || !consultaSelecionada?.Prontuario) {
        alert('Selecione um arquivo e salve o prontuário primeiro.');
        return;
    }
    const formData = new FormData();
    formData.append('exame', anexoFile);
    formData.append('prontuarioId', consultaSelecionada.Prontuario.id);
    formData.append('descricao', anexoDesc);

    try {
        const response = await api.post('/anexos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAnexos([...anexos, response.data.anexo]);
        setAnexoFile(null);
        setAnexoDesc('');
        e.target.reset();
        alert('Anexo enviado com sucesso!');
    } catch (err) {
        alert(err.response?.data?.message || 'Erro ao enviar anexo.');
    }
  };

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
                <hr className="my-4" />
                <h5>Anexar Exames</h5>
                {consultaSelecionada.Prontuario?.id ? (
                  <form onSubmit={handleAnexoUpload} className="mb-3">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Descrição do exame" value={anexoDesc} onChange={e => setAnexoDesc(e.target.value)} required />
                      <input type="file" className="form-control" onChange={e => setAnexoFile(e.target.files[0])} required />
                      <button type="submit" className="btn btn-outline-secondary">Enviar</button>
                    </div>
                  </form>
                ) : (
                  <p className="text-muted small">Salve o prontuário ao menos uma vez para poder anexar exames.</p>
                )}
                <h6 className="mt-2">Exames Anexados</h6>
                {anexos.length > 0 ? (
                  <ul className="list-group">
                    {anexos.map(anexo => (
                      <li key={anexo.id} className="list-group-item">
                        <a href={`${API_URL}/${anexo.caminhoArquivo}`} target="_blank" rel="noopener noreferrer">
                          {anexo.descricao}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted small">Nenhum exame anexado.</p>}
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