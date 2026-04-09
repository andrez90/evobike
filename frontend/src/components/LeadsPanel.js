import React, { useState } from "react";
import { api } from "../api";

const ESTADOS = ["Nuevo", "Contactado", "Interesado", "Negociado", "Cerrado", "Descartado"];
const PRIORIDADES = ["baja", "media", "alta"];
const COLORS = {
  alta: "#ef4444",
  media: "#f97316",
  baja: "#10b981",
};

export default function LeadsPanel({ leads, onRefresh, theme }) {
  const [draggedLead, setDraggedLead] = useState(null);
  const [filtros, setFiltros] = useState({ estado: "", prioridad: "", red: "" });
  const [editingLead, setEditingLead] = useState(null);

  const leadsFiltrados = leads.filter((lead) => {
    if (filtros.estado && lead.estado !== filtros.estado) return false;
    if (filtros.prioridad && lead.prioridad !== filtros.prioridad) return false;
    if (filtros.red && lead.red !== filtros.red) return false;
    return true;
  });

  const leadsPorEstado = ESTADOS.reduce((acc, estado) => {
    acc[estado] = leadsFiltrados.filter((l) => l.estado === estado);
    return acc;
  }, {});

  const handleDragStart = (lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, nuevoEstado) => {
    e.preventDefault();
    if (!draggedLead) return;

    try {
      await api.updateLeadEstado(draggedLead.id, nuevoEstado);
      setDraggedLead(null);
      onRefresh();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handlePrioridadChange = async (leadId, nuevaPrioridad) => {
    try {
      await api.updateLeadPrioridad(leadId, nuevaPrioridad);
      onRefresh();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("¿Eliminar este lead?")) return;
    try {
      await api.deleteLead(leadId);
      onRefresh();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Filtros */}
      <div style={styles.filtersBar}>
        <select
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          style={styles.filterSelect}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        <select
          value={filtros.prioridad}
          onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value })}
          style={styles.filterSelect}
        >
          <option value="">Todas las prioridades</option>
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFiltros({ estado: "", prioridad: "", red: "" })}
          style={styles.clearButton}
        >
          Limpiar filtros
        </button>
      </div>

      {/* Tablero Kanban */}
      <div style={styles.kanban}>
        {ESTADOS.map((estado) => (
          <div
            key={estado}
            style={styles.column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, estado)}
          >
            <div style={styles.columnHeader}>
              <h3 style={styles.columnTitle}>{estado}</h3>
              <span style={styles.columnBadge}>{leadsPorEstado[estado].length}</span>
            </div>

            <div style={styles.cardsList}>
              {leadsPorEstado[estado].map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead)}
                  style={{
                    ...styles.card,
                    borderLeftColor: COLORS[lead.prioridad],
                    opacity: draggedLead?.id === lead.id ? 0.5 : 1,
                  }}
                >
                  {/* Prioridad Badge */}
                  <div style={styles.cardHeader}>
                    <span
                      style={{
                        ...styles.priorityBadge,
                        background: COLORS[lead.prioridad],
                      }}
                    >
                      {lead.prioridad.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      style={styles.deleteBtn}
                    >
                      ×
                    </button>
                  </div>

                  {/* Nombre */}
                  <h4 style={styles.cardName}>{lead.nombre}</h4>

                  {/* Info */}
                  <div style={styles.cardInfo}>
                    {lead.telefono && (
                      <p style={styles.infoRow}>
                        <strong>📱</strong> {lead.telefono}
                      </p>
                    )}
                    {lead.email && (
                      <p style={styles.infoRow}>
                        <strong>✉️</strong> {lead.email}
                      </p>
                    )}
                    {lead.red && (
                      <p style={styles.infoRow}>
                        <strong>🌐</strong> {lead.red}
                      </p>
                    )}
                    {lead.consulta && (
                      <p style={styles.infoRow}>
                        <strong>💬</strong> {lead.consulta.substring(0, 50)}...
                      </p>
                    )}
                  </div>

                  {/* Prioridad selector */}
                  <div style={styles.prioritySelector}>
                    {PRIORIDADES.map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePrioridadChange(lead.id, p)}
                        style={{
                          ...styles.priorityBtn,
                          background:
                            lead.prioridad === p
                              ? COLORS[p]
                              : "transparent",
                          color: lead.prioridad === p ? "white" : COLORS[p],
                          border: `1px solid ${COLORS[p]}`,
                        }}
                      >
                        {p[0].toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Fecha */}
                  <small style={styles.cardDate}>{lead.fecha}</small>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#f9fafb",
    minHeight: "calc(100vh - 80px)",
  },
  filtersBar: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterSelect: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
  },
  clearButton: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  kanban: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    overflowX: "auto",
  },
  column: {
    background: "#fff",
    borderRadius: "8px",
    padding: "15px",
    minHeight: "600px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "2px solid #f0f0f0",
  },
  columnTitle: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
  },
  columnBadge: {
    background: "#e5e7eb",
    color: "#666",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  cardsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderLeft: "4px solid #f97316",
    borderRadius: "6px",
    padding: "12px",
    cursor: "grab",
    transition: "all 0.2s",
    userSelect: "none",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  priorityBadge: {
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#999",
  },
  cardName: {
    margin: "0 0 8px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#000",
  },
  cardInfo: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "8px",
  },
  infoRow: {
    margin: "4px 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  prioritySelector: {
    display: "flex",
    gap: "4px",
    marginTop: "8px",
  },
  priorityBtn: {
    padding: "4px 8px",
    fontSize: "11px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cardDate: {
    display: "block",
    marginTop: "8px",
    color: "#999",
  },
};
