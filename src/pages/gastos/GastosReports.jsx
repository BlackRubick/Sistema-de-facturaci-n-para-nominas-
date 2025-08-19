// src/pages/gastos/GastosReports.jsx
import React, { useState } from 'react';
import Button from '../../components/common/Button';

const GastosReports = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const reportTypes = [
    { id: 'monthly', name: 'Reporte Mensual', description: 'Gastos del mes actual' },
    { id: 'quarterly', name: 'Reporte Trimestral', description: 'Gastos del trimestre' },
    { id: 'category', name: 'Por Categoría', description: 'Análisis por categorías' },
    { id: 'department', name: 'Por Departamento', description: 'Gastos por departamento' },
    { id: 'provider', name: 'Por Proveedor', description: 'Análisis de proveedores' }
  ];

  const handleGenerateReport = () => {
    // Implementar generación de reportes
    alert(`Generando reporte: ${selectedReport}`);
  };

  return (
    <div className="gastos-reports">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Reportes de Gastos</h1>
          <p>Genera reportes y análisis de los gastos de la empresa</p>
        </div>
      </div>

      <div className="reports-container">
        <div className="report-selection">
          <h3>Seleccionar Tipo de Reporte</h3>
          <div className="report-types">
            {reportTypes.map(type => (
              <div 
                key={type.id} 
                className={`report-type ${selectedReport === type.id ? 'selected' : ''}`}
                onClick={() => setSelectedReport(type.id)}
              >
                <h4>{type.name}</h4>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="report-filters">
          <h3>Filtros</h3>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Fecha Inicio</label>
              <input
                type="date"
                className="input"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Fecha Fin</label>
              <input
                type="date"
                className="input"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="report-actions">
          <Button 
            variant="primary" 
            onClick={handleGenerateReport}
            disabled={!selectedReport}
          >
            📊 Generar Reporte
          </Button>
          <Button variant="outline">
            📤 Exportar a Excel
          </Button>
          <Button variant="outline">
            📄 Exportar a PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GastosReports;