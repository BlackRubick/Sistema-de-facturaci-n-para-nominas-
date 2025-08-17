// src/components/billing/CFDISelector.jsx - Componente reutilizable para selección de CFDIs
import React, { useState, useEffect } from 'react';
import useCFDI from '../../hooks/useCFDI';
import Button from '../common/Button';

const CFDISelector = ({
  value = '',
  onChange = () => {},
  clientRFC = '',
  placeholder = 'Seleccionar CFDI relacionado...',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  showSearch = true,
  showStats = true,
  onCFDISelect = () => {},
  filterRelatable = true
}) => {
  const {
    cfdiList,
    loading,
    error,
    searchByRFC,
    loadCFDIs,
    filterCFDIs,
    getStats,
    formatForSelect,
    relatableCFDIs,
    clearError,
    reset
  } = useCFDI();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [filteredList, setFilteredList] = useState([]);

  // Cargar CFDIs cuando cambie el RFC del cliente
  useEffect(() => {
    if (clientRFC && clientRFC.length >= 12) {
      searchByRFC(clientRFC);
    } else if (!clientRFC) {
      loadCFDIs();
    }
  }, [clientRFC, searchByRFC, loadCFDIs]);

  // Filtrar lista local cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      setFilteredList(filterCFDIs(searchTerm));
    } else {
      setFilteredList(filterRelatable ? relatableCFDIs : cfdiList);
    }
  }, [searchTerm, cfdiList, relatableCFDIs, filterCFDIs, filterRelatable]);

  const handleCFDIChange = (cfdiId) => {
    onChange(cfdiId);
    
    if (cfdiId) {
      const selectedCFDI = cfdiList.find(c => c.id === cfdiId);
      if (selectedCFDI) {
        onCFDISelect(selectedCFDI);
      }
    } else {
      onCFDISelect(null);
    }
  };

  const handleRefresh = () => {
    clearError();
    if (clientRFC) {
      searchByRFC(clientRFC);
    } else {
      loadCFDIs();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    reset();
    onChange('');
    onCFDISelect(null);
  };

  const selectedCFDI = cfdiList.find(c => c.id === value);
  const stats = getStats();

  return (
    <div className={`cfdi-selector ${className}`}>
      <div className="input-group">
        <label className="input-label">
          CFDI Relacionado
          {required && <span className="input-required">*</span>}
          {loading && <span className="loading-text"> - Cargando...</span>}
        </label>

        {/* Search input si está habilitado */}
        {showSearch && filteredList.length > 5 && (
          <div className="cfdi-search-container">
            <input
              type="text"
              className="cfdi-search-input"
              placeholder="Buscar por folio, receptor, RFC o UUID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <span className="cfdi-search-icon">🔍</span>
          </div>
        )}

        {/* Select principal */}
        <select
          value={value}
          onChange={(e) => handleCFDIChange(e.target.value)}
          className="input"
          disabled={disabled || loading}
          required={required}
        >
          <option value="">{placeholder}</option>
          {filteredList.length > 0 ? (
            filteredList.map(cfdi => (
              <option key={cfdi.id} value={cfdi.id}>
                {formatForSelect(cfdi)}
              </option>
            ))
          ) : (
            !loading && (
              <option value="" disabled>
                {clientRFC ? 
                  `No se encontraron CFDIs para el RFC: ${clientRFC}` : 
                  'No hay CFDIs disponibles'
                }
              </option>
            )
          )}
        </select>

        {/* Estadísticas si están habilitadas */}
        {showStats && stats.total > 0 && (
          <div className="cfdi-stats">
            <span className="cfdi-count-indicator">
              {stats.total} CFDIs encontrados
            </span>
            {filterRelatable && (
              <span className="cfdi-count-indicator">
                {relatableCFDIs.length} relacionables
              </span>
            )}
          </div>
        )}

        {/* Helper text y errores */}
        {error && (
          <div className="cfdi-error">
            {error}
          </div>
        )}

        {helperText && !error && (
          <span className="input-helper-text">
            {helperText}
          </span>
        )}

        {/* Acciones */}
        <div className="cfdi-actions">
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            title="Actualizar lista"
          >
            🔄 Actualizar
          </Button>
          
          {(value || searchTerm) && (
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={handleClear}
              title="Limpiar selección"
            >
              ✕ Limpiar
            </Button>
          )}

          {stats.total > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={() => setShowDetails(!showDetails)}
              title="Ver detalles"
            >
              {showDetails ? '👁️ Ocultar' : '👁️ Detalles'}
            </Button>
          )}
        </div>
      </div>

      {/* Detalles del CFDI seleccionado */}
      {selectedCFDI && showDetails && (
        <div className="cfdi-details">
          <h4>Detalles del CFDI Seleccionado</h4>
          <div className="cfdi-details-grid">
            <div className="cfdi-detail-item">
              <span className="label">Folio:</span>
              <span className="value">{selectedCFDI.folio}</span>
            </div>
            <div className="cfdi-detail-item">
              <span className="label">UUID:</span>
              <span className="value" title={selectedCFDI.uuid}>
                {selectedCFDI.uuid.substring(0, 8)}...
              </span>
            </div>
            <div className="cfdi-detail-item">
              <span className="label">Receptor:</span>
              <span className="value">{selectedCFDI.receptor}</span>
            </div>
            <div className="cfdi-detail-item">
              <span className="label">RFC:</span>
              <span className="value">{selectedCFDI.receptorRFC}</span>
            </div>
            <div className="cfdi-detail-item">
              <span className="label">Total:</span>
              <span className="value">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN'
                }).format(selectedCFDI.total)}
              </span>
            </div>
            <div className="cfdi-detail-item">
              <span className="label">Estado:</span>
              <span className={`value status-${selectedCFDI.status}`}>
                {selectedCFDI.status}
              </span>
            </div>
            <div className="cfdi-detail-item">
              <span className="label">Fecha:</span>
              <span className="value">{selectedCFDI.fechaTimbrado}</span>
            </div>
          </div>

          <div className="cfdi-quick-actions">
            <button 
              type="button"
              className="cfdi-quick-action"
              onClick={() => navigator.clipboard.writeText(selectedCFDI.uuid)}
              title="Copiar UUID"
            >
              📋 Copiar UUID
            </button>
            <button 
              type="button"
              className="cfdi-quick-action"
              onClick={() => navigator.clipboard.writeText(selectedCFDI.folio)}
              title="Copiar Folio"
            >
              📋 Copiar Folio
            </button>
          </div>
        </div>
      )}

      {/* Estado sin datos */}
      {!loading && filteredList.length === 0 && !error && (
        <div className="no-cfdis-found">
          <p>
            {clientRFC ? 
              `No se encontraron CFDIs para el RFC: ${clientRFC}` :
              'No hay CFDIs disponibles'
            }
          </p>
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={handleRefresh}
          >
            🔄 Intentar de nuevo
          </Button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="cfdi-loading-skeleton">
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
          <div className="skeleton-item"></div>
        </div>
      )}
    </div>
  );
};

export default CFDISelector;