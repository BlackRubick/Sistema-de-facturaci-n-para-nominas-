// src/services/cfdiService.js - Versión actualizada con nuevos métodos de clientes
class CFDIService {
  constructor() {
    // Cambiar de esto:
    this.baseURL = '/api';
    
    // A esto:
    this.baseURL = 'http://3.16.224.4:3001/api';
    
    // Mantener las variables para referencia, aunque el proxy maneje las credenciales
    this.apiKey = import.meta.env.VITE_FACTURA_API_KEY;
    this.secretKey = import.meta.env.VITE_FACTURA_SECRET_KEY;
    this.plugin = "9d4095c8f7ed5785cb14c0e3b033eeb8252416ed";
  }

  getHeaders() {
    return {
      "Content-Type": "application/json"
    };
  }

  // === MÉTODOS DE CFDI (mantenidos) ===

  // Nuevo método: Listar CFDIs
  async listCFDIs(filters = {}) {
    try {
      const payload = {
        // Parámetros opcionales según la documentación
        ...(filters.month && { month: filters.month }),
        ...(filters.year && { year: filters.year }),
        ...(filters.rfc && { rfc: filters.rfc }),
        ...(filters.page && { page: filters.page }),
        ...(filters.per_page && { per_page: filters.per_page }),
      };

      const response = await fetch(`${this.baseURL}/cfdi/list`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error listing CFDIs:", error);
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
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = currentDate.getFullYear().toString();

        try {
          const monthlyResult = await this.listCFDIs({
            month,
            year,
            page: options.page || 1,
            per_page: options.per_page || 100,
            ...options,
          });

          if (monthlyResult.data && Array.isArray(monthlyResult.data)) {
            results.push(...monthlyResult.data);
          }
        } catch (monthError) {
          console.warn(
            `Error fetching CFDIs for ${month}/${year}:`,
            monthError
          );
        }

        // Avanzar al siguiente mes
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return {
        data: results,
        total: results.length,
      };
    } catch (error) {
      console.error("Error getting CFDIs by date range:", error);
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
      console.error("Error getting recent CFDIs:", error);
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
        ...options,
      });
    } catch (error) {
      console.error("Error searching CFDIs by RFC:", error);
      throw error;
    }
  }

  // Crear CFDI
  async createCFDI(cfdiData) {
    try {
      const response = await fetch(`${this.baseURL}/cfdi/create`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(cfdiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating CFDI:", error);
      throw error;
    }
  }

  // Obtener CFDI por ID
  async getCFDI(id) {
    try {
      const response = await fetch(`${this.baseURL}/cfdi/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching CFDI:", error);
      throw error;
    }
  }

  // Cancelar CFDI
  async cancelCFDI(uuid, reason = "02") {
    try {
      const response = await fetch(`${this.baseURL}/cfdi/cancel`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          uuid: uuid,
          motivo: reason,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error cancelling CFDI:", error);
      throw error;
    }
  }

  // Enviar CFDI por email
  async sendCFDIByEmail(uuid, email) {
    try {
      const response = await fetch(`${this.baseURL}/cfdi/send`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          uuid: uuid,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error sending CFDI:", error);
      throw error;
    }
  }

  // Obtener PDF del CFDI
  async getCFDIPDF(uuid) {
    try {
      const response = await fetch(`${this.baseURL}/cfdi/pdf/${uuid}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Error al obtener PDF");
      }

      return response.blob();
    } catch (error) {
      console.error("Error fetching PDF:", error);
      throw error;
    }
  }

  // Obtener XML del CFDI
  async getCFDIXML(uuid) {
    try {
      const response = await fetch(`${this.baseURL}/cfdi/xml/${uuid}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Error al obtener XML");
      }

      return response.text();
    } catch (error) {
      console.error("Error fetching XML:", error);
      throw error;
    }
  }

  // === MÉTODOS DE CLIENTES (actualizados y ampliados) ===

  // Obtener lista de clientes
  async getClients() {
    try {
      const response = await fetch(`${this.baseURL}/clients`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  }

  // Crear cliente/receptor
  async createClient(clientData) {
    try {
      const response = await fetch(`${this.baseURL}/clients`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  }

  // NUEVO: Buscar cliente por RFC
  async getClientByRFC(rfc) {
    try {
      const response = await fetch(`${this.baseURL}/clients/${rfc}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching client by RFC:", error);
      throw error;
    }
  }

  // NUEVO: Buscar cliente por UID
  async getClientByUID(uid) {
    try {
      const response = await fetch(`${this.baseURL}/clients/uid/${uid}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching client by UID:", error);
      throw error;
    }
  }

  // NUEVO: Buscar clientes con RFC repetido
  async getClientsByRFC(rfc) {
    try {
      const response = await fetch(`${this.baseURL}/clients/rfc/${rfc}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching clients by RFC:", error);
      throw error;
    }
  }

  // NUEVO: Actualizar cliente
  async updateClient(uid, clientData) {
    try {
      const response = await fetch(`${this.baseURL}/clients/${uid}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  }

  // NUEVO: Eliminar cliente
  async deleteClient(uid) {
    try {
      const response = await fetch(`${this.baseURL}/clients/${uid}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  }

  // === MÉTODOS DE SERIES (mantenidos) ===

  // Obtener series disponibles
  async getSeries() {
    try {
      const response = await fetch(`${this.baseURL}/series`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching series:", error);
      throw error;
    }
  }

  // === MÉTODOS AUXILIARES (mantenidos) ===

  // Transformar datos de factura interna a formato CFDI
  transformInvoiceToCFDI(invoice, client, series) {
    // Calcular totales
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const tax = subtotal * 0.16; // IVA 16%
    const total = subtotal + tax;

    return {
      Receptor: {
        UID: client.uid || client.id,
      },
      TipoDocumento: "factura",
      Conceptos: invoice.items.map((item) => ({
        ClaveProdServ: item.satCode || "81112101", // Código por defecto
        NoIdentificacion: item.sku || "",
        Cantidad: parseFloat(item.quantity),
        ClaveUnidad: item.unitCode || "E48",
        Unidad: item.unit || "Unidad de servicio",
        Descripcion: item.description,
        ValorUnitario: parseFloat(item.price).toFixed(6),
        Importe: (parseFloat(item.quantity) * parseFloat(item.price)).toFixed(
          6
        ),
        Descuento: item.discount ? parseFloat(item.discount).toFixed(6) : "0",
        ObjetoImp: "02", // Sí objeto de impuesto
        Impuestos: {
          Traslados: [
            {
              Base: (
                parseFloat(item.quantity) * parseFloat(item.price)
              ).toFixed(6),
              Impuesto: "002", // IVA
              TipoFactor: "Tasa",
              TasaOCuota: "0.16",
              Importe: (
                parseFloat(item.quantity) *
                parseFloat(item.price) *
                0.16
              ).toFixed(6),
            },
          ],
          Retenidos: [],
          Locales: [],
        },
      })),
      UsoCFDI: invoice.cfdiUse || "G03",
      Serie: parseInt(series.id),
      FormaPago: invoice.paymentForm || "03",
      MetodoPago: invoice.paymentMethod || "PUE",
      Moneda: invoice.currency || "MXN",
      EnviarCorreo: invoice.sendEmail !== false,
      LugarExpedicion: invoice.issuePlace || "44100",
      Comentarios: invoice.notes || "",
      NumOrder: invoice.orderNumber || "",
    };
  }

  // Validar configuración (ya no necesario validar credenciales aquí)
  validateConfig() {
    // El proxy maneja las credenciales
    return true;
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
      displayText: `${cfdi.Folio} - ${cfdi.RazonSocialReceptor} - $${parseFloat(
        cfdi.Total
      ).toLocaleString()}`,
    };
  }

  // NUEVO: Método auxiliar para formatear clientes para el dropdown
  formatClientForDropdown(client) {
    return {
      id: client.uid || client.id,
      name: client.name || client.RazonSocial,
      rfc: client.rfc || client.RFC,
      email: client.email || client.Contacto?.Email || '',
      displayText: `${client.name || client.RazonSocial} - ${client.rfc || client.RFC}`
    };
  }

  // NUEVO: Método auxiliar para buscar cliente con validación
  async searchClient(searchTerm) {
    try {
      // Determinar si es RFC o UID
      const isRFC = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-V1-9][A-Z0-9][0-9]$/.test(searchTerm.toUpperCase());
      
      if (isRFC) {
        return await this.getClientByRFC(searchTerm.toUpperCase());
      } else {
        return await this.getClientByUID(searchTerm);
      }
    } catch (error) {
      console.error("Error searching client:", error);
      throw error;
    }
  }


// === MÉTODOS DE SERIES ACTUALIZADOS ===

// Obtener series disponibles
async getSeries() {
  try {
    const response = await fetch(`${this.baseURL}/series`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching series:", error);
    throw error;
  }
}

// NUEVO: Obtener serie por UID
async getSerieByUID(uid) {
  try {
    const response = await fetch(`${this.baseURL}/series/${uid}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching serie by UID:", error);
    throw error;
  }
}

// NUEVO: Crear serie
async createSerie(serieData) {
  try {
    const response = await fetch(`${this.baseURL}/series`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(serieData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating serie:", error);
    throw error;
  }
}

// NUEVO: Activar serie
async activateSerie(uid) {
  try {
    const response = await fetch(`${this.baseURL}/series/${uid}/activate`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error activating serie:", error);
    throw error;
  }
}

// NUEVO: Desactivar serie
async deactivateSerie(uid) {
  try {
    const response = await fetch(`${this.baseURL}/series/${uid}/deactivate`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deactivating serie:", error);
    throw error;
  }
}

// NUEVO: Eliminar serie
async deleteSerie(uid) {
  try {
    const response = await fetch(`${this.baseURL}/series/${uid}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting serie:", error);
    throw error;
  }
}

// NUEVO: Formatear serie para dropdown
formatSerieForDropdown(serie) {
  return {
    id: serie.uid || serie.id,
    name: serie.name,
    type: serie.type,
    description: serie.description,
    status: serie.status,
    displayText: `Serie ${serie.name} - ${serie.description} (${serie.status})`
  };
}

}

export default new CFDIService();