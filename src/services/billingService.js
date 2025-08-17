// src/services/billingService.js
import CFDIService from './cfdiService';

class BillingService {
  constructor() {
    this.cfdiService = CFDIService;
  }

  // Crear factura completa (cliente + CFDI)
  async createInvoice(invoiceData) {
    try {
      let clientUID = invoiceData.clientId;

      // Crear cliente si es nuevo
      if (!clientUID || clientUID === 'new') {
        const clientResult = await this.cfdiService.createClient({
          name: invoiceData.clientData.name,
          rfc: invoiceData.clientData.rfc,
          email: invoiceData.clientData.email,
          phone: invoiceData.clientData.phone,
          address: invoiceData.clientData.address,
          fiscal_regime: invoiceData.clientData.fiscalRegime,
          cfdi_use: invoiceData.clientData.cfdiUse
        });
        clientUID = clientResult.uid || clientResult.id;
      }

      // Crear CFDI
      const cfdiData = this.cfdiService.transformInvoiceToCFDI(
        invoiceData,
        { uid: clientUID },
        { id: invoiceData.serie }
      );

      if (invoiceData.draft) {
        cfdiData.Draft = "1";
      }

      const result = await this.cfdiService.createCFDI(cfdiData);

      return {
        success: true,
        invoice: result,
        clientUID: clientUID
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Obtener lista de facturas
  async getInvoices(filters = {}) {
    try {
      // Esta función debería llamar a un endpoint que liste los CFDIs
      // Por ahora usaremos datos mock ya que la API de Factura.com
      // no tiene un endpoint público para listar todos los CFDIs
      return this.getMockInvoices(filters);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  // Datos mock para desarrollo
  getMockInvoices(filters = {}) {
    const mockInvoices = [
      {
        id: 1,
        uuid: '8ff503a2-c6b7-4a25-92c7-a25610e6b488',
        number: 'FAC-001',
        serie: 'F',
        folio: '001',
        clientName: 'Empresa ABC S.A. de C.V.',
        clientRfc: 'ABC123456789',
        clientEmail: 'contacto@empresaabc.com',
        issueDate: '2024-01-15',
        dueDate: '2024-02-15',
        subtotal: 85000,
        tax: 13600,
        total: 98600,
        status: 'timbrada',
        paymentDate: null,
        satStatus: 'vigente',
        items: [
          { description: 'Desarrollo de aplicación web', quantity: 1, price: 50000 },
          { description: 'Hosting y dominio anual', quantity: 1, price: 35000 }
        ]
      },
      {
        id: 2,
        uuid: '7ae402b1-c5a6-3b24-81c6-b14509e5a387',
        number: 'FAC-002',
        serie: 'F',
        folio: '002',
        clientName: 'Comercial XYZ S.R.L.',
        clientRfc: 'XYZ987654321',
        clientEmail: 'admin@comercialxyz.com',
        issueDate: '2024-01-20',
        dueDate: '2024-02-20',
        subtotal: 120000,
        tax: 19200,
        total: 139200,
        status: 'borrador',
        paymentDate: null,
        satStatus: 'no_timbrada',
        items: [
          { description: 'Sistema de gestión de inventario', quantity: 1, price: 80000 },
          { description: 'Capacitación del personal', quantity: 1, price: 40000 }
        ]
      }
    ];

    // Aplicar filtros
    let filtered = mockInvoices;
    
    if (filters.status) {
      filtered = filtered.filter(inv => inv.status === filters.status);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.number.toLowerCase().includes(search) ||
        inv.clientName.toLowerCase().includes(search) ||
        inv.clientRfc.toLowerCase().includes(search)
      );
    }

    return { data: filtered };
  }

  // Obtener detalle de factura
  async getInvoiceDetail(uuid) {
    try {
      return await this.cfdiService.getCFDI(uuid);
    } catch (error) {
      console.error('Error fetching invoice detail:', error);
      throw error;
    }
  }

  // Cancelar CFDI
  async cancelInvoice(uuid, reason = '02') {
    try {
      return await this.cfdiService.cancelCFDI(uuid, reason);
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      throw error;
    }
  }

  // Enviar CFDI por email
  async sendInvoiceByEmail(uuid, email) {
    try {
      return await this.cfdiService.sendCFDIByEmail(uuid, email);
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    }
  }

  // Descargar PDF
  async downloadInvoicePDF(uuid) {
    try {
      const pdfBlob = await this.cfdiService.getCFDIPDF(uuid);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CFDI_${uuid}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }

  // Descargar XML
  async downloadInvoiceXML(uuid) {
    try {
      const xmlContent = await this.cfdiService.getCFDIXML(uuid);
      
      // Crear blob y descargar
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CFDI_${uuid}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading XML:', error);
      throw error;
    }
  }

  // Gestión de clientes
  async getClients() {
    try {
      return await this.cfdiService.getClients();
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  async createClient(clientData) {
    try {
      return await this.cfdiService.createClient(clientData);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  async updateClient(clientId, clientData) {
    try {
      // La API de Factura.com no tiene endpoint público para actualizar clientes
      // Esto dependería de la implementación específica
      throw new Error('Actualización de clientes no disponible en la API actual');
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  async deleteClient(clientId) {
    try {
      // La API de Factura.com no tiene endpoint público para eliminar clientes
      // Esto dependería de la implementación específica
      throw new Error('Eliminación de clientes no disponible en la API actual');
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  // Obtener series disponibles
  async getSeries() {
    try {
      return await this.cfdiService.getSeries();
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  }

  // Validar RFC
  validateRFC(rfc) {
    const rfcPattern = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-V1-9][A-Z1-9][0-9A]$/;
    return rfcPattern.test(rfc.toUpperCase());
  }

  // Calcular totales de factura
  calculateInvoiceTotals(items) {
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = parseFloat(item.quantity || 0) * parseFloat(item.price || 0);
      const itemDiscount = parseFloat(item.discount || 0);
      return sum + (itemTotal - itemDiscount);
    }, 0);

    const totalDiscount = items.reduce((sum, item) => 
      sum + parseFloat(item.discount || 0), 0
    );

    const tax = subtotal * 0.16; // IVA 16%
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      totalDiscount
    };
  }

  // Formatear moneda
  formatCurrency(amount, currency = 'MXN') {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Obtener status de CFDI para display
  getStatusDisplay(status) {
    const statusMap = {
      'borrador': { text: 'Borrador', class: 'status-draft' },
      'timbrada': { text: 'Timbrada', class: 'status-issued' },
      'enviada': { text: 'Enviada', class: 'status-sent' },
      'pagada': { text: 'Pagada', class: 'status-paid' },
      'cancelada': { text: 'Cancelada', class: 'status-cancelled' }
    };

    return statusMap[status] || { text: status, class: 'status-unknown' };
  }

  // Validar datos de factura antes de enviar
  validateInvoiceData(invoiceData) {
    const errors = [];

    // Validar cliente
    if (!invoiceData.clientData?.name) errors.push('Nombre del cliente requerido');
    if (!invoiceData.clientData?.rfc) errors.push('RFC del cliente requerido');
    if (!invoiceData.clientData?.email) errors.push('Email del cliente requerido');
    if (!this.validateRFC(invoiceData.clientData?.rfc || '')) errors.push('RFC inválido');

    // Validar configuración
    if (!invoiceData.serie) errors.push('Serie requerida');
    if (!invoiceData.issuePlace) errors.push('Lugar de expedición requerido');

    // Validar items
    if (!invoiceData.items || invoiceData.items.length === 0) {
      errors.push('Debe incluir al menos un concepto');
    } else {
      invoiceData.items.forEach((item, index) => {
        if (!item.description) errors.push(`Descripción requerida en concepto ${index + 1}`);
        if (!item.quantity || item.quantity <= 0) errors.push(`Cantidad inválida en concepto ${index + 1}`);
        if (!item.price || item.price <= 0) errors.push(`Precio inválido en concepto ${index + 1}`);
        if (!item.satCode) errors.push(`Código SAT requerido en concepto ${index + 1}`);
      });
    }

    return errors;
  }

  // Generar número de orden único
  generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
}

export default new BillingService();