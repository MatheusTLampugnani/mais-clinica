import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import axios from '../service/api';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/auth/login', data)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('perfil', response.data.perfil)
      localStorage.setItem('nome', response.data.nome)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login')
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
        Login da Clínica
      </Typography>
      
      {error && <Alert severity="error">{error}</Alert>}
      
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
        {...register('senha', { required: 'Senha é obrigatória' })}
        error={!!errors.senha}
        helperText={errors.senha?.message}
      />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
      >
        Entrar
      </Button>
    </Box>
  )
}

export default LoginPage