import React, { useState, useEffect } from 'react';
import api from '../service/api';

const MedicoPage = () => {
  const [consultas, setConsultas] = useState([]);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [prontuario, setProntuario] = useState({ historico: '', diagnostico: '', prescricao: '' });
  const [anexos, setAnexos] = useState([]);
  const [anexoFile, setAnexoFile] = useState(null);
  const [anexoDesc, setAnexoDesc] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const API_URL = 'http://localhost:3001';

  const fetchConsultas = async () => {
    const medicoId = localStorage.getItem('id');
    try {
      const response = await api.get(`/consultas/medico/${medicoId}`);
      setConsultas(response.data.consultas);
    } catch (err) {
      setFeedback({type: 'danger', message: 'Erro ao carregar consultas.'});
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleSelectConsulta = (consulta) => {
    setConsultaSelecionada(consulta);
    setProntuario(consulta.Prontuario || { historico: '', diagnostico: '', prescricao: '' });
    setAnexos(consulta.Prontuario?.AnexoExames || []);
    setFeedback({ type: '', message: '' }); // Limpa o feedback ao trocar de consulta
  };

  const handleSaveProntuario = async () => {
    setFeedback({ type: '', message: '' });
    try {
      const response = await api.post(`/prontuarios/consulta/${consultaSelecionada.id}`, prontuario);
      setFeedback({ type: 'success', message: 'Prontuário salvo com sucesso!'});
      // Atualiza o estado local para refletir que o prontuário foi salvo
      setConsultaSelecionada(prev => ({
          ...prev,
          Prontuario: response.data.prontuario
      }));
      // Atualiza a lista de consultas para refletir o novo prontuário
      fetchConsultas();
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Erro ao salvar prontuário'});
    }
  };
  
  const handleChange = (e) => {
    setProntuario({...prontuario, [e.target.name]: e.target.value});
  };

  const handleAnexoUpload = async (e) => {
    e.preventDefault();
    if (!anexoFile || !consultaSelecionada?.Prontuario) {
      setFeedback({type: 'warning', message: 'Selecione um arquivo e salve o prontuário primeiro.'});
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
      e.target.reset(); // Limpa o formulário de upload
      setFeedback({type: 'success', message: 'Anexo enviado com sucesso!'});
    } catch (err) {
      setFeedback({type: 'danger', message: err.response?.data?.message || 'Erro ao enviar anexo.'});
    }
  };

  return (
    <div className="card shadow-sm border-success">
      <h4 className="card-header text-white bg-success text-center">Painel do Médico</h4>
      <div className="card-body">
        {feedback.message && <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>}
        <div className="row">
          <div className="col-md-5">
            <h5 className="mb-3">Consultas Agendadas</h5>
            <div className="list-group" style={{maxHeight: '600px', overflowY: 'auto'}}>
              {consultas.length > 0 ? consultas.map((consulta) => (
                <button
                  key={consulta.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${consultaSelecionada?.id === consulta.id ? 'active' : ''}`}
                  onClick={() => handleSelectConsulta(consulta)}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{consulta.Paciente.nome}</h6>
                    <small>{new Date(consulta.dataHora).toLocaleDateString('pt-BR')}</small>
                  </div>
                  <p className="mb-1">{new Date(consulta.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </button>
              )) : <p className="text-muted">Nenhuma consulta agendada.</p>}
            </div>
          </div>
          <div className="col-md-7">
            {consultaSelecionada ? (
              <div className="card p-3 bg-light">
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
                <div className="d-grid">
                  <button className="btn btn-success" onClick={handleSaveProntuario}>
                    Salvar Registro
                  </button>
                </div>
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
                      <li key={anexo.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {anexo.descricao}
                        <a href={`${API_URL}/${anexo.caminhoArquivo}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                          Ver Anexo
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted small">Nenhum exame anexado.</p>}
              </div>
            ) : (
              <div className="text-center p-5 border rounded bg-light d-flex align-items-center justify-content-center" style={{minHeight: '400px'}}>
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