import { useEffect, useState } from 'react'
import { Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const perfil = localStorage.getItem('perfil')
    const nome = localStorage.getItem('nome')
    
    if (token && perfil && nome) {
      setUser({ perfil, nome })
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('perfil')
    localStorage.removeItem('nome')
    navigate('/login')
  }

  if (!user) return <div>Carregando...</div>

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo, {user.nome}!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Perfil: {user.perfil}
      </Typography>
      <Button 
        variant="contained" 
        color="error"
        onClick={handleLogout}
        sx={{ mt: 4 }}
      >
        Sair
      </Button>
    </Box>
  )
}

export default HomePage