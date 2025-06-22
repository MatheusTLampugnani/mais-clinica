import { Outlet, useNavigate, Link } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const nome = localStorage.getItem("nome");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src="./src/assets/logo_mais_clinica.png" alt="Mais Clínica Logo" style={{ height: '70px' }} />
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {token ? (
                  <>
                    <li className="nav-item">
                      <span className="navbar-text me-3">Olá, {nome}</span>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-danger" onClick={handleLogout}>
                        Sair
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="btn btn-light" to="/login">
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