import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Alert } from '@mui/material';
import axios from '../service/api';

const MedicoPage = () => {
  const [consultas, setConsultas] = useState([]);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [prontuario, setProntuario] = useState({
    historico: '',
    diagnostico: '',
    prescricao: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await axios.get('/medico/consultas');
        setConsultas(response.data);
      } catch (err) {
        setError('Erro ao carregar consultas');
      }
    };
    fetchConsultas();
  }, []);

  const handleSelectConsulta = (consulta) => {
    setConsultaSelecionada(consulta);
    setProntuario({
      historico: consulta.prontuario?.historico || '',
      diagnostico: consulta.prontuario?.diagnostico || '',
      prescricao: consulta.prontuario?.prescricao || ''
    });
  };

  const handleSaveProntuario = async () => {
    try {
      await axios.post(`/consultas/${consultaSelecionada.id}/prontuario`, prontuario);
      setSuccess('Prontuário salvo com sucesso!');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar prontuário');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Painel do Médico
        </Typography>
        
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: '40%' }}>
            <Typography variant="h6" gutterBottom>
              Consultas Agendadas
            </Typography>
            {consultas.map((consulta) => (
              <Paper 
                key={consulta.id} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  cursor: 'pointer',
                  backgroundColor: consultaSelecionada?.id === consulta.id ? '#f0f0f0' : 'inherit'
                }}
                onClick={() => handleSelectConsulta(consulta)}
              >
                <Typography><strong>Paciente:</strong> {consulta.paciente.nome}</Typography>
                <Typography><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString()}</Typography>
              </Paper>
            ))}
          </Box>

          <Box sx={{ width: '60%' }}>
            {consultaSelecionada ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Prontuário - {consultaSelecionada.paciente.nome}
                </Typography>
                
                <TextField
                  label="Histórico Médico"
                  value={prontuario.historico}
                  onChange={(e) => setProntuario({...prontuario, historico: e.target.value})}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Diagnóstico"
                  value={prontuario.diagnostico}
                  onChange={(e) => setProntuario({...prontuario, diagnostico: e.target.value})}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Prescrição"
                  value={prontuario.prescricao}
                  onChange={(e) => setProntuario({...prontuario, prescricao: e.target.value})}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                
                <Button 
                  variant="contained" 
                  onClick={handleSaveProntuario}
                  disabled={!consultaSelecionada}
                >
                  Salvar Registro
                </Button>
              </>
            ) : (
              <Typography>Selecione uma consulta para editar o prontuário</Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MedicoPage;