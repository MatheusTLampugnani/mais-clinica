import { Outlet, useNavigate, Link } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const nome = localStorage.getItem("nome");
  const perfil = localStorage.getItem("perfil");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getDashboardLink = () => {
    switch (perfil) {
      case 'admin': return '/admin';
      case 'medico': return '/medico';
      case 'recepcionista': return '/recepcionista';
      case 'paciente': return '/paciente';
      default: return '/';
    }
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src="./src/assets/logo_mais_clinica.png" alt="Mais Clínica Logo" style={{ height: '40px', marginRight: '10px' }} />
              Mais Clínica
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                {token ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to={getDashboardLink()}>Meu Painel</Link>
                    </li>
                    <li className="nav-item">
                      <span className="navbar-text me-3">Olá, {nome}</span>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Sair
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="btn btn-outline-light" to="/login">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;