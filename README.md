# Sistema de Facturación y Nóminas

Un sistema completo para la gestión de facturación y nóminas desarrollado con React y Vite.

## Características

-  Dashboard con métricas en tiempo real
-  Gestión de nóminas
-  Sistema de facturación
-  Administración de empleados
-  Sistema de autenticación
-  Diseño responsivo
-  Interfaz moderna y intuitiva

## Estructura del Proyecto

```
sistema-facturacion-nominas/
├── public/              # Archivos públicos
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── hooks/           # Hooks personalizados
│   ├── context/         # Contextos de React
│   ├── services/        # Servicios y API calls
│   ├── utils/           # Utilidades y helpers
│   ├── styles/          # Archivos de estilos
│   ├── assets/          # Imágenes e iconos
│   ├── data/            # Datos de prueba
│   └── routes/          # Configuración de rutas
├── package.json
├── vite.config.js
└── README.md
```

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la build de producción
- `npm run lint` - Ejecuta el linter

## Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación
- **Axios** - Cliente HTTP
- **Date-fns** - Manejo de fechas
- **UUID** - Generación de IDs únicos


## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.


Link del Proyecto: [https://github.com/tu-usuario/sistema-facturacion-nominas](https://github.com/tu-usuario/sistema-facturacion-nominas)
