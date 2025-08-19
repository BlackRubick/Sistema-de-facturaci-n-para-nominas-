
// src/pages/gastos/GastosCategorias.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAppContext } from '../../context/AppContext';

const GastosCategorias = () => {
  const { addNotification } = useAppContext();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    presupuestoMensual: '',
    activa: true
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockCategorias = [
        {
          id: 1,
          nombre: 'Suministros de Oficina',
          descripcion: 'Papelería, útiles y materiales de oficina',
          presupuestoMensual: 10000,
          gastoActual: 7500,
          activa: true
        },
        {
          id: 2,
          nombre: 'Mantenimiento',
          descripcion: 'Servicios de mantenimiento y reparaciones',
          presupuestoMensual: 25000,
          gastoActual: 18000,
          activa: true
        },
        {
          id: 3,
          nombre: 'Marketing',
          descripcion: 'Gastos de publicidad y marketing',
          presupuestoMensual: 50000,
          gastoActual: 35000,
          activa: true
        }
      ];
      setCategorias(mockCategorias);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al cargar categorías'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Actualizar categoría
        setCategorias(categorias.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        ));
        addNotification({
          type: 'success',
          message: 'Categoría actualizada exitosamente'
        });
      } else {
        // Crear nueva categoría
        const newCategory = {
          id: Date.now(),
          ...formData,
          gastoActual: 0
        };
        setCategorias([...categorias, newCategory]);
        addNotification({
          type: 'success',
          message: 'Categoría creada exitosamente'
        });
      }
      
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ nombre: '', descripcion: '', presupuestoMensual: '', activa: true });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error al guardar categoría'
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion,
      presupuestoMensual: category.presupuestoMensual,
      activa: category.activa
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      setCategorias(categorias.filter(cat => cat.id !== id));
      addNotification({
        type: 'success',
        message: 'Categoría eliminada exitosamente'
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getUsagePercentage = (actual, presupuesto) => {
    return presupuesto > 0 ? Math.round((actual / presupuesto) * 100) : 0;
  };

  return (
    <div className="gastos-categorias">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Categorías de Gastos</h1>
          <p>Gestiona las categorías y presupuestos para gastos</p>
        </div>
        <div className="page-actions">
          <Button 
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            ➕ Nueva Categoría
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-grid">
              <Input
                label="Nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
              <Input
                label="Presupuesto Mensual"
                type="number"
                value={formData.presupuestoMensual}
                onChange={(e) => setFormData({...formData, presupuestoMensual: e.target.value})}
                step="0.01"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="input textarea"
                rows="3"
              />
            </div>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {editingCategory ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="categorias-grid">
        {categorias.map(categoria => {
          const percentage = getUsagePercentage(categoria.gastoActual, categoria.presupuestoMensual);
          const isOverBudget = percentage > 100;
          
          return (
            <div key={categoria.id} className="categoria-card">
              <div className="categoria-header">
                <h3>{categoria.nombre}</h3>
                <div className="categoria-actions">
                  <Button size="small" variant="outline" onClick={() => handleEdit(categoria)}>
                    ✏️
                  </Button>
                  <Button size="small" variant="error" onClick={() => handleDelete(categoria.id)}>
                    🗑️
                  </Button>
                </div>
              </div>
              
              <p className="categoria-description">{categoria.descripcion}</p>
              
              <div className="presupuesto-info">
                <div className="presupuesto-amounts">
                  <span>Gastado: {formatCurrency(categoria.gastoActual)}</span>
                  <span>Presupuesto: {formatCurrency(categoria.presupuestoMensual)}</span>
                </div>
                
                <div className="presupuesto-bar">
                  <div 
                    className={`presupuesto-progress ${isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className={`presupuesto-percentage ${isOverBudget ? 'over-budget' : ''}`}>
                  {percentage}% utilizado
                  {isOverBudget && <span className="warning"> ⚠️ Sobre presupuesto</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GastosCategorias;