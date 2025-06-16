import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas da Aplicação
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import RecepcionistaPage from './pages/RecepcionistaPage';
import MedicoPage from './pages/MedicoPage';
import PacientePage from './pages/PacientePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="cadastro" element={<CadastroPage />} />

        <Route element={<ProtectedRoute allowedRoles={['recepcionista']} />}>
          <Route path="recepcionista" element={<RecepcionistaPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['medico']} />}>
          <Route path="medico" element={<MedicoPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['paciente']} />}>
          <Route path="paciente" element={<PacientePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;