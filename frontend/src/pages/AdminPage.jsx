import React, { useState } from 'react';
import GerenciarConvenios from '../components/admin/GerenciarConvenios';
import GerenciarUsuarios from '../components/admin/GerenciarUsuarios';
import GerenciarEspecialidades from '../components/admin/GerenciarEspecialidade';
import Relatorios from '../components/admin/Relatorios';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('usuarios');

  const renderContent = () => {
    switch (activeTab) {
      case 'usuarios':
        return <GerenciarUsuarios />;
      case 'especialidades':
        return <GerenciarEspecialidades />;
      case 'convenios':
        return <GerenciarConvenios />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return null;
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-dark text-white">
        <h3 className="text-center mb-0">Painel do Administrador</h3>
      </div>
      <div className="card-body">
        <ul className="nav nav-tabs nav-fill mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`} 
              onClick={() => setActiveTab('usuarios')}
            >
              Gerenciar Usuários
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'especialidades' ? 'active' : ''}`} 
              onClick={() => setActiveTab('especialidades')}
            >
              Especialidades
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'convenios' ? 'active' : ''}`} 
              onClick={() => setActiveTab('convenios')}
            >
              Convênios
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'relatorios' ? 'active' : ''}`} 
              onClick={() => setActiveTab('relatorios')}
            >
              Relatórios
            </button>
          </li>
        </ul>

        {/* Conteúdo da Aba Ativa */}
        <div className="tab-content p-3 border bg-light rounded">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;