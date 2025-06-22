import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <div className="text-center p-5">
        <h1 className="display-5 fw-bold">Bem-vindo(a) de volta!</h1>
        <p className="fs-4">Você já está autenticado no sistema.</p>
        <p>Clique no botão abaixo para acessar o seu painel de controle.</p>
        <Link className="btn btn-primary btn-lg mt-3" to={localStorage.getItem('perfil') === 'admin' ? '/admin' : `/${localStorage.getItem('perfil')}`}>
          Ir para meu Painel
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 mb-4 bg-light rounded-3 shadow text-center">
      <div className="container-fluid py-5">
        <img src="./src/assets/logo_mais_clinica.png" alt="Mais Clínica Logo" style={{ maxWidth: '180px', marginBottom: '2rem' }} />
        <h1 className="display-5 fw-bold">Sua saúde, nossa prioridade.</h1>
        <p className="fs-4 col-md-8 mx-auto">
          Acesse o portal para gerenciar suas consultas, prontuários e agendamentos de forma simples e eficiente.
        </p>
        <Link className="btn btn-primary btn-lg mt-3" to="/login">
          Acessar o Sistema
        </Link>
      </div>
    </div>
  );
};

export default HomePage;