import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material'
import axios from '../service/api'; // Caminho relativo correto

const CadastroPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/auth/cadastrar', data)
      setSuccess('Cadastro realizado com sucesso!')
      setError('')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar')
      setSuccess('')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h5" align="center">
        Cadastro de Usuário
      </Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      
      <TextField
        label="Nome Completo"
        variant="outlined"
        fullWidth
        {...register('nome', { required: 'Nome é obrigatório' })}
        error={!!errors.nome}
        helperText={errors.nome?.message}
      />
      
      <TextField
        label="Usuário"
        variant="outlined"
        fullWidth
        {...register('login', { required: 'Usuário é obrigatório' })}
        error={!!errors.login}
        helperText={errors.login?.message}
      />
      
      <TextField
        label="Senha"
        type="password"
        variant="outlined"
        fullWidth
        {...register('senha', { 
          required: 'Senha é obrigatória',
          minLength: {
            value: 6,
            message: 'Senha deve ter pelo menos 6 caracteres'
          }
        })}
        error={!!errors.senha}
        helperText={errors.senha?.message}
      />
      
      <FormControl fullWidth>
        <InputLabel id="perfil-label">Perfil</InputLabel>
        <Select
          labelId="perfil-label"
          label="Perfil"
          defaultValue="recepcionista"
          {...register('perfil', { required: 'Perfil é obrigatório' })}
          error={!!errors.perfil}
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="medico">Médico</MenuItem>
          <MenuItem value="recepcionista">Recepcionista</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
      >
        Cadastrar
      </Button>
    </Box>
  )
}

export default CadastroPage