const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "evobike-secret-key-change-in-prod";

app.use(cors());
app.use(express.json());

// ─── BASE DE DATOS ────────────────────────────────────────────
const db = new Database(path.join(__dirname, "evobike.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS sucursales (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    ciudad TEXT,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    gerente TEXT,
    estado TEXT DEFAULT 'Activo'
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    contraseña TEXT NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT DEFAULT 'vendedor',
    sucursalId TEXT NOT NULL,
    estado TEXT DEFAULT 'Activo',
    fechaCreacion TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    permisos TEXT
  );

  CREATE TABLE IF NOT EXISTS inventario (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    tipo TEXT,
    sucursalId TEXT,
    precioPublico REAL DEFAULT 0,
    precioMayorista REAL DEFAULT 0,
    precioExclusivo REAL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    sucursalId TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    fecha TEXT,
    nombre TEXT,
    usuarioId TEXT,
    sucursalId TEXT,
    telefono TEXT,
    ciudad TEXT,
    email TEXT,
    red TEXT,
    modeloId TEXT,
    consulta TEXT,
    estado TEXT,
    campana TEXT,
    notas TEXT,
    tipo TEXT DEFAULT 'cliente',
    tipoDistribuidor TEXT,
    prioridad TEXT DEFAULT 'media',
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id),
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY,
    nombre TEXT,
    telefono TEXT,
    documento TEXT,
    email TEXT,
    ciudad TEXT,
    sucursalId TEXT,
    fechaRegistro TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS ventas (
    id TEXT PRIMARY KEY,
    fecha TEXT,
    clienteNombre TEXT,
    clienteTel TEXT,
    clienteDoc TEXT,
    clienteEmail TEXT,
    ciudad TEXT,
    red TEXT,
    campana TEXT,
    metodoPago TEXT,
    tipoVenta TEXT DEFAULT 'detalle',
    conEntrega INTEGER DEFAULT 0,
    direccion TEXT,
    transportadora TEXT,
    valorEnvio REAL DEFAULT 0,
    total REAL DEFAULT 0,
    entregaId TEXT,
    usuarioId TEXT,
    sucursalId TEXT,
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id),
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS venta_items (
    id TEXT PRIMARY KEY,
    ventaId TEXT,
    itemId TEXT,
    nombre TEXT,
    cantidad INTEGER,
    precioUnit REAL,
    FOREIGN KEY(ventaId) REFERENCES ventas(id)
  );

  CREATE TABLE IF NOT EXISTS entregas (
    id TEXT PRIMARY KEY,
    fecha TEXT,
    ventaId TEXT,
    clienteNombre TEXT,
    clienteTel TEXT,
    direccion TEXT,
    ciudad TEXT,
    modelo TEXT,
    estado TEXT DEFAULT 'Pendiente',
    transportadora TEXT,
    valorEnvio REAL DEFAULT 0,
    guia TEXT,
    notas TEXT,
    sucursalId TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS servicios (
    id TEXT PRIMARY KEY,
    fecha TEXT,
    clienteNombre TEXT,
    clienteTel TEXT,
    clienteDoc TEXT,
    modelo TEXT,
    motivo TEXT,
    descripcion TEXT,
    estado TEXT DEFAULT 'Recibido',
    tecnico TEXT,
    costoEstimado REAL DEFAULT 0,
    costoFinal REAL DEFAULT 0,
    notas TEXT,
    prioridad TEXT DEFAULT 'media',
    sucursalId TEXT,
    usuarioId TEXT,
    bodegaId TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id),
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS servicio_items (
    id TEXT PRIMARY KEY,
    servicioId TEXT,
    itemId TEXT,
    nombre TEXT,
    cantidad INTEGER,
    precioUnit REAL,
    FOREIGN KEY(servicioId) REFERENCES servicios(id)
  );

  CREATE TABLE IF NOT EXISTS ingresos_inventario (
    id TEXT PRIMARY KEY,
    fecha TEXT,
    proveedor TEXT,
    factura TEXT,
    total REAL DEFAULT 0,
    notas TEXT,
    sucursalId TEXT,
    usuarioId TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id),
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS ingreso_items (
    id TEXT PRIMARY KEY,
    ingresoId TEXT,
    itemId TEXT,
    nombre TEXT,
    cantidad INTEGER,
    costoUnit REAL,
    FOREIGN KEY(ingresoId) REFERENCES ingresos_inventario(id)
  );

  CREATE TABLE IF NOT EXISTS gastos (
    id TEXT PRIMARY KEY,
    fecha TEXT,
    concepto TEXT,
    tipo TEXT,
    monto REAL DEFAULT 0,
    metodoPago TEXT,
    comprobante TEXT,
    notas TEXT,
    sucursalId TEXT,
    usuarioId TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id),
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS distribuidores (
    id TEXT PRIMARY KEY,
    razon TEXT,
    contacto TEXT,
    telefono TEXT,
    email TEXT,
    ciudad TEXT,
    tipo TEXT DEFAULT 'Mayorista',
    compraMinima INTEGER DEFAULT 20,
    estado TEXT DEFAULT 'Activo',
    notas TEXT,
    sucursalId TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS pedidos_distribuidor (
    id TEXT PRIMARY KEY,
    distribuidorId TEXT,
    fecha TEXT,
    total REAL DEFAULT 0,
    estado TEXT DEFAULT 'Pendiente',
    metodoPago TEXT,
    FOREIGN KEY(distribuidorId) REFERENCES distribuidores(id)
  );

  CREATE TABLE IF NOT EXISTS pedido_items (
    id TEXT PRIMARY KEY,
    pedidoId TEXT,
    itemId TEXT,
    nombre TEXT,
    cantidad INTEGER,
    precioUnit REAL,
    FOREIGN KEY(pedidoId) REFERENCES pedidos_distribuidor(id)
  );

  CREATE TABLE IF NOT EXISTS cajas (
    id TEXT PRIMARY KEY,
    fecha TEXT,
    apertura REAL DEFAULT 0,
    ingresosVentas REAL DEFAULT 0,
    egresosCompras REAL DEFAULT 0,
    egresosGastos REAL DEFAULT 0,
    neto REAL DEFAULT 0,
    observaciones TEXT,
    sucursalId TEXT,
    timestamp TEXT,
    FOREIGN KEY(sucursalId) REFERENCES sucursales(id)
  );

  CREATE TABLE IF NOT EXISTS config (
    clave TEXT PRIMARY KEY,
    valor TEXT
  );
`);

// Crear datos de prueba si es necesario
const countSuc = db.prepare("SELECT COUNT(*) as c FROM sucursales").get();
if (countSuc.c === 0) {
  // Crear sucursal default
  const sucId = uuidv4();
  db.prepare("INSERT INTO sucursales VALUES (?,?,?,?,?,?,?,?)").run(
    sucId, "Cali Principal", "Cali", "Carrera 5 # 12-45", "3154582000", "admin@evobike.com", "Admin", "Activo"
  );
  
  // Crear usuario admin
  const adminPass = bcryptjs.hashSync("admin123", 10);
  db.prepare("INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)").run(
    uuidv4(), "admin@evobike.com", adminPass, "Administrador", "admin", sucId, "Activo", new Date().toISOString()
  );

  // Crear rol default
  db.prepare("INSERT INTO roles VALUES (?,?,?)").run(
    uuidv4(), "admin", JSON.stringify(["all"])
  );
}

// Datos de ejemplo - Inventario
const countInv = db.prepare("SELECT COUNT(*) as c FROM inventario").get();
if (countInv.c === 0) {
  const sucursal = db.prepare("SELECT id FROM sucursales LIMIT 1").get();
  const insertInv = db.prepare("INSERT INTO inventario VALUES (?,?,?,?,?,?,?,?,?)");
  const motos = [
    ["m1","Aurora","moto",null,sucursal.id,3100000,2480000,2325000,8],
    ["m2","Águila","moto",null,sucursal.id,4000000,3200000,3000000,5],
    ["m3","Águila Pro","moto",null,sucursal.id,4000000,3200000,3000000,3],
    ["m4","Cielo","moto",null,sucursal.id,3600000,2880000,2700000,6],
    ["m5","Zeus","moto",null,sucursal.id,4500000,3600000,3375000,4],
    ["m6","Beetle","moto",null,sucursal.id,4500000,3600000,3375000,2],
    ["m7","Family Q","moto",null,sucursal.id,3800000,3040000,2850000,7],
    ["m8","Moped","moto",null,sucursal.id,3400000,2720000,2550000,5],
    ["m9","Rayo Pro","moto",null,sucursal.id,4200000,3360000,3150000,3],
    ["m10","Galaxy","moto",null,sucursal.id,3900000,3120000,2925000,4],
  ];
  const accesorios = [
    ["a1","Casco Básico","accesorio","Casco",sucursal.id,120000,92000,85000,20],
    ["a2","Casco Pro","accesorio","Casco",sucursal.id,280000,215000,200000,10],
    ["a3","Maleta Trasera","accesorio","Maleta",sucursal.id,95000,73000,68000,15],
    ["a4","Maleta Lateral","accesorio","Maleta",sucursal.id,140000,108000,100000,8],
    ["a5","Impermeable S","accesorio","Impermeable",sucursal.id,45000,35000,32000,25],
    ["a6","Impermeable M","accesorio","Impermeable",sucursal.id,45000,35000,32000,25],
    ["a7","Impermeable L","accesorio","Impermeable",sucursal.id,45000,35000,32000,18],
    ["a8","Batería 48V 20Ah","accesorio","Batería",sucursal.id,450000,346000,320000,6],
    ["a9","Batería 48V 12Ah","accesorio","Batería",sucursal.id,280000,215000,200000,8],
    ["a10","Cargador Universal","accesorio","Cargador",sucursal.id,85000,65000,60000,12],
    ["a11","Candado Seguridad","accesorio","Seguridad",sucursal.id,35000,27000,25000,30],
    ["a12","Kit Luces LED","accesorio","Luces",sucursal.id,75000,58000,53000,14],
    ["a13","Guantes Moto","accesorio","Indumentaria",sucursal.id,55000,42000,39000,20],
    ["a14","Rodilleras","accesorio","Indumentaria",sucursal.id,65000,50000,46000,10],
  ];
  [...motos,...accesorios].forEach(row => insertInv.run(...row));
}

const countCamp = db.prepare("SELECT COUNT(*) as c FROM campaigns").get();
if (countCamp.c === 0) {
  const sucursal = db.prepare("SELECT id FROM sucursales LIMIT 1").get();
  const insertC = db.prepare("INSERT INTO campaigns VALUES (?,?,?)");
  ["Día de la Mujer","Día del Niño","Día del Padre","Sin campaña"].forEach(c => insertC.run(uuidv4(), c, sucursal.id));
}

// ─── HELPERS ─────────────────────────────────────────────────
const ok = (res, data) => res.json({ ok: true, data });
const err = (res, msg, code=400) => res.status(code).json({ ok: false, error: msg });

// ─── MIDDLEWARE DE AUTENTICACIÓN ─────────────────────────────
// Verificar que el usuario tenga un token JWT válido
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return err(res, "Token no encontrado", 401);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    err(res, "Token inválido", 401);
  }
};

// ─── AUTENTICACIÓN ───────────────────────────────────────────
app.post("/api/auth/registro", (req, res) => {
  const { email, contraseña, nombre, sucursalId } = req.body;
  if (!email || !contraseña || !nombre) return err(res, "Datos incompletos");
  
  const existing = db.prepare("SELECT * FROM usuarios WHERE email=?").get(email);
  if (existing) return err(res, "Email ya registrado");
  
  const id = uuidv4();
  const hash = bcryptjs.hashSync(contraseña, 10);
  
  try {
    db.prepare("INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)").run(
      id, email, hash, nombre, "vendedor", sucursalId || "", "Activo", new Date().toISOString()
    );
    const usuario = db.prepare("SELECT * FROM usuarios WHERE id=?").get(id);
    delete usuario.contraseña;
    ok(res, usuario);
  } catch (e) {
    err(res, "Error al registrar usuario");
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) return err(res, "Email y contraseña requeridos");
  
  const usuario = db.prepare("SELECT * FROM usuarios WHERE email=?").get(email);
  if (!usuario) return err(res, "Credenciales inválidas");
  
  if (!bcryptjs.compareSync(contraseña, usuario.contraseña)) {
    return err(res, "Credenciales inválidas");
  }
  
  const token = jwt.sign({
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
    sucursalId: usuario.sucursalId
  }, JWT_SECRET, { expiresIn: "24h" });
  
  delete usuario.contraseña;
  ok(res, { usuario, token });
});

app.get("/api/auth/me", verifyToken, (req, res) => {
  const usuario = db.prepare("SELECT * FROM usuarios WHERE id=?").get(req.user.id);
  if (!usuario) return err(res, "Usuario no encontrado");
  delete usuario.contraseña;
  ok(res, usuario);
});

// ─── SUCURSALES ──────────────────────────────────────────────
app.get("/api/sucursales", verifyToken, (req, res) => {
  const sucursales = db.prepare("SELECT * FROM sucursales").all();
  ok(res, sucursales);
});

app.post("/api/sucursales", verifyToken, (req, res) => {
  if (req.user.rol !== "admin") return err(res, "Acceso denegado", 403);
  
  const { nombre, ciudad, direccion, telefono, email, gerente } = req.body;
  if (!nombre) return err(res, "Nombre requerido");
  
  const id = uuidv4();
  db.prepare("INSERT INTO sucursales VALUES (?,?,?,?,?,?,?,?)").run(
    id, nombre, ciudad || "", direccion || "", telefono || "", email || "", gerente || "", "Activo"
  );
  ok(res, db.prepare("SELECT * FROM sucursales WHERE id=?").get(id));
});

// ─── USUARIOS ────────────────────────────────────────────────
app.get("/api/usuarios", verifyToken, (req, res) => {
  if (req.user.rol !== "admin") return err(res, "Acceso denegado", 403);
  
  const usuarios = db.prepare("SELECT id, email, nombre, rol, sucursalId, estado FROM usuarios").all();
  ok(res, usuarios);
});

app.post("/api/usuarios", verifyToken, (req, res) => {
  if (req.user.rol !== "admin") return err(res, "Acceso denegado", 403);
  
  const { email, contraseña, nombre, rol, sucursalId } = req.body;
  if (!email || !contraseña || !nombre || !sucursalId) return err(res, "Datos incompletos");
  
  const existing = db.prepare("SELECT * FROM usuarios WHERE email=?").get(email);
  if (existing) return err(res, "Email ya registrado");
  
  const id = uuidv4();
  const hash = bcryptjs.hashSync(contraseña, 10);
  
  db.prepare("INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)").run(
    id, email, hash, nombre, rol || "vendedor", sucursalId, "Activo", new Date().toISOString()
  );
  
  const usuario = db.prepare("SELECT id, email, nombre, rol, sucursalId, estado FROM usuarios WHERE id=?").get(id);
  ok(res, usuario);
});

// ─── RUTAS INVENTARIO ─────────────────────────────────────────
app.get("/api/inventario", verifyToken, (req, res) => {
  const inventario = db.prepare(
    "SELECT * FROM inventario WHERE sucursalId=? OR sucursalId IS NULL ORDER BY categoria, nombre"
  ).all(req.user.sucursalId);
  ok(res, inventario);
});

app.post("/api/inventario", verifyToken, (req, res) => {
  const { nombre, categoria, tipo, precioPublico, precioMayorista, precioExclusivo, stock } = req.body;
  if (!nombre || !categoria) return err(res, "Nombre y categoría requeridos");
  const id = uuidv4();
  db.prepare("INSERT INTO inventario VALUES (?,?,?,?,?,?,?,?,?,?)").run(
    id, nombre, categoria, tipo||null, req.user.sucursalId, precioPublico||0, precioMayorista||0, precioExclusivo||0, stock||0
  );
  ok(res, db.prepare("SELECT * FROM inventario WHERE id=?").get(id));
});

app.put("/api/inventario/:id", verifyToken, (req, res) => {
  const { nombre, precioPublico, precioMayorista, precioExclusivo, stock, tipo } = req.body;
  db.prepare("UPDATE inventario SET nombre=?, precioPublico=?, precioMayorista=?, precioExclusivo=?, stock=?, tipo=? WHERE id=?")
    .run(nombre, precioPublico, precioMayorista, precioExclusivo, stock, tipo, req.params.id);
  ok(res, db.prepare("SELECT * FROM inventario WHERE id=?").get(req.params.id));
});

app.patch("/api/inventario/:id/stock", verifyToken, (req, res) => {
  const { delta } = req.body;
  const item = db.prepare("SELECT * FROM inventario WHERE id=?").get(req.params.id);
  if (!item) return err(res, "No encontrado", 404);
  const newStock = Math.max(0, item.stock + (delta||0));
  db.prepare("UPDATE inventario SET stock=? WHERE id=?").run(newStock, req.params.id);
  ok(res, { ...item, stock: newStock });
});

app.delete("/api/inventario/:id", verifyToken, (req, res) => {
  db.prepare("DELETE FROM inventario WHERE id=?").run(req.params.id);
  ok(res, { id: req.params.id });
});

// ─── CAMPAIGNS ────────────────────────────────────────────────
app.get("/api/campaigns", verifyToken, (req, res) => {
  const campaigns = db.prepare("SELECT * FROM campaigns WHERE sucursalId=?").all(req.user.sucursalId);
  ok(res, campaigns);
});

app.post("/api/campaigns", verifyToken, (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return err(res, "Nombre requerido");
  const id = uuidv4();
  db.prepare("INSERT INTO campaigns VALUES (?,?,?)").run(id, nombre, req.user.sucursalId);
  ok(res, { id, nombre });
});

app.delete("/api/campaigns/:id", verifyToken, (req, res) => {
  db.prepare("DELETE FROM campaigns WHERE id=?").run(req.params.id);
  ok(res, { id: req.params.id });
});

// ─── LEADS (Panel tipo Notion) ────────────────────────────────
app.get("/api/leads", verifyToken, (req, res) => {
  const leads = db.prepare(
    "SELECT * FROM leads WHERE sucursalId=? ORDER BY fecha DESC"
  ).all(req.user.sucursalId);
  ok(res, leads);
});

app.get("/api/leads/filtro", verifyToken, (req, res) => {
  const { estado, prioridad, red, mes } = req.query;
  let query = "SELECT * FROM leads WHERE sucursalId=?";
  const params = [req.user.sucursalId];
  
  if (estado) {
    query += " AND estado=?";
    params.push(estado);
  }
  if (prioridad) {
    query += " AND prioridad=?";
    params.push(prioridad);
  }
  if (red) {
    query += " AND red=?";
    params.push(red);
  }
  if (mes) {
    query += " AND strftime('%Y-%m', fecha)=?";
    params.push(mes);
  }
  
  query += " ORDER BY fecha DESC";
  const leads = db.prepare(query).all(...params);
  ok(res, leads);
});

app.post("/api/leads", verifyToken, (req, res) => {
  const id = uuidv4();
  const f = req.body;
  db.prepare(
    "INSERT INTO leads VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  ).run(
    id, f.fecha, f.nombre, req.user.id, req.user.sucursalId, f.telefono, f.ciudad, f.email, 
    f.red, f.modeloId, f.consulta, f.estado || "Nuevo", f.campana, f.notas, f.tipo || "cliente", 
    f.tipoDistribuidor || "", f.prioridad || "media"
  );
  ok(res, db.prepare("SELECT * FROM leads WHERE id=?").get(id));
});

app.put("/api/leads/:id", verifyToken, (req, res) => {
  const f = req.body;
  db.prepare(
    "UPDATE leads SET fecha=?,nombre=?,telefono=?,ciudad=?,email=?,red=?,modeloId=?,consulta=?,estado=?,campana=?,notas=?,tipo=?,tipoDistribuidor=?,prioridad=? WHERE id=?"
  ).run(
    f.fecha, f.nombre, f.telefono, f.ciudad, f.email, f.red, f.modeloId, f.consulta, 
    f.estado, f.campana, f.notas, f.tipo, f.tipoDistribuidor, f.prioridad, req.params.id
  );
  ok(res, db.prepare("SELECT * FROM leads WHERE id=?").get(req.params.id));
});

app.patch("/api/leads/:id/estado", verifyToken, (req, res) => {
  const { estado } = req.body;
  db.prepare("UPDATE leads SET estado=? WHERE id=?").run(estado, req.params.id);
  ok(res, db.prepare("SELECT * FROM leads WHERE id=?").get(req.params.id));
});

app.patch("/api/leads/:id/prioridad", verifyToken, (req, res) => {
  const { prioridad } = req.body;
  db.prepare("UPDATE leads SET prioridad=? WHERE id=?").run(prioridad, req.params.id);
  ok(res, db.prepare("SELECT * FROM leads WHERE id=?").get(req.params.id));
});

app.delete("/api/leads/:id", verifyToken, (req, res) => {
  db.prepare("DELETE FROM leads WHERE id=?").run(req.params.id);
  ok(res, { id: req.params.id });
});

// ─── CLIENTES ─────────────────────────────────────────────────
app.get("/api/clientes", verifyToken, (req, res) => {
  const clientes = db.prepare("SELECT * FROM clientes WHERE sucursalId=? ORDER BY fechaRegistro DESC").all(req.user.sucursalId);
  ok(res, clientes);
});

app.post("/api/clientes", verifyToken, (req, res) => {
  const { nombre, telefono, documento, email, ciudad } = req.body;
  const existing = db.prepare("SELECT * FROM clientes WHERE telefono=? AND sucursalId=?").get(telefono, req.user.sucursalId);
  if (existing) return ok(res, existing);
  const id = uuidv4();
  db.prepare("INSERT INTO clientes VALUES (?,?,?,?,?,?,?,?)").run(
    id, nombre, telefono, documento||"", email||"", ciudad||"", req.user.sucursalId, new Date().toISOString().split("T")[0]
  );
  ok(res, db.prepare("SELECT * FROM clientes WHERE id=?").get(id));
});

// ─── VENTAS ───────────────────────────────────────────────────
app.get("/api/ventas", verifyToken, (req, res) => {
  const ventas = db.prepare("SELECT * FROM ventas WHERE sucursalId=? ORDER BY fecha DESC").all(req.user.sucursalId);
  const result = ventas.map(v => ({
    ...v,
    conEntrega: !!v.conEntrega,
    items: db.prepare("SELECT * FROM venta_items WHERE ventaId=?").all(v.id)
  }));
  ok(res, result);
});

app.post("/api/ventas", verifyToken, (req, res) => {
  const f = req.body;
  const id = uuidv4();
  let entregaId = null;
  if (f.conEntrega) {
    entregaId = uuidv4();
    const modelos = (f.items||[]).map(it => it.nombre).join(", ");
    db.prepare("INSERT INTO entregas VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
      entregaId, f.fecha, id, f.clienteNombre, f.clienteTel, f.direccion, f.ciudad,
      modelos, "Pendiente", f.transportadora||"", f.valorEnvio||0, "", "", req.user.sucursalId
    );
  }
  db.prepare(
    "INSERT INTO ventas VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  ).run(
    id, f.fecha, f.clienteNombre, f.clienteTel, f.clienteDoc||"", f.clienteEmail||"", f.ciudad||"",
    f.red, f.campaña||f.campana, f.metodoPago, f.tipoVenta||"detalle", f.conEntrega?1:0,
    f.direccion||"", f.transportadora||"", f.valorEnvio||0, f.total, entregaId, req.user.id, req.user.sucursalId
  );
  (f.items||[]).forEach(it => {
    db.prepare("INSERT INTO venta_items VALUES (?,?,?,?,?,?)").run(uuidv4(), id, it.itemId, it.nombre, it.cantidad, it.precioUnit);
    db.prepare("UPDATE inventario SET stock = MAX(0, stock - ?) WHERE id=?").run(it.cantidad, it.itemId);
  });
  if (f.clienteTel) {
    const ex = db.prepare("SELECT id FROM clientes WHERE telefono=? AND sucursalId=?").get(f.clienteTel, req.user.sucursalId);
    if (!ex) db.prepare("INSERT INTO clientes VALUES (?,?,?,?,?,?,?,?)").run(
      uuidv4(), f.clienteNombre, f.clienteTel, f.clienteDoc||"", f.clienteEmail||"", f.ciudad||"", req.user.sucursalId, f.fecha
    );
  }
  ok(res, { id, entregaId });
});

// ─── ENTREGAS ─────────────────────────────────────────────────
app.get("/api/entregas", verifyToken, (req, res) => {
  const entregas = db.prepare("SELECT * FROM entregas WHERE sucursalId=? ORDER BY fecha DESC").all(req.user.sucursalId);
  ok(res, entregas);
});

app.post("/api/entregas", verifyToken, (req, res) => {
  const f = req.body;
  const id = uuidv4();
  db.prepare("INSERT INTO entregas VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
    id, f.fecha, f.ventaId||null, f.clienteNombre, f.clienteTel, f.direccion, f.ciudad,
    f.modelo, f.estado||"Pendiente", f.transportadora, f.valorEnvio||0, f.guia||"", f.notas||"", req.user.sucursalId
  );
  ok(res, db.prepare("SELECT * FROM entregas WHERE id=?").get(id));
});

app.patch("/api/entregas/:id/estado", verifyToken, (req, res) => {
  db.prepare("UPDATE entregas SET estado=? WHERE id=?").run(req.body.estado, req.params.id);
  ok(res, db.prepare("SELECT * FROM entregas WHERE id=?").get(req.params.id));
});

// ─── SERVICIOS TÉCNICOS ───────────────────────────────────────
app.get("/api/servicios", verifyToken, (req, res) => {
  const servicios = db.prepare("SELECT * FROM servicios WHERE sucursalId=? ORDER BY fecha DESC").all(req.user.sucursalId);
  const result = servicios.map(s => ({
    ...s,
    items: db.prepare("SELECT * FROM servicio_items WHERE servicioId=?").all(s.id)
  }));
  ok(res, result);
});

app.post("/api/servicios", verifyToken, (req, res) => {
  const f = req.body;
  const id = uuidv4();
  db.prepare(
    "INSERT INTO servicios VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  ).run(
    id, f.fecha, f.clienteNombre, f.clienteTel, f.clienteDoc||"", f.modelo, f.motivo,
    f.descripcion, f.estado||"Recibido", f.tecnico||"", f.costoEstimado||0, f.costoFinal||0, 
    f.notas||"", f.prioridad || "media", req.user.sucursalId, req.user.id, f.bodegaId||""
  );
  ok(res, db.prepare("SELECT * FROM servicios WHERE id=?").get(id));
});

app.patch("/api/servicios/:id", verifyToken, (req, res) => {
  const { estado, costoFinal, prioridad, tecnico } = req.body;
  let query = "UPDATE servicios SET";
  const updates = [];
  
  if (estado !== undefined) {
    updates.push("estado='" + estado + "'");
  }
  if (costoFinal !== undefined) {
    updates.push("costoFinal=" + costoFinal);
  }
  if (prioridad !== undefined) {
    updates.push("prioridad='" + prioridad + "'");
  }
  if (tecnico !== undefined) {
    updates.push("tecnico='" + tecnico + "'");
  }
  
  if (updates.length === 0) return err(res, "Sin cambios");
  
  query += " " + updates.join(", ") + " WHERE id=?";
  db.prepare(query).run(req.params.id);
  ok(res, db.prepare("SELECT * FROM servicios WHERE id=?").get(req.params.id));
});

app.delete("/api/servicios/:id", verifyToken, (req, res) => {
  db.prepare("DELETE FROM servicio_items WHERE servicioId=?").run(req.params.id);
  db.prepare("DELETE FROM servicios WHERE id=?").run(req.params.id);
  ok(res, { id: req.params.id });
});

// ─── INGRESOS INVENTARIO (Bodega) ──────────────────────────────
app.get("/api/ingresos-inventario", verifyToken, (req, res) => {
  const ingresos = db.prepare("SELECT * FROM ingresos_inventario WHERE sucursalId=? ORDER BY fecha DESC").all(req.user.sucursalId);
  const result = ingresos.map(i => ({
    ...i,
    items: db.prepare("SELECT * FROM ingreso_items WHERE ingresoId=?").all(i.id)
  }));
  ok(res, result);
});

app.post("/api/ingresos-inventario", verifyToken, (req, res) => {
  const f = req.body;
  const id = uuidv4();
  db.prepare("INSERT INTO ingresos_inventario VALUES (?,?,?,?,?,?,?,?)").run(
    id, f.fecha, f.proveedor, f.factura||"", f.total||0, f.notas||"", req.user.sucursalId, req.user.id
  );
  (f.items||[]).forEach(it => {
    db.prepare("INSERT INTO ingreso_items VALUES (?,?,?,?,?,?)").run(uuidv4(), id, it.itemId, it.nombre, it.cantidad, it.costoUnit||0);
    db.prepare("UPDATE inventario SET stock = stock + ? WHERE id=?").run(it.cantidad, it.itemId);
  });
  ok(res, { id });
});

// ─── GASTOS ───────────────────────────────────────────────────
app.get("/api/gastos", verifyToken, (req, res) => {
  const gastos = db.prepare("SELECT * FROM gastos WHERE sucursalId=? ORDER BY fecha DESC").all(req.user.sucursalId);
  ok(res, gastos);
});

app.post("/api/gastos", verifyToken, (req, res) => {
  const f = req.body;
  const id = uuidv4();
  db.prepare("INSERT INTO gastos VALUES (?,?,?,?,?,?,?,?,?,?)").run(
    id, f.fecha, f.concepto, f.tipo, f.monto||0, f.metodoPago, f.comprobante||"", f.notas||"", req.user.sucursalId, req.user.id
  );
  ok(res, db.prepare("SELECT * FROM gastos WHERE id=?").get(id));
});

app.delete("/api/gastos/:id", verifyToken, (req, res) => {
  db.prepare("DELETE FROM gastos WHERE id=?").run(req.params.id);
  ok(res, { id: req.params.id });
});

// ─── DISTRIBUIDORES ───────────────────────────────────────────
app.get("/api/distribuidores", verifyToken, (req, res) => {
  const dist = db.prepare("SELECT * FROM distribuidores WHERE sucursalId=? ORDER BY razon").all(req.user.sucursalId);
  const result = dist.map(d => ({
    ...d,
    pedidos: db.prepare("SELECT * FROM pedidos_distribuidor WHERE distribuidorId=? ORDER BY fecha DESC").all(d.id).map(p => ({
      ...p,
      items: db.prepare("SELECT * FROM pedido_items WHERE pedidoId=?").all(p.id)
    }))
  }));
  ok(res, result);
});

app.post("/api/distribuidores", verifyToken, (req, res) => {
  const f = req.body;
  const id = uuidv4();
  db.prepare("INSERT INTO distribuidores VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(
    id, f.razon, f.contacto||"", f.telefono||"", f.email||"", f.ciudad||"",
    f.tipo||"Mayorista", f.compraMinima||20, f.estado||"Activo", f.notas||"", req.user.sucursalId
  );
  ok(res, db.prepare("SELECT * FROM distribuidores WHERE id=?").get(id));
});

// ─── PEDIDOS DISTRIBUIDOR ─────────────────────────────────────
app.post("/api/distribuidores/:id/pedidos", verifyToken, (req, res) => {
  const f = req.body;
  const pid = uuidv4();
  db.prepare("INSERT INTO pedidos_distribuidor VALUES (?,?,?,?,?,?)").run(pid, req.params.id, f.fecha, f.total||0, f.estado||"Pendiente", f.metodoPago);
  (f.items||[]).forEach(it => {
    db.prepare("INSERT INTO pedido_items VALUES (?,?,?,?,?,?)").run(uuidv4(), pid, it.itemId, it.nombre, it.cantidad, it.precioUnit);
  });
  ok(res, { id: pid });
});

app.patch("/api/pedidos/:id/estado", verifyToken, (req, res) => {
  db.prepare("UPDATE pedidos_distribuidor SET estado=? WHERE id=?").run(req.body.estado, req.params.id);
  ok(res, { id: req.params.id });
});

// ─── CAJA ─────────────────────────────────────────────────────
app.get("/api/cajas", verifyToken, (req, res) => {
  const cajas = db.prepare("SELECT * FROM cajas WHERE sucursalId=? ORDER BY fecha DESC").all(req.user.sucursalId);
  ok(res, cajas);
});

app.post("/api/cajas", verifyToken, (req, res) => {
  const f = req.body;
  const id = uuidv4();
  const ingresosVentas = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM ventas WHERE fecha=? AND sucursalId=?").get(f.fecha, req.user.sucursalId).s;
  const egresosCompras = db.prepare("SELECT COALESCE(SUM(total),0) as s FROM ingresos_inventario WHERE fecha=? AND sucursalId=?").get(f.fecha, req.user.sucursalId).s;
  const egresosGastos = db.prepare("SELECT COALESCE(SUM(monto),0) as s FROM gastos WHERE fecha=? AND sucursalId=?").get(f.fecha, req.user.sucursalId).s;
  const neto = (f.apertura||0) + ingresosVentas - egresosCompras - egresosGastos;
  
  db.prepare("INSERT INTO cajas VALUES (?,?,?,?,?,?,?,?,?,?)").run(
    id, f.fecha, f.apertura||0, ingresosVentas, egresosCompras, egresosGastos, neto, f.observaciones||"", req.user.sucursalId, new Date().toISOString()
  );
  ok(res, db.prepare("SELECT * FROM cajas WHERE id=?").get(id));
});

app.listen(PORT, () => {
  console.log(`🚀 EvoBike ERP Server listening on http://localhost:${PORT}`);
});
