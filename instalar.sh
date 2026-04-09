#!/bin/bash
# EvoBike ERP - Script de inicio rápido
echo "⚡ EvoBike ERP - Iniciando sistema..."
echo ""

# Backend
echo "📦 Instalando dependencias del backend..."
cd backend && npm install
echo "✅ Backend listo"
echo ""

# Frontend
echo "🎨 Instalando dependencias del frontend..."
cd ../frontend && npm install
echo "✅ Frontend listo"
echo ""

echo "🚀 Para iniciar el sistema:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm start"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm start"
echo ""
echo "  Luego abre: http://localhost:3000"
