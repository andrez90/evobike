# 🚀 EvoBike ERP v3.0 - INICIO RÁPIDO

## 📝 Resumen de Mejoras

✅ **Autenticación JWT** - Login seguro con tokens
✅ **Multi-usuario** - Múltiples usuarios por sucursal
✅ **Multi-sucursal** - Gestión independiente de sucursales
✅ **Panel de Leads tipo Notion** - Tablero Kanban visual con drag & drop
✅ **Servicio Técnico Mejorado** - Con asignación de técnicos y costos
✅ **Bodega Integrada** - Inventario sincronizado con servicios y ventas
✅ **Permisos por Rol** - Admin, Vendedor, Técnico

---

## ⚡ INICIO EN 2 MINUTOS

### Terminal 1: Backend
```bash
cd backend
npm install
npm start
```
✅ Backend listo en http://localhost:4000

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm start
```
✅ Frontend abierto en http://localhost:3000

---

## 🔐 LOGIN DEMO

**Email:** admin@evobike.com
**Contraseña:** admin123

---

## 📊 QUÉ PUEDES HACER

### 💬 Panel de Leads (Nuevo!)
- Ver leads en tablero Kanban con 6 estados
- Arrastrar leads entre estados
- Cambiar prioridades (Alta, Media, Baja)
- Filtrar por: Estado, Prioridad, Red Social, Mes
- Cada lead muestra: Nombre, Teléfono, Email, Red, Consulta

### 🔧 Servicios Técnicos (Nuevo!)
- Registrar reparaciones con estado de progreso
- Asignar a técnicos específicos
- Gestionar costos estimado vs final
- Conectado con bodega de repuestos
- Prioridades de urgencia

### 📦 Bodega (Nuevo!)
- Gestionar inventario de motos y accesorios
- Registrar ingresos de compras
- Stock se actualiza automáticamente:
  - Por ventas
  - Por servicios técnicos
- Alertas de stock bajo/crítico

### 💰 Ventas
- Registrar ventas con múltiples items
- Integración con entregas
- Cálculo automático de totales
- Crear cliente automáticamente

### 🚚 Entregas
- Seguimiento con transportadora
- Estados: Pendiente, En tránsito, Entregado
- Linked con ventas

### 👥 Gestión de Usuarios (Admin)
- Crear nuevos usuarios
- Asignar a sucursales
- Definir roles

### 🏢 Gestión de Sucursales (Admin)
- Crear sucursales
- Cada sucursal tiene datos independientes

---

## 🗄️ NUEVO: Flujo Multi-Sucursal

1. **Admin** crea nueva sucursal
2. **Admin** crea usuarios asignados a esa sucursal
3. **Vendedores** en esa sucursal solo ven:
   - Sus propios leads
   - Sus propias ventas
   - Su inventario
   - Sus servicios técnicos
4. Cada sucursal tiene reporte independiente

---

## 🎯 NUEVOS MÓDULOS

### 1. Panel de Leads Tipo Notion
```
┌─────────────┬──────────────┬────────────┬──────────┐
│   NUEVO     │  CONTACTADO  │ INTERESADO │ NEGOCIADO│
├─────────────┼──────────────┼────────────┼──────────┤
│ ┌─────────┐ │ ┌──────────┐ │            │          │
│ │Lead #1  │ │ │Lead #3   │ │            │          │
│ │Juan     │ │ │Maria     │ │            │          │
│ │312xxxx  │ │ │313xxxx   │ │            │          │
│ │Facebook │ │ │Instagram │ │            │          │
│ └─────────┘ │ └──────────┘ │            │          │
│             │              │            │          │
│ ┌─────────┐ │              │            │          │
│ │Lead #2  │ │              │            │          │
│ │Carlos   │ │              │            │          │
│ │314xxxx  │ │              │            │          │
│ │TikTok   │ │              │            │          │
│ └─────────┘ │              │            │          │
└─────────────┴──────────────┴────────────┴──────────┘
```

### 2. Servicio Técnico Completo
```
Solicitud → En Reparación → Finalizado
  ├─ Cliente
  ├─ Modelo
  ├─ Motivo
  ├─ Técnico Asignado
  ├─ Repuestos de Bodega
  ├─ Costo Estimado/Final
  └─ Prioridad (Alta/Media/Baja)
```

### 3. Bodega Integrada
```
Inventario → +Entradas de Compra
            → -Salidas por Venta
            → -Salidas por Servicio
            = Stock Actual (Real time)
```

---

## 🔄 FLUJOS PRINCIPALES

### Flujo Lead → Venta
```
1. Lead llega por Facebook/Instagram/WhatsApp
2. Se agrega al tablero Kanban (Estado: Nuevo)
3. Vendedor lo marca "Contactado"
4. Si interesado → "Interesado"
5. Negociar → "Negociado"
6. Si se vende → "Cerrado" + se crea VENTA
7. Venta genera ENTREGA automática
8. Entrega actualiza BODEGA
```

### Flujo Reparación con Bodega
```
1. Cliente llama con moto dañada
2. Se registra SERVICIO TÉCNICO
3. Se asigna TÉCNICO
4. Técnico trae REPUESTOS de BODEGA
5. BODEGA actualiza stock automáticamente
6. Se cobra en CAJA
```

---

## 📱 ACCESO MULTI-DISPOSITIVO

Usa el mismo login:
- 💻 PC/Laptop
- 📱 Tablet
- 📲 Celular (responsive)

---

## 🎨 INTERFAZ VISUAL

### Colores por Prioridad de Lead
- 🔴 **ALTA** = Rojo (#ef4444)
- 🟠 **MEDIA** = Naranja (#f97316)
- 🟢 **BAJA** = Verde (#10b981)

### Estados de Entrega
- 🟡 Pendiente
- 🔵 En tránsito
- 🟢 Entregado

---

## ⚙️ CONFIGURACIÓN

### Cambiar datos de usuario
```
En Configuración → tu perfil
Admin puede crear nuevos usuarios
```

### Cambiar sucursal (Admin)
```
En Configuración → Gestión de Sucursales
```

### Ver base de datos
```
backend/evobike.db (SQLite)
```

---

## 🚨 SI ALGO FALLA

### Backend falla
```bash
cd backend
rm evobike.db
npm install
npm start
```

### Frontend tiene errores
```bash
cd frontend
rm node_modules package-lock.json
npm install
npm start
```

### No puedo loguear
```
Email: admin@evobike.com
Contraseña: admin123
(Credenciales demo incluidas)
```

---

## 🎓 PRÓXIMOS PASOS

1. ✅ Familiarízate con el tablero Kanban de leads
2. ✅ Registra un lead y muévelo entre estados
3. ✅ Crea una venta
4. ✅ Verifica que el inventario se actualizó
5. ✅ Registra un servicio técnico
6. ✅ Usa la bodega para un ingreso

---

## 💡 TIPS

- 🎯 **Tablero visual**: Mejor que tablas para ver estado de leads
- 🚀 **Drag & drop**: Arrastra leads entre columnas
- ⚡ **Stock real**: Se actualiza instantáneamente
- 👥 **Múltiples usuarios**: Cada uno ve su sucursal
- 🔐 **Seguro**: Contraseñas cifradas, tokens JWT

---

## 🎉 ¡LISTO PARA USAR!

El sistema está listo para producción con:
- ✅ Autenticación segura
- ✅ Multi-usuario y multi-sucursal
- ✅ Panel visual de leads
- ✅ Servicio técnico integrado
- ✅ Bodega conectada

¡Disfruta tu nuevo EvoBike ERP v3.0! 🏍️⚡
