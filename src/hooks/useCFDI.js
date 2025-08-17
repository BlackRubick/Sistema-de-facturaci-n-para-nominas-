// src/hooks/useCFDI.js - Hook personalizado para manejo de CFDIs
import { useState, useCallback, useEffect } from 'react';
import CFDIService from '../services/cfdiService';

const useCFDI = () => {
  const [cfdiList, setCfdiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    rfc: '',
    month: '',
    year: '',
    page: 1,
    per_page: 100
  });

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar CFDIs con filtros
  const loadCFDIs = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const searchFilters = { ...filters, ...customFilters };
      
      // Remover filtros vacíos
      const cleanFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
        if (value && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      let result;
      
      if (Object.keys(cleanFilters).length === 0) {
        // Si no hay filtros, cargar CFDIs recientes
        result = await CFDIService.getRecentCFDIs(6);
      } else {
        result = await CFDIService.listCFDIs(cleanFilters);
      }

      if (result.data && Array.isArray(result.data)) {
        const formattedCFDIs = result.data.map(cfdi => 
          CFDIService.formatCFDIForDropdown(cfdi)
        );
        setCfdiList(formattedCFDIs);
      } else {
        setCfdiList([]);
      }

      return result;
    } catch (err) {
      console.error('Error loading CFDIs:', err);
      setError(err.message || 'Error al cargar CFDIs');
      setCfdiList([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Buscar CFDIs por RFC
  const searchByRFC = useCallback(async (rfc) => {
    if (!rfc || rfc.length < 12) {
      setCfdiList([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await CFDIService.searchCFDIsByRFC(rfc, {
        page: 1,
        per_page: 50
      });

      if (result.data && Array.isArray(result.data)) {
        const formattedCFDIs = result.data.map(cfdi => 
          CFDIService.formatCFDIForDropdown(cfdi)
        );
        setCfdiList(formattedCFDIs);
      } else {
        setCfdiList([]);
      }

      return result;
    } catch (err) {
      console.error('Error searching CFDIs by RFC:', err);
      setError(`Error al buscar CFDIs para RFC ${rfc}: ${err.message}`);
      setCfdiList([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar CFDIs por rango de fechas
  const searchByDateRange = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const result = await CFDIService.getCFDIsByDateRange(startDate, endDate, {
        per_page: 100
      });

      if (result.data && Array.isArray(result.data)) {
        const formattedCFDIs = result.data.map(cfdi => 
          CFDIService.formatCFDIForDropdown(cfdi)
        );
        setCfdiList(formattedCFDIs);
      } else {
        setCfdiList([]);
      }

      return result;
    } catch (err) {
      console.error('Error searching CFDIs by date range:', err);
      setError(`Error al buscar CFDIs en el rango de fechas: ${err.message}`);
      setCfdiList([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener CFDI por ID
  const getCFDIById = useCallback(async (cfdiId) => {
    const cfdi = cfdiList.find(c => c.id === cfdiId);
    if (cfdi) {
      return cfdi;
    }

    try {
      setLoading(true);
      const result = await CFDIService.getCFDI(cfdiId);
      return CFDIService.formatCFDIForDropdown(result);
    } catch (err) {
      console.error('Error getting CFDI by ID:', err);
      setError(`Error al obtener CFDI ${cfdiId}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cfdiList]);

  // Filtrar CFDIs localmente
  const filterCFDIs = useCallback((searchTerm) => {
    if (!searchTerm) return cfdiList;

    const term = searchTerm.toLowerCase();
    return cfdiList.filter(cfdi =>
      cfdi.folio.toLowerCase().includes(term) ||
      cfdi.receptor.toLowerCase().includes(term) ||
      cfdi.receptorRFC.toLowerCase().includes(term) ||
      cfdi.uuid.toLowerCase().includes(term)
    );
  }, [cfdiList]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Resetear estado
  const reset = useCallback(() => {
    setCfdiList([]);
    setError(null);
    setLoading(false);
    setFilters({
      rfc: '',
      month: '',
      year: '',
      page: 1,
      per_page: 100
    });
  }, []);

  // Obtener estadísticas de CFDIs
  const getStats = useCallback(() => {
    const stats = {
      total: cfdiList.length,
      timbradas: cfdiList.filter(c => c.status === 'timbrada').length,
      enviadas: cfdiList.filter(c => c.status === 'enviada').length,
      canceladas: cfdiList.filter(c => c.status === 'cancelada').length,
      borradores: cfdiList.filter(c => c.status === 'borrador').length,
      totalAmount: cfdiList.reduce((sum, c) => sum + c.total, 0)
    };

    return stats;
  }, [cfdiList]);

  // Validar si un CFDI puede ser relacionado
  const canBeRelated = useCallback((cfdi) => {
    if (!cfdi) return false;
    
    // Los CFDIs cancelados no pueden ser relacionados
    if (cfdi.status === 'cancelada') return false;
    
    // Los borradores no pueden ser relacionados
    if (cfdi.status === 'borrador') return false;
    
    return true;
  }, []);

  // Obtener CFDIs relacionables (filtrados)
  const getRelatableCFDIs = useCallback(() => {
    return cfdiList.filter(canBeRelated);
  }, [cfdiList, canBeRelated]);

  // Formatear CFDI para mostrar en select
  const formatForSelect = useCallback((cfdi) => {
    if (!cfdi) return '';
    
    const status = cfdi.status === 'timbrada' ? '✅' : 
                  cfdi.status === 'enviada' ? '📧' : 
                  cfdi.status === 'cancelada' ? '❌' : '📄';
    
    return `${status} ${cfdi.folio} - ${cfdi.receptor} - $${cfdi.total.toLocaleString()} (${cfdi.fechaTimbrado})`;
  }, []);

  return {
    // Estado
    cfdiList,
    loading,
    error,
    filters,
    
    // Acciones
    loadCFDIs,
    searchByRFC,
    searchByDateRange,
    getCFDIById,
    filterCFDIs,
    updateFilters,
    reset,
    clearError,
    
    // Utilidades
    getStats,
    canBeRelated,
    getRelatableCFDIs,
    formatForSelect,
    
    // Estado calculado
    hasData: cfdiList.length > 0,
    isEmpty: cfdiList.length === 0 && !loading,
    relatableCFDIs: getRelatableCFDIs()
  };
};

export default useCFDI;