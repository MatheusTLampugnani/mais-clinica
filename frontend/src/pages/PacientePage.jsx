import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Divider, Chip, Alert, Button } from '@mui/material';
import axios from '../service/api';

const PacientePage = () => {
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState('');
  const [showHistoric, setShowHistoric] = useState(true);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await axios.get('/paciente/consultas');
        setConsultas(response.data);
      } catch (err) {
        setError('Erro ao carregar consultas');
      }
    };
    fetchConsultas();
  }, []);

  const historicoConsultas = consultas.filter(consulta => 
    new Date(consulta.dataHora) < new Date()
  );

  const proximasConsultas = consultas.filter(consulta => 
    new Date(consulta.dataHora) >= new Date()
  );

  const handleCancelConsulta = async (consultaId) => {
    try {
      await axios.delete(`/consultas/${consultaId}`);
      setConsultas(consultas.filter(c => c.id !== consultaId));
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cancelar consulta');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Área do Paciente
        </Typography>
        
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {showHistoric ? 'Histórico de Consultas' : 'Próximas Consultas'}
            </Typography>
            <Button onClick={() => setShowHistoric(!showHistoric)}>
              {showHistoric ? 'Ver Próximas Consultas' : 'Ver Histórico'}
            </Button>
          </Box>
          
          {showHistoric ? (
            historicoConsultas.length > 0 ? (
              historicoConsultas.map((consulta) => (
                <Box key={consulta.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString()}</Typography>
                  <Typography><strong>Médico:</strong> {consulta.medico.nome} ({consulta.medico.especialidade})</Typography>
                  {consulta.prontuario && (
                    <>
                      <Typography><strong>Diagnóstico:</strong> {consulta.prontuario.diagnostico}</Typography>
                      <Typography><strong>Prescrição:</strong> {consulta.prontuario.prescricao}</Typography>
                    </>
                  )}
                </Box>
              ))
            ) : (
              <Typography>Nenhuma consulta no histórico</Typography>
            )
          ) : (
            proximasConsultas.length > 0 ? (
              proximasConsultas.map((consulta) => (
                <Box key={consulta.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleString()}</Typography>
                  <Typography><strong>Médico:</strong> {consulta.medico.nome} ({consulta.medico.especialidade})</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Lembrete: Comparecer 15 minutos antes do horário
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => handleCancelConsulta(consulta.id)}
                  >
                    Cancelar Consulta
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>Nenhuma consulta agendada</Typography>
            )
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PacientePage;