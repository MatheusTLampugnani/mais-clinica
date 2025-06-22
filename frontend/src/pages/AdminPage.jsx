import React from 'react';

import GerenciarConvenios from '../components/admin/GerenciarConvenios';
import GerenciarUsuarios from '../components/admin/GerenciarUsuarios';
import GerenciarEspecialidades from '../components/admin/GerenciarEspecialidade';
import Relatorios from '../components/admin/Relatorios';

const AdminPage = () => {
  return (
    <div className="container-fluid">
      <h2 className="mb-4 text-center">Painel do Administrador</h2>
      <div className="card mb-4">
        <div className="card-header"><h4>Gerenciamento de Usuários</h4></div>
        <div className="card-body"><GerenciarUsuarios /></div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header"><h4>Gerenciamento de Especialidades</h4></div>
            <div className="card-body"><GerenciarEspecialidades /></div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header"><h4>Gerenciamento de Convênios</h4></div>
            <div className="card-body"><GerenciarConvenios /></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h4>Relatórios</h4></div>
        <div className="card-body"><Relatorios /></div>
      </div>
    </div>
  );
};

export default AdminPage;