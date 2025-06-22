import React, { useState } from 'react';
import api from '../../service/api';

const Relatorios = () => {
  const [relatorio, setRelatorio] = useState([]);
  const [datas, setDatas] = useState({ dataInicio: '', dataFim: '' });

  const handleGerarRelatorio = async () => {
    try {
      const response = await api.get('/relatorios/consultas', { params: datas });
      setRelatorio(response.data.relatorio);
    } catch (error) {
      alert('Erro ao gerar relatório.');
    }
  };

  const handleChange = (e) => setDatas({ ...datas, [e.target.name]: e.target.value });

  return (
    <div>
      <h5>Consultas por Período</h5>
      <div className="row g-3 align-items-center mb-3">
        <div className="col-auto"><input type="date" name="dataInicio" className="form-control" onChange={handleChange} /></div>
        <div className="col-auto"><input type="date" name="dataFim" className="form-control" onChange={handleChange} /></div>
        <div className="col-auto"><button className="btn btn-secondary" onClick={handleGerarRelatorio}>Gerar</button></div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome do Médico</th>
            <th>Total de Consultas</th>
          </tr>
        </thead>
        <tbody>
          {relatorio.map((item, index) => (
            <tr key={index}>
              <td>{item['Medico.nome']}</td>
              <td>{item.total_consultas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Relatorios;