import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import Button from '../common/Button';
import Input from '../common/Input';
import '../../styles/components/auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError } = useAuthContext();
  const { addNotification } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        addNotification({
          type: 'success',
          message: '¡Bienvenido al sistema!'
        });
      } else {
        addNotification({
          type: 'error',
          message: result.error || 'Error al iniciar sesión'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Error de conexión'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Facturación y Nóminas</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@empresa.com"
              required
            />
          </div>

          <div className="form-group">
            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={!formData.email || !formData.password}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            <strong>Credenciales de prueba:</strong><br />
            Email: admin@empresa.com<br />
            Contraseña: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;