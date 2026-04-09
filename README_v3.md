# 🏍️ EvoBike ERP v3.0 - Sistema Multiempresa Mejorado

Sistema ERP completo para EvoBike Colombia con **autenticación, multi-usuario, multi-sucursal, panel de leads tipo Notion, servicio técnico y bodega integrados**.

**Documentación en Español** 🇨🇴

## 🚀 Nuevas Características v3.0

### ✅ Autenticación y Seguridad
- **Login con JWT**: Autenticación segura con tokens JWT
- **Contraseñas cifradas**: Uso de bcryptjs para máxima seguridad
- **Gestión multi-usuario**: Diferentes roles y permisos
- **Sesiones seguras**: Token de 24 horas con validación en cada petición

### 🏢 Multi-sucursal / Multi-empresa
- **Gestión de sucursales**: Crear y administrar múltiples sucursales
- **Datos aislados por sucursal**: Cada sucursal ve solo sus datos
- **Usuarios por sucursal**: Asignar usuarios a sucursales específicas
- **Reportes por sucursal**: Análisis independiente de cada ubicación

### 💬 Panel de Leads Tipo Notion
- **Tablero Kanban visual**: Organización visual de leads por estado
- **Drag & drop**: Mover leads entre estados fácilmente
- **Sistema de prioridades**: Alta, Media, Baja con colores indicadores
- **Filtros avanzados**: Por estado, prioridad, red social, mes
- **Vista ordenada**: Información clara y accesible

### 🔧 Servicio Técnico Mejorado
- **Gestión de reparaciones**: Registro completo de servicios
- **Asignación a técnicos**: Distribuir trabajo entre técnicos
- **Estados de servicio**: Recibido → En Reparación → Finalizado
- **Prioridades**: Sistema de urgencias
- **Costos**: Estimado vs Final
- **Conexión con bodega**: Piezas y repuestos disponibles

### 📦 Bodega / Inventario Integrado
- **Gestión de inventario**: Stock en tiempo real
- **Ingresos de compras**: Registrar nuevos productos
- **Salidas por servicio**: Deducir repuestos de servicios técnicos
- **Salidas por venta**: Control automático de stock
- **Categorías de productos**: Motos, accesorios, piezas

### 👥 Gestión de Usuarios
- **Roles de usuario**: Admin, Vendedor, Técnico, Bodeguero
- **Permisos granulares**: Control fino de accesos
- **Crear usuarios**: Admin puede crear nuevos usuarios
- **Asignar a sucursales**: Cada usuario tiene una sucursal asignada

---

## 📋 Requisitos

- **Node.js** v18 o superior → https://nodejs.org
- **npm** v9 o superior
- **Browser moderno** para el frontend

---

## 🚀 Instalación

### 1️⃣ Backend (API + Base de Datos)

```bash
cd backend
npm install
npm start
```

El servidor arranca en **http://localhost:4000**

**Datos de demo:**
- Email: `admin@evobike.com`
- Contraseña: `admin123`

### 2️⃣ Frontend (React)

```bash
cd frontend
npm install
npm start
```

La aplicación abre en **http://localhost:3000**

---

## 🗄️ Estructura de BD

```sql
-- Usuarios y Seguridad
sucursales           → Gestión de sucursales
usuarios             → Usuarios del sistema
roles                → Roles y permisos

-- Gestion de Leads
leads                → Leads de redes sociales (Kanban)
campaigns            → Campañas de marketing

-- Gestión de Ventas
ventas               → Registro de ventas
venta_items          → Items de cada venta
clientes             → Base de clientes

-- Servicios Técnicos
servicios            → Solicitudes de servicio
servicio_items       → Repuestos utilizados en servicio

-- Bodega / Inventario
inventario           → Productos disponibles
ingresos_inventario  → Compras/ingresos
ingreso_items        → Items de cada ingreso

-- Entregas
entregas             → Control de entregas

-- Finanzas
cajas                → Caja diaria
gastos               → Gastos operacionales

-- Distribuidores
distribuidores       → Base de distribuidores
pedidos_distribuidor → Pedidos a mayoristas
```

---

## 🔐 Autenticación

### Login
```javascript
POST /api/auth/login
{
  "email": "admin@evobike.com",
  "contraseña": "admin123"
}
```

### Respuesta
```json
{
  "ok": true,
  "data": {
    "usuario": {
      "id": "uuid",
      "email": "admin@evobike.com",
      "nombre": "Admin",
      "rol": "admin",
      "sucursalId": "uuid"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Usar Token
```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📊 Módulos Principales

### 1. Dashboard
- Resumen de KPIs
- Leads totales
- Ventas del día
- Entregas pendientes
- Servicios activos

### 2. Leads (Kanban)
- Tablero visual con 6 estados
- Drag & drop entre columnas
- Filtros de estado, prioridad, red, mes
- Edición rápida de campos
- Eliminación de leads

### 3. Ventas
- Registro de venta con items
- Conexión automática con entregas
- Cálculo de totales
- Métodos de pago
- Contacto en cliente automático

### 4. Entregas
- Registro de envíos
- Seguimiento con transportadora
- Estados: Pendiente, En tránsito, Entregado
- Integración con ventas

### 5. Inventario
- Vista global de stock
- Precios: Público, Mayorista, Exclusivo
- Categorías: Motos, Accesorios, Piezas
- Alertas de stock bajo

### 6. Bodega (Ingresos)
- Registro de compras a proveedores
- Ingreso de inventario por factura
- Actualización automática de stock
- Historial de compras

### 7. Servicio Técnico
- Solicitudes de reparación
- Asignación a técnicos
- Estados de progreso
- Costos estimado vs final
- Integración con bodega de repuestos
- Prioridades

### 8. Distribuidores
- Base de distribuidores mayoristas
- Pedidos especiales
- Historial de compras
- Estados de pedidos

### 9. Cajas
- Caja diaria
- Ingresos por ventas
- Egresos por compras
- Egresos por gastos
- Cálculo automático

### 10. Configuración
- Gestión de usuarios
- Gestión de sucursales
- Datos del usuario actual
- Cerrar sesión

---

## 🎯 Flujos Principales

### Flujo de Lead a Cliente a Venta
```
1. Lead entra por redes sociales
2. Se registra en panel Kanban
3. Vendedor mueve entre estados
4. Cuando se vende → se convierte a Cliente
5. Se registra Venta
6. Se genera Entrega (opcional)
7. Se registra en Caja
```

### Flujo de Servicio Técnico con Bodega
```
1. Cliente llama con problema
2. Se registra Servicio Técnico
3. Asignar técnico
4. Técnico revisa y estima costo
5. Si hay repuestos → se sacan de Bodega
6. Se actualiza inventario automáticamente
7. Finalizar servicio
8. Registrar costo final
9. Registrar en Caja
```

### Flujo de Inventario en Bodega
```
1. Compra a proveedor
2. Registrar ingreso de inventario
3. Items se agregan al stock
4. Al vender → stock se reduce
5. Al servicio técnico → stock se reduce
6. Alertas cuando stock crítico
```

---

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar usuario
- `GET /api/auth/me` - Obtener usuario actual

### Leads
- `GET /api/leads` - Listar leads
- `GET /api/leads/filtro` - Filtrar leads
- `POST /api/leads` - Crear lead
- `PUT /api/leads/:id` - Actualizar lead
- `PATCH /api/leads/:id/estado` - Cambiar estado
- `PATCH /api/leads/:id/prioridad` - Cambiar prioridad
- `DELETE /api/leads/:id` - Eliminar lead

### Servicios Técnicos
- `GET /api/servicios` - Listar servicios
- `POST /api/servicios` - Crear servicio
- `PATCH /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### Bodega / Ingresos
- `GET /api/ingresos-inventario` - Listar ingresos
- `POST /api/ingresos-inventario` - Crear ingreso
- `PATCH /api/inventario/:id/stock` - Ajustar stock

---

## 💡 Consejos de Uso

1. **Cambiar contraseña**: Edita directamente en BD después de login
2. **Crear sucursales**: Son creadas por admin solo
3. **Asignar usuarios**: Cada usuario debe tener une sucursal
4. **Stock crítico**: Configurable en el tema (stockCrit)
5. **Prioridades**: Rojo (alta), Naranja (media), Verde (baja)

---

## 🛠️ Mantenimiento

### Resetear BD
```bash
rm backend/evobike.db
npm start  # Se crea nueva BD con datos demo
```

### Cambiar Puerto Backend
```bash
PORT=5000 npm start
```

### Cambiar API URL Frontend
```bash
# En frontend/.env
REACT_APP_API_URL=http://api.produccion.com/api
```

---

## 📝 Notas Importantes

- ✅ JWT se almacena en localStorage
- ✅ Token expira en 24 horas
- ✅ Sesión se cierra automáticamente con login fallido
- ✅ Multi-sucursal: Los datos se filtran por sucursalId
- ✅ Bodega: Stock se actualiza automáticamente en ventas y servicios
- ✅ Leads: Pueden ser arrastrando entre estados en el tablero

---

## 🚀 Deployment

### Backend Production
```bash
export JWT_SECRET="tu-secret-seguro-largo"
export PORT=80
npm start
```

### Frontend Production
```bash
REACT_APP_API_URL=https://api.evobike.com npm run build
# Servir desde /frontend/build
```

---

## 📞 Soporte

EvoBike ERP v3.0 - Sistema mejorado con autenticación, multi-usuario y multi-sucursal.
¡Listo para producción! 🚀
