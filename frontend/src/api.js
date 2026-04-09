const BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

async function req(method, path, body) {
  const token = localStorage.getItem("token");
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  
  if (!data.ok) throw new Error(data.error || "Error del servidor");
  return data.data;
}

export const api = {
  // Autenticación
  login: (email, contraseña) => req("POST", "/auth/login", { email, contraseña }),
  registro: (email, contraseña, nombre, sucursalId) => req("POST", "/auth/registro", { email, contraseña, nombre, sucursalId }),
  getMe: () => req("GET", "/auth/me"),

  // Sucursales
  getSucursales: () => req("GET", "/sucursales"),
  addSucursal: (body) => req("POST", "/sucursales", body),

  // Usuarios
  getUsuarios: () => req("GET", "/usuarios"),
  addUsuario: (body) => req("POST", "/usuarios", body),

  // Inventario
  getInventario: () => req("GET", "/inventario"),
  addInventario: (body) => req("POST", "/inventario", body),
  updateInventario: (id, body) => req("PUT", `/inventario/${id}`, body),
  patchStock: (id, delta) => req("PATCH", `/inventario/${id}/stock`, { delta }),
  deleteInventario: (id) => req("DELETE", `/inventario/${id}`),

  // Campaigns
  getCampaigns: () => req("GET", "/campaigns"),
  addCampaign: (nombre) => req("POST", "/campaigns", { nombre }),
  deleteCampaign: (id) => req("DELETE", `/campaigns/${id}`),

  // Leads
  getLeads: () => req("GET", "/leads"),
  getLeadsFiltro: (filtros) => {
    const params = new URLSearchParams(filtros);
    return req("GET", `/leads/filtro?${params.toString()}`);
  },
  addLead: (body) => req("POST", "/leads", body),
  updateLead: (id, body) => req("PUT", `/leads/${id}`, body),
  updateLeadEstado: (id, estado) => req("PATCH", `/leads/${id}/estado`, { estado }),
  updateLeadPrioridad: (id, prioridad) => req("PATCH", `/leads/${id}/prioridad`, { prioridad }),
  deleteLead: (id) => req("DELETE", `/leads/${id}`),

  // Clientes
  getClientes: () => req("GET", "/clientes"),
  addCliente: (body) => req("POST", "/clientes", body),

  // Ventas
  getVentas: () => req("GET", "/ventas"),
  addVenta: (body) => req("POST", "/ventas", body),

  // Entregas
  getEntregas: () => req("GET", "/entregas"),
  addEntrega: (body) => req("POST", "/entregas", body),
  updateEstadoEntrega: (id, estado) => req("PATCH", `/entregas/${id}/estado`, { estado }),

  // Servicios Técnicos
  getServicios: () => req("GET", "/servicios"),
  addServicio: (body) => req("POST", "/servicios", body),
  updateServicio: (id, body) => req("PATCH", `/servicios/${id}`, body),
  deleteServicio: (id) => req("DELETE", `/servicios/${id}`),

  // Ingresos inventario (Bodega)
  getIngresosInventario: () => req("GET", "/ingresos-inventario"),
  addIngresoInventario: (body) => req("POST", "/ingresos-inventario", body),

  // Gastos
  getGastos: () => req("GET", "/gastos"),
  addGasto: (body) => req("POST", "/gastos", body),
  deleteGasto: (id) => req("DELETE", `/gastos/${id}`),

  // Distribuidores
  getDistribuidores: () => req("GET", "/distribuidores"),
  addDistribuidor: (body) => req("POST", "/distribuidores", body),

  // Pedidos distribuidor
  addPedidoDistribuidor: (distribuidorId, body) => req("POST", `/distribuidores/${distribuidorId}/pedidos`, body),
  updateEstadoPedido: (pedidoId, estado) => req("PATCH", `/pedidos/${pedidoId}/estado`, { estado }),

  // Cajas
  getCajas: () => req("GET", "/cajas"),
  addCaja: (body) => req("POST", "/cajas", body),
};
