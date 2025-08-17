// src/services/cfdiService.js - Actualización para incluir listado de CFDIs
class CFDIService {
  constructor() {
    // Configuración para sandbox o producción (sintaxis para Vite)
    this.baseURL = import.meta.env.VITE_FACTURA_ENV === 'sandbox' 
      ? 'https://sandbox.factura.com/api' 
      : 'https://api.factura.com';
    
    this.apiKey = import.meta.env.VITE_FACTURA_API_KEY;
    this.secretKey = import.meta.env.VITE_FACTURA_SECRET_KEY;
    this.plugin = '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed';
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'F-PLUGIN': this.plugin,
      'F-Api-Key': this.apiKey,
      'F-Secret-Key': this.secretKey
    };
  }

  // Nuevo método: Listar CFDIs
  async listCFDIs(filters = {}) {
    try {
      const payload = {
        // Parámetros opcionales según la documentación
        ...(filters.month && { month: filters.month }),
        ...(filters.year && { year: filters.year }),
        ...(filters.rfc && { rfc: filters.rfc }),
        ...(filters.page && { page: filters.page }),
        ...(filters.per_page && { per_page: filters.per_page })
      };

      const response = await fetch(`${this.baseURL}/v4/cfdi/list`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener lista de CFDIs');
      }

      return result;
    } catch (error) {
      console.error('Error listing CFDIs:', error);
      throw error;
    }
  }

  // Método auxiliar para obtener CFDIs con filtros específicos
  async getCFDIsByDateRange(startDate, endDate, options = {}) {
    try {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      const results = [];
      let currentDate = new Date(startDateObj);
      
      while (currentDate <= endDateObj) {
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        
        try {
          const monthlyResult = await this.listCFDIs({
            month,
            year,
            page: options.page || 1,
            per_page: options.per_page || 100,
            ...options
          });
          
          if (monthlyResult.data && Array.isArray(monthlyResult.data)) {
            results.push(...monthlyResult.data);
          }
        } catch (monthError) {
          console.warn(`Error fetching CFDIs for ${month}/${year}:`, monthError);
        }
        
        // Avanzar al siguiente mes
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return {
        data: results,
        total: results.length
      };
    } catch (error) {
      console.error('Error getting CFDIs by date range:', error);
      throw error;
    }
  }

  // Método para obtener CFDIs del último año
  async getRecentCFDIs(months = 12) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      return await this.getCFDIsByDateRange(startDate, endDate);
    } catch (error) {
      console.error('Error getting recent CFDIs:', error);
      throw error;
    }
  }

  // Método para buscar CFDIs por RFC específico
  async searchCFDIsByRFC(rfc, options = {}) {
    try {
      return await this.listCFDIs({
        rfc: rfc.toUpperCase(),
        page: options.page || 1,
        per_page: options.per_page || 100,
        ...options
      });
    } catch (error) {
      console.error('Error searching CFDIs by RFC:', error);
      throw error;
    }
  }

  // Crear CFDI
  async createCFDI(cfdiData) {
    try {
      const response = await fetch(`${this.baseURL}/v4/cfdi40/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(cfdiData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear CFDI');
      }

      return result;
    } catch (error) {
      console.error('Error creating CFDI:', error);
      throw error;
    }
  }

  // Crear cliente/receptor
  async createClient(clientData) {
    try {
      const response = await fetch(`${this.baseURL}/v3/clients/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(clientData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear cliente');
      }

      return result;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Obtener lista de clientes
  async getClients() {
    try {
      const response = await fetch(`${this.baseURL}/v3/clients`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener clientes');
      }

      return result;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  // Obtener series disponibles
  async getSeries() {
    try {
      const response = await fetch(`${this.baseURL}/v3/series`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener series');
      }

      return result;
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  }

  // Obtener CFDI por ID
  async getCFDI(id) {
    try {
      const response = await fetch(`${this.baseURL}/v4/cfdi40/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al obtener CFDI');
      }

      return result;
    } catch (error) {
      console.error('Error fetching CFDI:', error);
      throw error;
    }
  }

  // Cancelar CFDI
  async cancelCFDI(uuid, reason = '02') {
    try {
      const response = await fetch(`${this.baseURL}/v4/cfdi40/cancel`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          uuid: uuid,
          motivo: reason
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al cancelar CFDI');
      }

      return result;
    } catch (error) {
      console.error('Error cancelling CFDI:', error);
      throw error;
    }
  }

  // Enviar CFDI por email
  async sendCFDIByEmail(uuid, email) {
    try {
      const response = await fetch(`${this.baseURL}/v4/cfdi40/send`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          uuid: uuid,
          email: email
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al enviar CFDI');
      }

      return result;
    } catch (error) {
      console.error('Error sending CFDI:', error);
      throw error;
    }
  }

  // Obtener PDF del CFDI
  async getCFDIPDF(uuid) {
    try {
      const response = await fetch(`${this.baseURL}/v4/cfdi40/pdf/${uuid}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener PDF');
      }

      return response.blob();
    } catch (error) {
      console.error('Error fetching PDF:', error);
      throw error;
    }
  }

  // Obtener XML del CFDI
  async getCFDIXML(uuid) {
    try {
      const response = await fetch(`${this.baseURL}/v4/cfdi40/xml/${uuid}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener XML');
      }

      return response.text();
    } catch (error) {
      console.error('Error fetching XML:', error);
      throw error;
    }
  }

  // Transformar datos de factura interna a formato CFDI
  transformInvoiceToCFDI(invoice, client, series) {
    // Calcular totales
    const subtotal = invoice.items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    const tax = subtotal * 0.16; // IVA 16%
    const total = subtotal + tax;

    return {
      Receptor: {
        UID: client.uid || client.id
      },
      TipoDocumento: "factura",
      Conceptos: invoice.items.map(item => ({
        ClaveProdServ: item.satCode || "81112101", // Código por defecto
        NoIdentificacion: item.sku || "",
        Cantidad: parseFloat(item.quantity),
        ClaveUnidad: item.unitCode || "E48",
        Unidad: item.unit || "Unidad de servicio",
        Descripcion: item.description,
        ValorUnitario: parseFloat(item.price).toFixed(6),
        Importe: (parseFloat(item.quantity) * parseFloat(item.price)).toFixed(6),
        Descuento: item.discount ? parseFloat(item.discount).toFixed(6) : "0",
        ObjetoImp: "02", // Sí objeto de impuesto
        Impuestos: {
          Traslados: [
            {
              Base: (parseFloat(item.quantity) * parseFloat(item.price)).toFixed(6),
              Impuesto: "002", // IVA
              TipoFactor: "Tasa",
              TasaOCuota: "0.16",
              Importe: (parseFloat(item.quantity) * parseFloat(item.price) * 0.16).toFixed(6)
            }
          ],
          Retenidos: [],
          Locales: []
        }
      })),
      UsoCFDI: invoice.cfdiUse || "G03",
      Serie: parseInt(series.id),
      FormaPago: invoice.paymentForm || "03",
      MetodoPago: invoice.paymentMethod || "PUE",
      Moneda: invoice.currency || "MXN",
      EnviarCorreo: invoice.sendEmail !== false,
      LugarExpedicion: invoice.issuePlace || "44100",
      Comentarios: invoice.notes || "",
      NumOrder: invoice.orderNumber || ""
    };
  }

  // Validar configuración
  validateConfig() {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Faltan credenciales de API. Verifique las variables de entorno VITE_FACTURA_API_KEY y VITE_FACTURA_SECRET_KEY');
    }
  }

  // Métodos auxiliares para formateo y manejo de datos
  formatCFDIForDropdown(cfdi) {
    return {
      id: cfdi.UID,
      uuid: cfdi.UUID,
      folio: cfdi.Folio,
      receptor: cfdi.RazonSocialReceptor,
      receptorRFC: cfdi.Receptor,
      total: parseFloat(cfdi.Total),
      status: cfdi.Status,
      fechaTimbrado: cfdi.FechaTimbrado,
      displayText: `${cfdi.Folio} - ${cfdi.RazonSocialReceptor} - $${parseFloat(cfdi.Total).toLocaleString()}`
    };
  }
}

export default new CFDIService();