import React, { useState, useEffect, useCallback } from "react";
import { api } from "./api";
import Login from "./pages/Login";
import LeadsPanel from "./components/LeadsPanel";
import {
  Badge, Btn, Inp, Sel, Modal, Grid, Card, Kpi, SectionHdr, DataTable, Alert, Spinner
} from "./components/UI";

const DEFAULT_THEME = {
  primary: "#00c853", primaryDark: "#009624", primaryLight: "#e8faf0",
  danger: "#ef4444", warn: "#f97316", info: "#3b82f6",
  stockCrit: 2, stockBajo: 5,
  colorCrit: "#ef4444", colorBajo: "#f97316", colorOk: "#00c853",
};

const NAV = [
  { key: "dashboard", icon: "▦", label: "Dashboard" },
  { key: "leads", icon: "💬", label: "Leads RRSS" },
  { key: "campaigns", icon: "📢", label: "Campañas" },
  { key: "ventas", icon: "💰", label: "Ventas" },
  { key: "entregas", icon: "🚚", label: "Entregas" },
  { key: "inventario", icon: "📦", label: "Inventario" },
  { key: "ingresos", icon: "📥", label: "Bodega" },
  { key: "servicio", icon: "🔧", label: "Serv. Técnico" },
  { key: "distribuidores", icon: "🏪", label: "Distribuidores" },
  { key: "clientes", icon: "👥", label: "Clientes" },
  { key: "caja", icon: "🏦", label: "Caja & Gastos" },
  { key: "config", icon: "⚙️", label: "Configuración" },
];

const ESTADOS_LEAD = ["Nuevo", "Contactado", "Interesado", "Negociado", "Cerrado", "Descartado"];
const REDES = ["Facebook", "Instagram", "WhatsApp", "TikTok", "Google", "Directo", "Referencia"];

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [tab, setTab] = useState("dashboard");
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(!user);
  const [modal, setModal] = useState(null);

  // Data
  const [inventario, setInventario] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [distribuidores, setDistribuidores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Forms
  const [formLead, setFormLead] = useState({
    nombre: "", telefono: "", email: "", red: "Directo", consulta: "",
    estado: "Nuevo", prioridad: "media", notas: "", tipo: "cliente", campana: "", tipoGestion: "Consulta",
  });

  const [formCampaign, setFormCampaign] = useState({ nombre: "" });

  const [formVenta, setFormVenta] = useState({
    clienteNombre: "", clienteTel: "", clienteDoc: "", ciudad: "", metodoPago: "Efectivo",
    items: [], conEntrega: false, transportadora: "", valorEnvio: 0,
  });

  const [formServicio, setFormServicio] = useState({
    clienteNombre: "", clienteTel: "", clienteDoc: "", modelo: "", motivo: "",
    descripcion: "", tecnico: "", estado: "Recibido", prioridad: "media",
  });

  const [formCliente, setFormCliente] = useState({
    nombre: "", telefono: "", documento: "", ciudad: "", email: "", tipo: "Normal",
  });

  const [formDistribuidor, setFormDistribuidor] = useState({
    razon: "", contacto: "", telefono: "", email: "", ciudad: "", tipo: "Mayorista", compraMinima: 20,
  });

  const [formGasto, setFormGasto] = useState({
    fecha: new Date().toISOString().split("T")[0], concepto: "", tipo: "Operativo", monto: 0, metodoPago: "Efectivo", comprobante: "", notas: "",
  });

  const [formCaja, setFormCaja] = useState({
    fecha: new Date().toISOString().split("T")[0], apertura: 0, observaciones: "",
  });

  // Cargar datos
  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inv, camps, leadsData, clients, ventasData, entregasData, serviciosData, ingresosData, gastosData, distribuidoresData, sucursalesData] = await Promise.all([
        api.getInventario().catch(() => []),
        api.getCampaigns().catch(() => []),
        api.getLeads().catch(() => []),
        api.getClientes().catch(() => []),
        api.getVentas().catch(() => []),
        api.getEntregas().catch(() => []),
        api.getServicios().catch(() => []),
        api.getIngresosInventario().catch(() => []),
        api.getGastos().catch(() => []),
        api.getDistribuidores().catch(() => []),
        api.getSucursales().catch(() => []),
      ]);

      setInventario(Array.isArray(inv) ? inv : []);
      setCampaigns(Array.isArray(camps) ? camps : []);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setClientes(Array.isArray(clients) ? clients : []);
      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setEntregas(Array.isArray(entregasData) ? entregasData : []);
      setServicios(Array.isArray(serviciosData) ? serviciosData : []);
      setIngresos(Array.isArray(ingresosData) ? ingresosData : []);
      setGastos(Array.isArray(gastosData) ? gastosData : []);
      setDistribuidores(Array.isArray(distribuidoresData) ? distribuidoresData : []);
      setSucursales(Array.isArray(sucursalesData) ? sucursalesData : []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setAlert({ type: "error", msg: "Error al cargar datos: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTab("dashboard");
  };

  // Leads
  const handleAddLead = async () => {
    if (!formLead.nombre || !formLead.telefono) {
      setAlert({ type: "warn", msg: "Nombre y teléfono requeridos" });
      return;
    }
    try {
      await api.addLead({
        ...formLead,
        tipo: formLead.tipoGestion,
        fecha: new Date().toISOString().split("T")[0],
      });
      setFormLead({
        nombre: "", telefono: "", email: "", red: "Directo", consulta: "",
        estado: "Nuevo", prioridad: "media", notas: "", tipo: "cliente", campana: "", tipoGestion: "Consulta",
      });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Lead agregado correctamente" });
    } catch (err) {
      setAlert({ type: "error", msg: "Error al agregar lead: " + err.message });
    }
  };

  // Campaigns
  const handleAddCampaign = async () => {
    if (!formCampaign.nombre.trim()) {
      setAlert({ type: "warn", msg: "Nombre de campaña requerido" });
      return;
    }
    try {
      await api.addCampaign(formCampaign.nombre);
      setFormCampaign({ nombre: "" });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Campaña agregada" });
    } catch (err) {
      setAlert({ type: "error", msg: "Error al agregar campaña: " + err.message });
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("¿Eliminar esta campaña?")) return;
    try {
      await api.deleteCampaign(id);
      loadData();
      setAlert({ type: "ok", msg: "Campaña eliminada" });
    } catch (err) {
      setAlert({ type: "error", msg: "Error al eliminar: " + err.message });
    }
  };

  // Clientes
  const handleAddCliente = async () => {
    if (!formCliente.nombre || !formCliente.telefono) {
      setAlert({ type: "warn", msg: "Nombre y teléfono requeridos" });
      return;
    }
    try {
      await api.addCliente({
        ...formCliente,
        fechaRegistro: new Date().toISOString().split("T")[0],
      });
      setFormCliente({ nombre: "", telefono: "", documento: "", ciudad: "", email: "", tipo: "Normal" });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Cliente registrado" });
    } catch (err) {
      setAlert({ type: "error", msg: "Error: " + err.message });
    }
  };

  // Distribuidores
  const handleAddDistribuidor = async () => {
    if (!formDistribuidor.razon || !formDistribuidor.telefono) {
      setAlert({ type: "warn", msg: "Razón social y teléfono requeridos" });
      return;
    }
    try {
      await api.addDistribuidor(formDistribuidor);
      setFormDistribuidor({ razon: "", contacto: "", telefono: "", email: "", ciudad: "", tipo: "Mayorista", compraMinima: 20 });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Distribuidor agregado" });
    } catch (err) {
      setAlert({ type: "error", msg: "Error: " + err.message });
    }
  };

  // Gastos
  const handleAddGasto = async () => {
    if (!formGasto.concepto || formGasto.monto <= 0) {
      setAlert({ type: "warn", msg: "Complete concepto y monto" });
      return;
    }
    try {
      await api.addGasto(formGasto);
      setFormGasto({ fecha: new Date().toISOString().split("T")[0], concepto: "", tipo: "Operativo", monto: 0, metodoPago: "Efectivo", comprobante: "", notas: "" });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Gasto registrado" });
    } catch (err) {
      setAlert({ type: "error", msg: "Error: " + err.message });
    }
  };

  // Caja
  const handleRegistrarCaja = async () => {
    try {
      const caja = await api.addCaja(formCaja);
      setFormCaja({ fecha: new Date().toISOString().split("T")[0], apertura: 0, observaciones: "" });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Cierre de caja registrado" });
    } catch (err) {
      setAlert({ type: "error", msg: "Error: " + err.message });
    }
  };

  // Ventas
  const handleAddVenta = async () => {
    if (!formVenta.clienteNombre || formVenta.items.length === 0) {
      setAlert({ type: "warn", msg: "Cliente e items requeridos" });
      return;
    }
    try {
      const total = formVenta.items.reduce((sum, item) => sum + (item.cantidad * item.precioUnit), 0);
      await api.addVenta({
        ...formVenta,
        total: total + formVenta.valorEnvio,
        fecha: new Date().toISOString().split("T")[0],
      });
      setFormVenta({
        clienteNombre: "", clienteTel: "", clienteDoc: "", ciudad: "", metodoPago: "Efectivo",
        items: [], conEntrega: false, transportadora: "", valorEnvio: 0,
      });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Venta registrada" });
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    }
  };

  // Servicios Técnicos
  const handleAddServicio = async () => {
    if (!formServicio.clienteNombre || !formServicio.modelo) {
      setAlert({ type: "warn", msg: "Cliente y modelo requeridos" });
      return;
    }
    try {
      await api.addServicio({
        ...formServicio,
        fecha: new Date().toISOString().split("T")[0],
      });
      setFormServicio({
        clienteNombre: "", clienteTel: "", clienteDoc: "", modelo: "", motivo: "",
        descripcion: "", tecnico: "", estado: "Recibido", prioridad: "media",
      });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Servicio registrado" });
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  if (loading) return <Spinner />;

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={{ ...styles.header, background: theme.primary }}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>🏍️ EvoBike ERP</h1>
          <div style={styles.headerRight}>
            <span style={styles.userInfo}>
              👤 {user.nombre} | <strong>{user.sucursalId}</strong>
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && <Alert type={alert.type} msg={alert.msg} onClose={() => setAlert(null)} />}

      {/* Main */}
      <div style={styles.main}>
        {/* Sidebar */}
        <nav style={styles.sidebar}>
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                ...styles.navItem,
                background: tab === item.key ? theme.primaryLight : "transparent",
                color: tab === item.key ? theme.primary : "#666",
                fontWeight: tab === item.key ? "600" : "400",
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div style={styles.content}>
          {/* Dashboard */}
          {tab === "dashboard" && (
            <div>
              <h2 style={styles.sectionTitle}>📊 Dashboard</h2>
              <Grid cols={4} gap={15}>
                <Card>
                  <Kpi label="Leads" value={leads.length} icon="💬" color={theme.primary} />
                </Card>
                <Card>
                  <Kpi label="Ventas" value={ventas.length} icon="💰" color={theme.primary} />
                </Card>
                <Card>
                  <Kpi label="Entregas" value={entregas.length} icon="🚚" color={theme.warn} />
                </Card>
                <Card>
                  <Kpi label="Servicios" value={servicios.length} icon="🔧" color={theme.danger} />
                </Card>
              </Grid>
            </div>
          )}

          {/* Leads */}
          {tab === "leads" && (
            <div>
              <SectionHdr title="💬 Panel de Leads" action={() => setModal("lead")} actionLabel="+ Nuevo Lead" />
              <LeadsPanel leads={leads} onRefresh={loadData} theme={theme} campaigns={campaigns} />
            </div>
          )}

          {/* Campaigns */}
          {tab === "campaigns" && (
            <div>
              <SectionHdr title="📢 Campañas Publicitarias" action={() => setModal("campaign")} actionLabel="+ Nueva Campaña" />
              <Grid cols={3} gap={15}>
                {campaigns.map((camp) => (
                  <Card key={camp.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "600" }}>{camp.nombre}</h3>
                        <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>ID: {camp.id}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </Card>
                ))}
              </Grid>
            </div>
          )}

          {/* Ventas */}
          {tab === "ventas" && (
            <div>
              <SectionHdr title="💰 Ventas" action={() => setModal("venta")} actionLabel="+ Nueva Venta" />
              <DataTable
                data={ventas.map(v => ({
                  ...v,
                  fecha: v.fecha,
                  cliente: v.clienteNombre,
                  total: `$${v.total.toLocaleString()}`,
                }))}
                columns={["fecha", "cliente", "red", "total"]}
              />
            </div>
          )}

          {/* Entregas */}
          {tab === "entregas" && (
            <div>
              <SectionHdr title="🚚 Entregas" action={() => setModal("entrega")} actionLabel="+ Nueva Entrega" />
              <DataTable
                data={entregas.map(e => ({
                  ...e,
                  fecha: e.fecha,
                  cliente: e.clienteNombre,
                  estado: <Badge color={e.estado === "Entregado" ? "#00c853" : "#f97316"}>{e.estado}</Badge>,
                }))}
                columns={["fecha", "cliente", "estado"]}
              />
            </div>
          )}

          {/* Inventario / Bodega */}
          {tab === "inventario" && (
            <div>
              <SectionHdr title="📦 Inventario" action={() => setModal("inventario")} actionLabel="+ Agregar item" />
              <DataTable
                data={inventario.map(i => ({
                  ...i,
                  nombre: i.nombre,
                  categoria: i.categoria,
                  stock: <Badge color={i.stock === 0 ? "#ef4444" : "#00c853"}>{i.stock}</Badge>,
                  precio: `$${i.precioPublico.toLocaleString()}`,
                }))}
                columns={["nombre", "categoria", "stock", "precio"]}
              />
            </div>
          )}

          {/* Bodega / Ingresos */}
          {tab === "ingresos" && (
            <div>
              <SectionHdr title="📥 Ingresos a Bodega" action={() => setModal("ingreso")} actionLabel="+ Nuevo Ingreso" />
              <DataTable
                data={ingresos.map(i => ({
                  ...i,
                  fecha: i.fecha,
                  proveedor: i.proveedor,
                  total: `$${i.total.toLocaleString()}`,
                }))}
                columns={["fecha", "proveedor", "total"]}
              />
            </div>
          )}

          {/* Servicios Técnicos */}
          {tab === "servicio" && (
            <div>
              <SectionHdr title="🔧 Servicios Técnicos" action={() => setModal("servicio")} actionLabel="+ Nuevo Servicio" />
              <DataTable
                data={servicios.map(s => ({
                  ...s,
                  fecha: s.fecha,
                  cliente: s.clienteNombre,
                  modelo: s.modelo,
                  estado: <Badge color={s.estado === "Finalizado" ? "#00c853" : "#f97316"}>{s.estado}</Badge>,
                }))}
                columns={["fecha", "cliente", "modelo", "estado"]}
              />
            </div>
          )}

          {/* Distribuidores */}
          {tab === "distribuidores" && (
            <div>
              <SectionHdr title="🏪 Distribuidores" action={() => setModal("distribuidor")} actionLabel="+ Nuevo Distribuidor" />
              <Grid cols={2} gap={15}>
                {distribuidores.map((dist) => (
                  <Card key={dist.id}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>{dist.razon}</h3>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>📱 {dist.telefono}</p>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>👤 {dist.contacto}</p>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>📍 {dist.ciudad}</p>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#666" }}>💰 Compra Mín: ${dist.compraMinima}</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "12px", fontWeight: "600", color: dist.estado === "Activo" ? "#00c853" : "#f97316" }}>Estado: {dist.estado}</p>
                    <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                      <Btn small onClick={() => setModal("pedido_" + dist.id)}>+ Pedido</Btn>
                    </div>
                    {dist.pedidos && dist.pedidos.length > 0 && (
                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                        <p style={{ fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>Últimos Pedidos:</p>
                        {dist.pedidos.slice(0, 3).map(p => (
                          <div key={p.id} style={{ fontSize: "11px", marginBottom: "4px", padding: "6px", background: "#f9fafb", borderRadius: "4px" }}>
                            <strong>{p.fecha}</strong> - ${p.total.toLocaleString()} ({p.estado})
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </Grid>
            </div>
          )}

          {/* Clientes */}
          {tab === "clientes" && (
            <div>
              <SectionHdr title="👥 Clientes" action={() => setModal("cliente")} actionLabel="+ Nuevo Cliente" />
              <DataTable
                data={clientes.map(c => ({
                  ...c,
                  nombre: c.nombre,
                  telefono: c.telefono,
                  documento: c.documento,
                  ciudad: c.ciudad,
                  tipo: c.tipo,
                }))}
                columns={["nombre", "telefono", "documento", "ciudad", "tipo"]}
              />
            </div>
          )}

          {/* Caja & Gastos */}
          {tab === "caja" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <SectionHdr title="🏦 Gastos" action={() => setModal("gasto")} actionLabel="+ Nuevo Gasto" />
                <DataTable
                  data={(Array.isArray(gastos) ? gastos : []).map(g => ({
                    fecha: g.fecha,
                    concepto: g.concepto,
                    tipo: g.tipo,
                    monto: `$${g.monto.toLocaleString()}`,
                  }))}
                  columns={["fecha", "concepto", "tipo", "monto"]}
                />
              </div>
            </div>
          )}

          {/* Config */}
          {tab === "config" && (
            <div>
              <h2 style={styles.sectionTitle}>⚙️ Configuración</h2>
              <Card>
                <div style={styles.configSection}>
                  <h3>Usuario Actual</h3>
                  <p><strong>Nombre:</strong> {user.nombre}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Rol:</strong> {user.rol}</p>
                  <p><strong>Sucursal:</strong> {user.sucursalId}</p>
                  <button onClick={handleLogout} style={{ ...styles.btn, background: theme.danger }}>
                    Cerrar Sesión
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === "lead" && (
        <Modal title="Nuevo Lead" onClose={() => setModal(null)}>
          <Inp
            label="Nombre *"
            value={formLead.nombre}
            onChange={(v) => setFormLead({ ...formLead, nombre: v })}
            placeholder="Nombre del cliente"
          />
          <Inp
            label="Teléfono *"
            value={formLead.telefono}
            onChange={(v) => setFormLead({ ...formLead, telefono: v })}
            placeholder="Ej: 3001234567"
          />
          <Inp
            label="Email"
            value={formLead.email}
            onChange={(v) => setFormLead({ ...formLead, email: v })}
            placeholder="correo@example.com"
          />
          <Sel
            label="Red Social/Origen"
            value={formLead.red}
            options={REDES}
            onChange={(v) => setFormLead({ ...formLead, red: v })}
          />
          <Sel
            label="Campaña Publicitaria"
            value={formLead.campana}
            options={["", ...campaigns.map(c => c.nombre)]}
            onChange={(v) => setFormLead({ ...formLead, campana: v })}
          />
          <Sel
            label="Tipo de Gestión"
            value={formLead.tipoGestion}
            options={["Consulta", "Cotización", "Venta", "Seguimiento", "Cerrado"]}
            onChange={(v) => setFormLead({ ...formLead, tipoGestion: v })}
          />
          <Inp
            label="Consulta/Comentarios"
            value={formLead.consulta}
            onChange={(v) => setFormLead({ ...formLead, consulta: v })}
            placeholder="¿Qué quiere el cliente?"
            multiline
          />
          <Inp
            label="Notas Internas"
            value={formLead.notas}
            onChange={(v) => setFormLead({ ...formLead, notas: v })}
            placeholder="Notas adicionales"
            multiline
          />
          <Sel
            label="Prioridad"
            value={formLead.prioridad}
            options={["baja", "media", "alta"]}
            onChange={(v) => setFormLead({ ...formLead, prioridad: v })}
          />
          <Btn onClick={handleAddLead}>✓ Agregar Lead</Btn>
        </Modal>
      )}

      {modal === "campaign" && (
        <Modal title="Nueva Campaña Publicitaria" onClose={() => setModal(null)}>
          <Inp
            label="Nombre de Campaña *"
            value={formCampaign.nombre}
            onChange={(v) => setFormCampaign({ ...formCampaign, nombre: v })}
            placeholder="Ej: Black Friday 2025, Liquidación Marzo, etc."
          />
          <Btn onClick={handleAddCampaign}>✓ Crear Campaña</Btn>
        </Modal>
      )}

      {modal === "servicio" && (
        <Modal title="Nuevo Servicio Técnico" onClose={() => setModal(null)}>
          <Inp
            label="Cliente"
            value={formServicio.clienteNombre}
            onChange={(v) => setFormServicio({ ...formServicio, clienteNombre: v })}
          />
          <Inp
            label="Teléfono"
            value={formServicio.clienteTel}
            onChange={(v) => setFormServicio({ ...formServicio, clienteTel: v })}
          />
          <Inp
            label="Modelo"
            value={formServicio.modelo}
            onChange={(v) => setFormServicio({ ...formServicio, modelo: v })}
          />
          <Inp
            label="Motivo"
            value={formServicio.motivo}
            onChange={(v) => setFormServicio({ ...formServicio, motivo: v })}
          />
          <Inp
            label="Descripción"
            value={formServicio.descripcion}
            onChange={(v) => setFormServicio({ ...formServicio, descripcion: v })}
            multiline
          />
          <Sel
            label="Prioridad"
            value={formServicio.prioridad}
            options={["baja", "media", "alta"]}
            onChange={(v) => setFormServicio({ ...formServicio, prioridad: v })}
          />
          <Btn onClick={handleAddServicio}>Registrar Servicio</Btn>
        </Modal>
      )}

      {modal === "cliente" && (
        <Modal title="Nuevo Cliente" onClose={() => setModal(null)}>
          <Inp
            label="Nombre *"
            value={formCliente.nombre}
            onChange={(v) => setFormCliente({ ...formCliente, nombre: v })}
            placeholder="Nombre completo"
          />
          <Inp
            label="Teléfono *"
            value={formCliente.telefono}
            onChange={(v) => setFormCliente({ ...formCliente, telefono: v })}
            placeholder="3001234567"
          />
          <Inp
            label="Documento"
            value={formCliente.documento}
            onChange={(v) => setFormCliente({ ...formCliente, documento: v })}
            placeholder="CC o RUC"
          />
          <Inp
            label="Email"
            value={formCliente.email}
            onChange={(v) => setFormCliente({ ...formCliente, email: v })}
            placeholder="correo@ejemplo.com"
          />
          <Inp
            label="Ciudad"
            value={formCliente.ciudad}
            onChange={(v) => setFormCliente({ ...formCliente, ciudad: v })}
            placeholder="Bogotá"
          />
          <Sel
            label="Tipo"
            value={formCliente.tipo}
            options={["Normal", "Especial", "VIP"]}
            onChange={(v) => setFormCliente({ ...formCliente, tipo: v })}
          />
          <Btn onClick={handleAddCliente}>✓ Registrar Cliente</Btn>
        </Modal>
      )}

      {modal === "distribuidor" && (
        <Modal title="Nuevo Distribuidor" onClose={() => setModal(null)}>
          <Inp
            label="Razón Social *"
            value={formDistribuidor.razon}
            onChange={(v) => setFormDistribuidor({ ...formDistribuidor, razon: v })}
            placeholder="Nombre empresa"
          />
          <Inp
            label="Contacto"
            value={formDistribuidor.contacto}
            onChange={(v) => setFormDistribuidor({ ...formDistribuidor, contacto: v })}
            placeholder="Nombre del contacto"
          />
          <Inp
            label="Teléfono *"
            value={formDistribuidor.telefono}
            onChange={(v) => setFormDistribuidor({ ...formDistribuidor, telefono: v })}
            placeholder="3001234567"
          />
          <Inp
            label="Email"
            value={formDistribuidor.email}
            onChange={(v) => setFormDistribuidor({ ...formDistribuidor, email: v })}
            placeholder="contacto@ejemplo.com"
          />
          <Inp
            label="Ciudad"
            value={formDistribuidor.ciudad}
            onChange={(v) => setFormDistribuidor({ ...formDistribuidor, ciudad: v })}
            placeholder="Bogotá"
          />
          <Sel
            label="Tipo"
            value={formDistribuidor.tipo}
            options={["Mayorista", "Distribuidor Regional", "Autorizado"]}
            onChange={(v) => setFormDistribuidor({ ...formDistribuidor, tipo: v })}
          />
          <Inp
            label="Compra Mínima"
            value={formDistribuidor.compraMinima}
            onChange={(v) => setFormDistribuidor({ ...formDistribuidor, compraMinima: parseInt(v) || 0 })}
            type="number"
          />
          <Btn onClick={handleAddDistribuidor}>✓ Agregar Distribuidor</Btn>
        </Modal>
      )}

      {modal === "gasto" && (
        <Modal title="Nuevo Gasto" onClose={() => setModal(null)}>
          <Inp
            label="Fecha"
            value={formGasto.fecha}
            onChange={(v) => setFormGasto({ ...formGasto, fecha: v })}
            type="date"
          />
          <Inp
            label="Concepto *"
            value={formGasto.concepto}
            onChange={(v) => setFormGasto({ ...formGasto, concepto: v })}
            placeholder="Ej: Arriendo, Servicios, etc."
          />
          <Sel
            label="Tipo"
            value={formGasto.tipo}
            options={["Operativo", "Administrativo", "Mantenimiento", "Otro"]}
            onChange={(v) => setFormGasto({ ...formGasto, tipo: v })}
          />
          <Inp
            label="Monto *"
            value={formGasto.monto}
            onChange={(v) => setFormGasto({ ...formGasto, monto: parseFloat(v) || 0 })}
            type="number"
            placeholder="0"
          />
          <Sel
            label="Método Pago"
            value={formGasto.metodoPago}
            options={["Efectivo", "Transferencia", "Tarjeta", "Cheque"]}
            onChange={(v) => setFormGasto({ ...formGasto, metodoPago: v })}
          />
          <Inp
            label="Comprobante"
            value={formGasto.comprobante}
            onChange={(v) => setFormGasto({ ...formGasto, comprobante: v })}
            placeholder="Número de recibo"
          />
          <Inp
            label="Notas"
            value={formGasto.notas}
            onChange={(v) => setFormGasto({ ...formGasto, notas: v })}
            placeholder="Detalles adicionales"
          />
          <Btn onClick={handleAddGasto}>✓ Registrar Gasto</Btn>
        </Modal>
      )}

      {modal === "caja" && (
        <Modal title="Cierre de Caja" onClose={() => setModal(null)}>
          <Inp
            label="Fecha"
            value={formCaja.fecha}
            onChange={(v) => setFormCaja({ ...formCaja, fecha: v })}
            type="date"
          />
          <Inp
            label="Apertura"
            value={formCaja.apertura}
            onChange={(v) => setFormCaja({ ...formCaja, apertura: parseFloat(v) || 0 })}
            type="number"
            placeholder="0"
          />
          <Inp
            label="Observaciones"
            value={formCaja.observaciones}
            onChange={(v) => setFormCaja({ ...formCaja, observaciones: v })}
            placeholder="Notas del cierre"
          />
          <Btn onClick={handleRegistrarCaja}>✓ Registrar Cierre</Btn>
        </Modal>
      )}
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#f5f5f5",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    padding: "15px 20px",
    color: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
  },
  title: {
    margin: "0",
    fontSize: "28px",
    fontWeight: "700",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    fontSize: "14px",
  },
  userInfo: {
    opacity: 0.9,
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  main: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: "220px",
    background: "white",
    borderRight: "1px solid #e0e0e0",
    overflowY: "auto",
    padding: "10px 0",
  },
  navItem: {
    width: "100%",
    padding: "12px 16px",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
  },
  navIcon: {
    fontSize: "18px",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "24px",
    fontWeight: "600",
  },
  btn: {
    padding: "10px 20px",
    background: "#00c853",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  configSection: {
    padding: "20px",
  },
};
