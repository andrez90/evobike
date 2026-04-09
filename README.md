# 🏍️ EvoBike ERP v3.0 - Sistema Integral de Gestión Empresarial

**Sistema ERP profesional para EvoBike Colombia** con autenticación segura, gestión multi-usuario, multi-sucursal, panel de leads visual tipo Notion, servicio técnico integrado y bodega en tiempo real.

**Desarrollado en:** Node.js + Express + React.js + SQLite

---

## ✨ Características Principales v3.0

### 🔐 Seguridad y Autenticación
- ✅ Login con JWT (tokens seguros de 24h)
- ✅ Contraseñas cifradas con bcryptjs
- ✅ Sesiones automáticas
- ✅ Protección de rutas en frontend y backend

### 👥 Multi-usuario y Multi-sucursal
- ✅ Crear múltiples sucursales/sedes
- ✅ Usuarios por sucursal con roles específicos
- ✅ Datos completamente aislados por sucursal
- ✅ Admin puede ver todas las sucursales

### 💬 Panel de Leads Tipo Notion (Nuevo!)
- ✅ **Tablero Kanban visual** con drag & drop
- ✅ 6 estados: Nuevo → Contactado → Interesado → Negociado → Cerrado → Descartado
- ✅ Sistema de prioridades: Alta/Media/Baja
- ✅ Filtros avanzados: Estado, Prioridad, Red Social, Mes
- ✅ Información completa: Nombre, Teléfono, Email, Red, Consulta

### 🔧 Servicio Técnico Integrado (Nuevo!)
- ✅ Registro completo de reparaciones
- ✅ Asignación a técnicos específicos
- ✅ Estados de progreso con prioridades
- ✅ Gestión de costos (estimado vs final)
- ✅ Integración con bodega de repuestos

### 📦 Bodega Conectada en Tiempo Real (Nuevo!)
- ✅ Inventario con stock actualizado constantemente
- ✅ Registro de compras a proveedores
- ✅ Stock se resta automáticamente por: ventas, servicios técnicos
- ✅ Alertas de stock bajo/crítico
- ✅ Historial completo de transacciones

### 💰 Gestión Integral
- ✅ Ventas con múltiples items
- ✅ Entregas con seguimiento
- ✅ Caja diaria
- ✅ Gastos operacionales
- ✅ Reporte por sucursal

---

## ⚡ Inicio Rápido en 2 Minutos

### 1. Backend
```bash
cd backend
npm install
npm start
```
✅ Backend en `http://localhost:4000`

### 2. Frontend (en otra terminal)
```bash
cd frontend
npm install
npm start
```
✅ Frontend en `http://localhost:3000`

### 3. Login
```
Email: admin@evobike.com
Contraseña: admin123
```

---

## 📚 Documentación

| Archivo | Descripción |
|---------|-----------|
| **README.md** | Este archivo - Descripción general |
| **QUICK_START.md** | Guía de inicio rápido con ejemplos |
| **MEJORAS_RESUMEN.md** | Detalle técnico de todas las mejoras |
| **GUIAS_USO_DETALLADAS.md** | Tutorial completo con casos de uso |
| **README_v3.md** | Documentación técnica exhaustiva |

---

## 🗂️ Estructura del Proyecto

```
evobike-erp/
├── backend/
│   ├── server.js           (API Express + JWT + SQLite)
│   ├── package.json        (Dependencias)
│   ├── evobike.db          (Base de datos - generada automáticamente)
│   └── .env.example        (Variables de entorno)
│
├── frontend/
│   ├── src/
│   │   ├── App.js          (Aplicación principal)
│   │   ├── api.js          (Cliente API con autenticación)
│   │   ├── constants.js    (Constantes del sistema)
│   │   ├── index.js        (Entry point)
│   │   ├── pages/
│   │   │   └── Login.js    (Pantalla de login)
│   │   └── components/
│   │       ├── UI.js       (Componentes reutilizables)
│   │       └── LeadsPanel.js (Tablero Kanban de leads)
│   ├── public/
│   │   └── index.html
│   ├── package.json        (Dependencias)
│   └── .env.example        (Variables de entorno)
│
├── DOCUMENTACIÓN/
│   ├── README.md           (Este archivo)
│   ├── QUICK_START.md      (Inicio rápido)
│   ├── MEJORAS_RESUMEN.md  (Cambios técnicos)
│   └── GUIAS_USO_DETALLADAS.md (Tutoriales)
│
├── .gitignore              (Archivos ignorados por git)
└── package.json            (Opcional - raíz del proyecto)
```

---

## 🎯 Flujos Principales

### 📍 Flujo: Lead → Venta → Entrega
```
1. Lead llega por red social (Facebook, Instagram, WhatsApp, etc)
2. Se registra en el tablero Kanban
3. Vendedor lo mueve entre estados (Nuevo → Contactado → Interesado → etc)
4. Cuando se cierra la venta → Se genera automáticamente:
   - Venta registrada
   - Cliente creado
   - Entrega generada
5. Stock de bodega se actualiza automáticamente
6. Ingreso registrado en Caja
```

### 🔧 Flujo: Servicio Técnico con Bodega
```
1. Cliente llama con problema (moto no enciende, hace ruido, etc)
2. Se registra Servicio Técnico
3. Se asigna a técnico específico y se define prioridad
4. Técnico toma repuestos de la Bodega
5. Stock se resta automáticamente
6. Se registran costos estimado y final
7. Se cobra en Caja
8. Servicio finalizado
```

### 🏢 Flujo: Multi-sucursal
```
ADMIN crea sucursal → Admin crea usuarios → Usuarios solo ven su sucursal
                                              ├─ Leads de su sucursal
                                              ├─ Ventas de su sucursal
                                              ├─ Inventario de su sucursal
                                              └─ Servicios de su sucursal
```

---

## 🔐 Autenticación y Seguridad

### JWT (JSON Web Tokens)
- Tokens válidos por **24 horas**
- Se almacenan en `localStorage`
- Se envían en header `Authorization: Bearer <token>`
- Se validan en cada petición

### Contraseñas
- Alojadas con **bcryptjs**
- Nunca se almacenan en texto plano
- Validadas en cada login

### Protección
- ✅ CORS configurado
- ✅ Validación de entrada
- ✅ Filtrado de datos por usuario
- ✅ Middleware de autenticación en todas las rutas

---

## 📊 Base de Datos

**Motor:** SQLite (base de datos embebida, ideal para desarrollo)

### Tablas principales:
- **sucursales** - Sedes/sucursales del negocio
- **usuarios** - Usuarios del sistema con roles
- **roles** - Definición de permisos
- **leads** - Leads de redes sociales (con prioridades)
- **ventas** - Registro de ventas
- **entregas** - Seguimiento de entregas
- **servicios** - Servicios técnicos
- **inventario** - Stock de productos
- **ingresos_inventario** - Compras a proveedores
- **cajas** - Caja diaria y movimientos

**Total de tablas:** 20+

---

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** v18+
- **Express** - Framework web
- **SQLite3** - Base de datos
- **JWT** - Autenticación segura
- **bcryptjs** - Cifrado de contraseñas
- **CORS** - Compartir recursos entre dominios
- **UUID** - IDs únicos

### Frontend
- **React** v18
- **Fetch API** - Comunicación con backend
- **CSS-in-JS** - Estilos inline
- **LocalStorage** - Persistencia de sesiones

---

## 📱 Características Técnicas

### Performance
- Tokens JWT (sin sesiones en servidor)
- Filtrado de datos en backend
- Lazy loading en frontend
- Respuesta rápida en actualizaciones

### Usabilidad
- Interfaz intuitiva
- Drag & drop en tablero de leads
- Edición rápida de campos
- Respuesta automática del sistema

### Escalabilidad
- Multi-sucursal implementado
- Estructura modular
- API RESTful escalable
- Base de datos normalizada

---

## 📋 Requisitos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **Git** para clonar el repositorio
- **Browser moderno** (Chrome, Firefox, Safari, Edge)

---

## 🔧 Variables de Entorno

### Backend (.env)
```
JWT_SECRET=tu-secret-seguro-aqui
PORT=4000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:4000/api
```

---

## 🛠️ Comandos Útiles

### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Modo desarrollo con nodemon
```

### Frontend
```bash
npm start          # Iniciar en modo desarrollo
npm run build      # Build para producción
```

### Git
```bash
git status         # Ver cambios
git add .          # Agregar cambios
git commit -m ""   # Fazer commit
git push           # Subir a repositorio
```

---

## 🎓 Documentación de Módulos

### 💬 Panel de Leads
→ Ver `GUIAS_USO_DETALLADAS.md` - Sección "Panel de Leads"

### 🔧 Servicios Técnicos
→ Ver `GUIAS_USO_DETALLADAS.md` - Sección "Servicios Técnicos"

### 📦 Bodega / Inventario
→ Ver `GUIAS_USO_DETALLADAS.md` - Sección "Bodega / Inventario"

### 👥 Multi-sucursal
→ Ver `GUIAS_USO_DETALLADAS.md` - Sección "Multi-sucursal"

---

## 🚨 Solución de Problemas

### Backend no inicia
```bash
cd backend
rm evobike.db
npm install
npm start
```

### Frontend con errores
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### No puedo loguear
Credenciales demo incluidas:
- Email: `admin@evobike.com`
- Contraseña: `admin123`

### Base de datos corrupta
```bash
# Elimina la BD y se crea nueva automáticamente
rm backend/evobike.db
npm start  # en backend
```

---

## 📈 Próximos Pasos (Opcionales)

1. 📊 **Reportes avanzados** - Gráficas, exportar a Excel
2. 📧 **Notificaciones** - Email/SMS automáticos
3. 📱 **Aplicación móvil** - React Native
4. 🔗 **Integraciones** - APIs externas
5. 💳 **POS integrado** - Terminal de venta
6. 🌐 **Multi-idioma** - Soporte para otros idiomas

---

## 📞 Contacto y Soporte

**EvoBike ERP v3.0**
- Desarrollado para: EvoBike Colombia
- Ubicación: Cali, Valle del Cauca
- Versión: 3.0 - Sistema Integral

---

## 📄 Licencia

Este proyecto es código cerrado y propiedad de EvoBike Colombia.

---

## ✅ Checklist de Deployment

- [ ] Cambiar `JWT_SECRET` en `.env`
- [ ] Configurar `REACT_APP_API_URL` para producción
- [ ] Hacer backup de base de datos
- [ ] Configurar HTTPS en servidor
- [ ] Activar CORS solo para dominios autorizados
- [ ] Crear variables de entorno en servidor
- [ ] Hacer tests de funcionalidad
- [ ] Documentar credenciales de admin

---

## 🎉 ¡Listo para Usar!

EvoBike ERP v3.0 es un sistema profesional, seguro y escalable.

**¡Dispuesto para producción!** 🚀

---

**Última actualización:** Abril 8, 2026
**Versión:** 3.0  
**Estado:** ✅ Producción

npm install
npm start
```

La aplicación abre automáticamente en **http://localhost:3000**

---

## 📦 Módulos del Sistema

| Módulo | Descripción |
|--------|-------------|
| 🏠 Dashboard | KPIs en tiempo real: ventas, utilidad, conversión, alertas |
| 💬 Leads RRSS | Instagram, TikTok, WhatsApp con campañas y vista Kanban |
| 💰 Ventas | Detalle, mayorista y exclusivo con datos completos del cliente |
| 🚚 Entregas | Seguimiento con transportadora, guía y valor de envío |
| 📦 Inventario | Motos y accesorios con precios editables directamente |
| 📥 Ing. Inventario | Ingreso de mercancía con proveedor y factura |
| 🔧 Serv. Técnico | Reparaciones por motivo, técnico y costo |
| 🏪 Distribuidores | Mayoristas/Exclusivos con precios diferenciados y pedidos |
| 👥 Clientes | Base de datos automática desde ventas |
| 🏦 Caja & Gastos | Flujo de caja, gastos operativos y cierre diario |
| ⚙️ Configuración | Campañas, colores de alertas, agregar motos y accesorios |

## 🔧 Despliegue en Producción

### Variables de Entorno

Backend (`backend/.env`):
```
PORT=4000
```

Frontend (`frontend/.env`):
```
REACT_APP_API_URL=http://TU_SERVIDOR:4000/api
```

### Build para producción

```bash
cd frontend
npm run build
```

Los archivos estáticos quedan en `frontend/build/` y pueden
servirse con Nginx, Vercel, Netlify o cualquier hosting estático.

---

## 💡 Tips de Uso

- **Editar precios en inventario**: haz click directamente sobre cualquier precio
- **Ajustar stock**: usa los botones `+` y `−` en la tabla de inventario
- **Agregar campañas**: ve a Configuración → Gestión de Campañas
- **Cambio de estado en entregas/servicios**: dropdown directo en la tabla
- **Tasa de conversión**: se calcula automáticamente desde los leads

---

**EvoBike ERP** · Desarrollado para el equipo eCommerce de EvoBike Cali 🇨🇴
