import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const perfil = localStorage.getItem('perfil');
    
    if (token && perfil) {
      setIsLoggedIn(true);
      
      setTimeout(() => {
        switch (perfil) {
          case 'recepcionista':
            navigate('/recepcionista');
            break;
          case 'medico':
            navigate('/medico');
            break;
          case 'paciente':
            navigate('/paciente');
            break;
          default:
            localStorage.clear();
            navigate('/login');
        }
      }, 500);

    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  if (isLoggedIn) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecionando para o seu painel...</p>
      </div>
    );
  }

  return (
    <div className="p-5 mb-4 bg-light rounded-3 shadow-sm text-center">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold">Bem-vindo à Mais Clínica</h1>
        <p className="fs-4">
          Sua solução completa para gestão de consultas e prontuários.
        </p>
        <p>Faça o login para acessar seu painel.</p>
        <Link className="btn btn-primary btn-lg mt-3" to="/login">
          Ir para o Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;