import React, { useState } from "react";

export const G = {
  negro: "#0d0d0d", gris1: "#1c1c1e", gris2: "#2c2c2e", gris3: "#6b7280",
  grisBorde: "#e4e4e0", grisClaro: "#f7f7f5", blanco: "#ffffff", texto: "#1a1a1a",
};

export const fmtCOP = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
export const hoy = () => new Date().toISOString().split("T")[0];
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function Badge({ label, color = "#00c853", bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color, background: bg || color + "22",
      padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", display: "inline-block"
    }}>{label}</span>
  );
}

export function Btn({ children, onClick, color = "#00c853", outline, small, disabled, full, icon }) {
  const bg = disabled ? "#d1d5db" : outline ? "transparent" : color;
  const tc = disabled ? "#9ca3af" : outline ? color : "#fff";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, color: tc, border: `1.5px solid ${disabled ? "#d1d5db" : color}`,
      borderRadius: 8, padding: small ? "6px 12px" : "10px 20px",
      fontSize: small ? 12 : 13, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.15s", width: full ? "100%" : undefined,
      justifyContent: full ? "center" : undefined,
    }}>{icon && <span>{icon}</span>}{children}</button>
  );
}

export function Inp({ label, value, onChange, type = "text", placeholder, full, readOnly }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, ...(full ? { gridColumn: "1/-1" } : {}) }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: G.gris3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder} readOnly={readOnly}
        style={{
          padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${G.grisBorde}`,
          fontSize: 13, background: readOnly ? G.grisClaro : G.blanco,
          fontFamily: "inherit", outline: "none", color: G.texto, width: "100%", boxSizing: "border-box"
        }} />
    </div>
  );
}

export function Sel({ label, value, onChange, opts, options, full }) {
  const optsList = options || opts || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, ...(full ? { gridColumn: "1/-1" } : {}) }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: G.gris3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <select value={value || ""} onChange={e => onChange(e.target.value)}
        style={{ padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${G.grisBorde}`, fontSize: 13, background: G.blanco, fontFamily: "inherit", color: G.texto }}>
        {Array.isArray(optsList) && optsList.map(o => <option key={typeof o === "object" ? o.v : o} value={typeof o === "object" ? o.v : o}>{typeof o === "object" ? o.l : o}</option>)}
      </select>
    </div>
  );
}

export function Modal({ title, children, onClose, wide, xwide }) {
  const w = xwide ? 860 : wide ? 620 : 480;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: G.blanco, borderRadius: 18, padding: 28, width: w, maxWidth: "95vw", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: G.texto }}>{title}</h2>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: G.gris3 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Grid({ cols = 2, gap = 14, children }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, marginBottom: 16 }}>{children}</div>;
}

export function Card({ children, style = {} }) {
  return <div style={{ background: G.blanco, borderRadius: 14, padding: 20, border: `1px solid ${G.grisBorde}`, ...style }}>{children}</div>;
}

export function Kpi({ label, value, icon, color = "#00c853", sub }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: G.gris3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <div style={{ width: 32, height: 32, background: color + "18", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: G.gris3, marginTop: 6 }}>{sub}</div>}
    </Card>
  );
}

export function SectionHdr({ title, subtitle, action, actionLabel }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.4px", color: G.texto }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: G.gris3, marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action && <Btn onClick={action}>{actionLabel || "Agregar"}</Btn>}
    </div>
  );
}

export function DataTable({ cols, rows, data, columns, empty = "Sin registros" }) {
  // Soportar ambos formatos: (cols, rows) o (data, columns)
  let finalCols = cols;
  let finalRows = rows;

  if (data && columns) {
    finalCols = columns;
    finalRows = (Array.isArray(data) ? data : []).map(item =>
      columns.map(col => item[col])
    );
  }

  // Validar que tenemos datos válidos
  if (!finalCols || !Array.isArray(finalCols)) finalCols = [];
  if (!finalRows || !Array.isArray(finalRows)) finalRows = [];

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: G.grisClaro }}>
              {finalCols.map(c => <th key={c} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, color: G.gris3, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", borderBottom: `1px solid ${G.grisBorde}` }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {finalRows.length === 0
              ? <tr><td colSpan={finalCols.length} style={{ padding: 36, textAlign: "center", color: G.gris3 }}>{empty}</td></tr>
              : finalRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${G.grisBorde}`, background: i % 2 ? G.grisClaro : "#fff" }}>
                  {Array.isArray(row) ? row.map((cell, j) => <td key={j} style={{ padding: "10px 14px", verticalAlign: "middle" }}>{cell}</td>)
                    : finalCols.map(col => <td key={col} style={{ padding: "10px 14px", verticalAlign: "middle" }}>{row[col]}</td>)
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function InlineEdit({ value, onSave, type = "text" }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  if (editing) return (
    <input autoFocus type={type} value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => { onSave(val); setEditing(false); }}
      onKeyDown={e => { if (e.key === "Enter") { onSave(val); setEditing(false); } }}
      style={{ width: 100, padding: "4px 8px", borderRadius: 6, border: "1.5px solid #00c853", fontSize: 12, fontFamily: "inherit" }} />
  );
  return (
    <span onClick={() => { setVal(value); setEditing(true); }}
      style={{ cursor: "pointer", borderBottom: "1px dashed #ccc", padding: "1px 2px" }} title="Click para editar">
      {type === "number" ? Number(value).toLocaleString("es-CO") : value}
    </span>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#00c853", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Alert({ msg, type = "error", onClose }) {
  const colors = { error: "#ef4444", ok: "#00c853", success: "#00c853", warn: "#f97316" };
  const color = colors[type] || colors.error;
  
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: G.blanco, border: `2px solid ${color}`, borderRadius: 12, padding: "14px 20px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", display: "flex", gap: 10, alignItems: "center", minWidth: 280, maxWidth: 400 }}>
      <span style={{ color, fontWeight: 700, fontSize: 13, flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: G.gris3, fontSize: 16 }}>✕</button>
    </div>
  );
}
