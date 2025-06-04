import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, MenuItem, Alert } from '@mui/material';
import axios from '../service/api';

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
    // Carrega pacientes e médicos
    const fetchData = async () => {
      try {
        const [pacientesRes, medicosRes] = await Promise.all([
          axios.get('/pacientes'),
          axios.get('/medicos')
        ]);
        setPacientes(pacientesRes.data);
        setMedicos(medicosRes.data);
      } catch (err) {
        setError('Erro ao carregar dados');
      }
    };
    fetchData();
  }, []);

  const handleAgendamento = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/consultas', {
        pacienteId: agendamento.pacienteId,
        medicoId: agendamento.medicoId,
        dataHora: `${agendamento.data}T${agendamento.hora}:00`
      });
      setSuccess('Consulta agendada com sucesso!');
      setAgendamento({
        pacienteId: '',
        medicoId: '',
        data: '',
        hora: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao agendar consulta');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Painel do Recepcionista
        </Typography>
        
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Agendamento de Consulta
        </Typography>
        
        <Box component="form" onSubmit={handleAgendamento} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            select
            label="Paciente"
            value={agendamento.pacienteId}
            onChange={(e) => setAgendamento({...agendamento, pacienteId: e.target.value})}
            required
          >
            {pacientes.map((paciente) => (
              <MenuItem key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Médico"
            value={agendamento.medicoId}
            onChange={(e) => setAgendamento({...agendamento, medicoId: e.target.value})}
            required
          >
            {medicos.map((medico) => (
              <MenuItem key={medico.id} value={medico.id}>
                {medico.nome} - {medico.especialidade}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Data"
            type="date"
            value={agendamento.data}
            onChange={(e) => setAgendamento({...agendamento, data: e.target.value})}
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="Hora"
            type="time"
            value={agendamento.hora}
            onChange={(e) => setAgendamento({...agendamento, hora: e.target.value})}
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
            Agendar Consulta
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecepcionistaPage;