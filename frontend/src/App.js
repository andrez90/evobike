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
    estado: "Nuevo", prioridad: "media", notas: "", tipo: "cliente",
  });

  const [formVenta, setFormVenta] = useState({
    clienteNombre: "", clienteTel: "", clienteDoc: "", ciudad: "", metodoPago: "Efectivo",
    items: [], conEntrega: false, transportadora: "", valorEnvio: 0,
  });

  const [formServicio, setFormServicio] = useState({
    clienteNombre: "", clienteTel: "", clienteDoc: "", modelo: "", motivo: "",
    descripcion: "", tecnico: "", estado: "Recibido", prioridad: "media",
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
        api.getInventario(),
        api.getCampaigns(),
        api.getLeads(),
        api.getClientes(),
        api.getVentas(),
        api.getEntregas(),
        api.getServicios(),
        api.getIngresosInventario(),
        api.getGastos(),
        api.getDistribuidores(),
        api.getSucursales(),
      ]);

      setInventario(inv);
      setCampaigns(camps);
      setLeads(leadsData);
      setClientes(clients);
      setVentas(ventasData);
      setEntregas(entregasData);
      setServicios(serviciosData);
      setIngresos(ingresosData);
      setGastos(gastosData);
      setDistribuidores(distribuidoresData);
      setSucursales(sucursalesData);
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
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
        fecha: new Date().toISOString().split("T")[0],
      });
      setFormLead({
        nombre: "", telefono: "", email: "", red: "Directo", consulta: "",
        estado: "Nuevo", prioridad: "media", notas: "", tipo: "cliente",
      });
      setModal(null);
      loadData();
      setAlert({ type: "ok", msg: "Lead agregado" });
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
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
              <LeadsPanel leads={leads} onRefresh={loadData} theme={theme} />
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
            label="Nombre"
            value={formLead.nombre}
            onChange={(v) => setFormLead({ ...formLead, nombre: v })}
          />
          <Inp
            label="Teléfono"
            value={formLead.telefono}
            onChange={(v) => setFormLead({ ...formLead, telefono: v })}
          />
          <Inp
            label="Email"
            value={formLead.email}
            onChange={(v) => setFormLead({ ...formLead, email: v })}
          />
          <Sel
            label="Red Social"
            value={formLead.red}
            options={REDES}
            onChange={(v) => setFormLead({ ...formLead, red: v })}
          />
          <Inp
            label="Consulta"
            value={formLead.consulta}
            onChange={(v) => setFormLead({ ...formLead, consulta: v })}
            multiline
          />
          <Sel
            label="Prioridad"
            value={formLead.prioridad}
            options={["baja", "media", "alta"]}
            onChange={(v) => setFormLead({ ...formLead, prioridad: v })}
          />
          <Btn onClick={handleAddLead}>Agregar Lead</Btn>
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
