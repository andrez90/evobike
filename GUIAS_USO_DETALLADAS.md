# 📖 GUÍAS DE USO - EvoBike ERP v3.0

## 1️⃣ CÓMO USAR: LOGIN Y AUTENTICACIÓN

### Primer acceso:
1. Ve a http://localhost:3000
2. Verás pantalla de login
3. Email: `admin@evobike.com`
4. Contraseña: `admin123`
5. Click "Iniciar Sesión"

### ¿Qué pasa con tu sesión?
- ✅ Se genera TOKEN JWT válido por 24h
- ✅ Se almacena en localStorage
- ✅ Si cierras y abres navegador → sigue logeado
- ✅ Si el token expira → Debes loguear de nuevo
- ✅ Click "Salir" → Cierra sesión inmediatamente

---

## 2️⃣ CÓMO USAR: PANEL DE LEADS TIPO NOTION

### Acceder al panel:
1. Click menú "💬 Leads RRSS"
2. Verás tablero con 6 columnas:
   - Nuevo
   - Contactado
   - Interesado
   - Negociado
   - Cerrado
   - Descartado

### Agregar un nuevo lead:
1. Click botón "+ Nuevo Lead" (arriba)
2. Completa el formulario:
   - **Nombre**: Nombre del cliente
   - **Teléfono**: Contacto
   - **Email**: Correo opcional
   - **Red Social**: De dónde vino (Facebook, Instagram, etc)
   - **Consulta**: Qué preguntó
   - **Prioridad**: Alta/Media/Baja
3. Click "Agregar Lead"

### Mover lead entre estados:
1. Abre panel de leads
2. Selecciona un lead
3. **ARRASTRA** con el mouse a otra columna
4. Se guarda automáticamente

### Hacer más rápido:
1. **Click derecho** en una tarjeta → opciones rápidas
2. **Doble click** → editar lead
3. **Click X** → eliminar lead
4. **Click en círculo de prioridad** → cambiar prioridad rápido

### Filtros:
1. Selecciona "Estado" → filtra por estado
2. Selecciona "Prioridad" → solo leads altos, medios, bajos
3. Selecciona "Red" → solo de Facebook, Instagram, etc
4. Selecciona "Mes" → leads de ese mes
5. Click "Limpiar filtros" → ve todos de nuevo

### Ejemplo de flujo:
```
NUEVO → Cliente pregunta en Facebook
     ↓
CONTACTADO → Vendedor llama al cliente
     ↓
INTERESADO → Cliente muestra interés en moto
     ↓
NEGOCIADO → Hablan precio
     ↓
CERRADO → Se vende + Se crea Venta
     ↓
Y automáticamente se registra:
- Cliente en base de datos
- Entrega (si aplica)
- Actualizaciones en bodega
```

---

## 3️⃣ CÓMO USAR: SERVICIOS TÉCNICOS

### Registrar nuevo servicio:
1. Click menú "🔧 Serv. Técnico"
2. Click "+ Nuevo Servicio"
3. Completa:
   - **Cliente**: Nombre de quién trae la moto
   - **Teléfono**: Contacto
   - **Modelo**: Aurora, Águila, etc
   - **Motivo**: "No enciende", "Hace ruido", etc
   - **Descripción**: Detalles del problema
   - **Prioridad**: Alta/Media/Baja
4. Click "Registrar Servicio"

### Asignar técnico:
1. Ve a "Serv. Técnico"
2. Selecciona el servicio
3. Click "Editar"
4. Campo "Técnico": Asigna a Juan, Carlos, etc
5. Guarda

### Manejar los costos:
1. Durante reparación:
   - Costo Estimado: $500.000
2. Cuando termina:
   - Costo Final: $520.000 (estimado + adicionales)
3. Se registra en Caja automáticamente

### Usar repuestos de bodega:
1. En el servicio, puedes agregar items:
   - Batería $150.000
   - Alternador $300.000
2. Cuando agregas → Stock de bodega se RESTA automáticamente
3. Si no hay stock → Te avisa "Stock bajo"

### Estados del servicio:
```
Recibido → Se recibe la moto
   ↓
En Reparación → Técnico está arreglando
   ↓
Finalizado → Listo para recoger
   ↓
Se paga en Caja
```

---

## 4️⃣ CÓMO USAR: BODEGA / INVENTARIO

### Ver inventario actual:
1. Click menú "📦 Inventario"
2. Verás tabla con:
   - Nombre del producto
   - Categoría (Moto, Accesorio, Pieza)
   - Stock actual
   - Precio público

### Agregar entrada de compra:
1. Click menú "📥 Bodega"
2. Click "+ Nuevo Ingreso"
3. Completa:
   - **Proveedor**: De dónde compras (Distribuidor ABC)
   - **Factura**: Número de factura
   - **Items**: Agrega productos
     - Producto: Aurora
     - Cantidad: 5 unidades
     - Costo: $3.000.000 c/u
4. Click "Guardar"

### ¿Qué pasa al guardar?
- ✅ Se suma al stock automáticamente
- ✅ Stock Aurora: 8 → 13
- ✅ Queda registrado historial de compra
- ✅ Se calcula costo total de entrada

### Stock se resta automáticamente por:

**Por Venta:**
```
1. Se registra venta de 3 Aurora
2. Stock Aurora: 13 → 10
3. Automático, sin hacer nada
```

**Por Servicio Técnico:**
```
1. Se registra servicio con 2 Baterías
2. Stock Batería: 6 → 4
3. Automático, sin hacer nada
```

### Ver alertas de stock:
```
🟢 Verde: Stock normal
🟠 Naranja: Stock bajo (cerca del mínimo)
🔴 Rojo: Stock crítico (muy bajo)
```

### Ajustar stock manualmente:
1. Si hay error en conteo
2. Click "Ajustar Stock"
3. Ingresa cantidad a sumar o restar
4. Se actualiza inmediatamente

### Historial de ingresos:
1. Click menú "📥 Bodega"
2. Verás lista de todas las compras hechas
3. Puedes ver:
   - Fecha de compra
   - Proveedor
   - Cantidad de items
   - Costo total

---

## 5️⃣ CÓMO USAR: MULTI-SUCURSAL

### Como Admin, crear sucursal:
1. Click "⚙️ Configuración"
2. Busca "Sucursales"
3. Click "+ Nueva Sucursal"
4. Datos:
   - **Nombre**: Cali Principal, Bogotá Sur, etc
   - **Ciudad**: Cali, Bogotá, etc
   - **Dirección**: Carrera 5 # 12-45
   - **Teléfono**: 3154582000
   - **Email**: cali@evobike.com
   - **Gerente**: Nombre del gerente
5. Click "Crear"

### Como Admin, crear usuario para sucursal:
1. Click "⚙️ Configuración"
2. Busca "Usuarios"
3. Click "+ Nuevo Usuario"
4. Datos:
   - **Email**: vendedor@evobike.com
   - **Contraseña**: Pass segura
   - **Nombre**: Juan García
   - **Rol**: vendedor (o técnico, bodeguero)
   - **Sucursal**: Cali Principal
5. Click "Crear"

### Resultado:
- Juan solo ve leads de CALI
- Juan solo ve ventas de CALI
- Juan solo ve inventario de CALI
- El admin ve TODAS las sucursales
- Los reportes son independientes

### Diferentes usuarios por rol:
```
ADMIN
└─ Ve todo
  └─ Puede crear sucursales
  └─ Puede crear usuarios
  └─ Acceso a configuración

VENDEDOR (Por sucursal)
├─ Ve leads de su sucursal
├─ Puede registrar ventas
├─ Ve clientes
└─ Acceso a Caja básico

TÉCNICO (Por sucursal)
├─ Ve servicios técnicos
├─ Puede usar repuestos
├─ Registra costos
└─ Acceso a Bodega para repuestos

BODEGUERO (Por sucursal)
├─ Ve inventario completo
├─ Registra ingresos de compras
├─ Autoriza salidas
└─ Ajusta stock
```

---

## 6️⃣ FLUJO COMPLETO: LEAD → VENTA → FACTURA

### Paso 1: Lead llega
```
Cliente: "¿Cuál es el precio de la Aurora?"
Fuente: Instagram

Vendedor:
1. Va a panel de Leads
2. Click "+ Nuevo Lead"
3. Nombre: "Carlos"
4. Teléfono: "312-345-6789"
5. Red: Instagram
6. Consulta: "Precio de Aurora"
7. Prioridad: Media
8. Click "Agregar"
```

### Paso 2: Vendedor contacta y avanza estado
```
Vendedor:
1. Lead aparece en "Nuevo"
2. Llama a Carlos
3. Carlos dice "Me interesa, ¿cuál es el precio?"
4. Vendedor ARRASTRA lead a "Contactado"
5. Luego a "Interesado" (Carlos quiere ver la moto)
6. Luego a "Negociado" (Hablan del precio)
```

### Paso 3: Se vende
```
Carlos compra 1 Aurora

Vendedor:
1. Va a panel de Ventas
2. Click "+ Nueva Venta"
3. Cliente: "Carlos"
4. Teléfono: "312-345-6789"
5. Producto: Aurora
6. Cantidad: 1
7. Precio unitario: $3.100.000
8. Método pago: Efectivo
9. ¿Con entrega? Sí
10. Dirección entrega: Carrera 5, Cali
11. Click "Registrar"
```

### Paso 4: Sistema actualiza automáticamente
```
Lo que pasó automáticamente:

✅ Lead se movió a "Cerrado"
✅ Se creó Cliente "Carlos" en base de datos
✅ Se registró Venta $3.100.000
✅ Se creó Entrega automática
✅ Stock Aurora: 8 → 7
✅ Se registró en Caja como ingreso
✅ Se puede ver en reportes de la sucursal
```

### Paso 5: Seguimiento de entrega
```
Gerente revisa entregas:
1. Va a menú "🚚 Entregas"
2. Busca entrega de Carlos
3. Estado: "Pendiente"
4. Asigna transportista: TCC
5. Ingresa guía: TCC-123456789
6. Click "Asignar"
7. Cuando llega: Cambia estado a "Entregado"
```

---

## 7️⃣ FLUJO: SERVICIO TÉCNICO CON BODEGA

### Paso 1: Cliente trae moto con problema
```
Cliente: "La moto no enciende desde ayer"

Recepcionista:
1. Va a Servicios Técnicos
2. Click "+ Nuevo Servicio"
3. Cliente: "Carlos López"
4. Teléfono: "312-345-6789"
5. Modelo: Aurora
6. Motivo: "No enciende"
7. Descripción: "No responde al encendedor"
8. Prioridad: Alta (no enciende = urgente)
9. Click "Registrar"
```

### Paso 2: Técnico revisa y diagnostica
```
Técnico Juan:
1. Ve servicio pendiente para Aurora
2. Revisa la moto
3. Problema: Batería descargada / Alternador dañado
4. Estima costo: $500.000
5. Va a la BODEGA y toma:
   - 1 Batería 48V ($150.000)
   - 1 Alternador ($300.000)
```

### Paso 3: Sistema actualiza stock
```
Cuando se registran los repuestos en el servicio:

Stock ANTES:
- Batería: 6 unidades
- Alternador: 2 unidades

Stock DESPUÉS:
- Batería: 5 unidades (6 - 1 usado)
- Alternador: 1 unidad (2 - 1 usado)

✅ Automático, no hay que hacer nada
```

### Paso 4: Serviciotermina
```
Técnico Juan:
1. Instala repuestos
2. Prueba la moto → Enciende ✅
3. Va al sistema
4. Servicio: Estado "Finalizado"
5. Costo final: $530.000
   (Estimado $500k + Mano de obra extra $30k)
6. Click "Guardar"
```

### Paso 5: Se paga en Caja
```
Recepcionista:
1. Cliente paga $530.000 en EFECTIVO
2. Se va en la moto ✅
3. Dinero se registra en CAJA
4. Fin del servicio
```

### Resumen del flujo:
```
Entrada: Moto sin arrancar
   ↓
Diagnóstico: Batería + Alternador
   ↓
Se sacan de BODEGA:
   - Stock Batería: 6→5
   - Stock Alternador: 2→1
   ↓
Se arregla: Moto enciende ✅
   ↓
Se paga: $530.000
   ↓
Salida: Cliente contento + Dinero en Caja
```

---

## 8️⃣ CASOS ESPECIALES

### ¿Qué pasa si no hay stock?
```
Técnico necesita Batería pero Stock = 0

Sistema:
✅ Te avisa "Stock bajo/crítico"
✅ Puedes:
   a) Esperar a que llegue compra
   b) Decirle al cliente "Traemos batería"
   c) Usar similar con precio diferente
```

### ¿Qué si cambio de sucursal?
```
Vendedor A está en CALI
Vendedor B está en BOGOTÁ

Vendedor A:
- Ve leads de CALI solo
- Ve stock de CALI solo
- Ve ventas de CALI solo

Si Vendedor A se mueve a BOGOTÁ:
- Debe crearse nuevo usuario
- O Admin actualiza sucursalId
```

### ¿Qué si me cierro sesión?
```
Click "Salir"
  ↓
Sesión cierra
  ↓
Vuelves a login
  ↓
Ingresa email y contraseña
  ↓
Se genera nuevo TOKEN
```

### ¿Token expiró?
```
Después de 24 horas:
  ↓
Sistema detecta token expirado
  ↓
Redirige a LOGIN
  ↓
Debes loguear de nuevo
```

---

## 9️⃣ TIPS Y TRUCOS

### ⚡ Acciones rápidas en Leads:
- **Drag & drop**: Arrastrar lead a otra columna
- **Doble click**: Editar lead rápido
- **Click en prioridad**: Cambiar prioritario en 1 click
- **Click X**: Eliminar lead

### 📊 Cómo leer el tablero:
```
┌──────────────────────────────────────┐
│ NUEVO (10)     ← 10 leads nuevos
│ ┌──────────────┐
│ │ Carlos       │ ← Prioridad ALTA (rojo)
│ │ 312-345-6789 │
│ │ Instagram    │
│ └──────────────┘
│ ┌──────────────┐
│ │ María        │ ← Prioridad BAJA (verde)
│ │ 313-111-2222 │
│ │ Facebook     │
│ └──────────────┘
└──────────────────────────────────────┘
```

### 💾 Datos se guardan automáticamente:
- ✅ Drag & drop de leads → se guarda
- ✅ Cambio de prioridad → se guarda
- ✅ Nueva venta → se guarda
- ✅ Servicio técnico → se guarda
- ✅ Stock se actualiza → se guarda

### 🔍 Antes de cerrar el navegador:
- Verifica que los cambios se vieron
- Si hay spinner → espera a que termine
- Si hay error → intenta de nuevo

---

## 📞 SOPORTE

Si algo no funciona:
1. Recarga la página (F5)
2. Si falla backend: Reinicia con `npm start`
3. Si falla frontend: Verifica console (F12)
4. Verifica que backend esté en puerto 4000
5. Verifica que frontend esté en puerto 3000

¡Listo! ✅ Sabe cómo usar EvoBike ERP v3.0
