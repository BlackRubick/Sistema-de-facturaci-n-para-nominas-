// src/pages/gastos/GastoEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { useAppContext } from '../../context/AppContext';

const GastoEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNotification } = useAppContext();
  
  const [formData, setFormData] = useState({
    concepto: '',
    descripcion: '',
    monto: '',
    categoria: '',
    proveedor: '',
    fecha: '',
    fechaSolicitud: '',
    solicitante: '',
    departamento: '',
    status: '',
    observaciones: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGasto();
  }, [id]);

  const loadGasto = async () => {
    try {
      setLoading(true);
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockGasto = {
        id: parseInt(id),
        concepto: 'Material de oficina',
        descripcion: 'Compra de papelería y suministros',
        monto: '15000',
        categoria: 'Suministros de Oficina',
        proveedor: 'Papelería Central',
        fecha: '2024-01-15',
        fechaSolicitud: '2024-01-14',
        solicitante: 'María González',
        departamento: 'Administración',
        status: 'aprobado',
        observaciones: 'Materiales necesarios para el equipo'
      };
      
      setFormData(mockGasto);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cargar el gasto'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      addNotification({
        type: 'success',
        message: 'Gasto actualizado exitosamente'
      });

      navigate('/gastos');
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al actualizar el gasto'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Cargando gasto..." />;
  }

  return (
    <div className="gasto-edit">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Editar Gasto</h1>
          <p>Modifica la información del gasto seleccionado</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="outline" 
            onClick={() => navigate('/gastos')}
            disabled={submitting}
          >
            ← Volver
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="gasto-form">
        <div className="form-section">
          <h2 className="form-section-title">Información del Gasto</h2>
          <div className="form-grid">
            <Input
              label="Concepto"
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Monto"
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              step="0.01"
              required
            />

            <Input
              label="Categoría"
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Proveedor"
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleInputChange}
            />

            <Input
              label="Fecha"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />

            <div className="input-group">
              <label className="input-label">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="pagado">Pagado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="input textarea"
              rows="3"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              className="input textarea"
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/gastos')}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={submitting}
          >
            {submitting ? 'Actualizando...' : 'Actualizar Gasto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GastoEdit;