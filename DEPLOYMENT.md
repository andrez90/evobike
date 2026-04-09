# Deployment a Netlify

## Frontend (Netlify)

1. Conecta tu repositorio GitHub a Netlify
2. Configura los siguientes valores en Netlify Deploy Settings:

**Build Command:**
```
cd frontend && npm run build
```

**Publish Directory:**
```
frontend/build
```

**Environment Variables:**
```
REACT_APP_API_URL=https://tu-backend.herokuapp.com/api
```

3. El archivo `netlify.toml` está configurado automáticamente
4. El archivo `_redirects` en `frontend/public` redirige todas las rutas a index.html

## Backend (Heroku o similar)

1. Crear cuenta en Heroku
2. `heroku login`
3. `heroku create tu-app-name`
4. En el backend root: `git subtree push --prefix backend heroku main`
5. Obtener la URL: `heroku open`

## Backend (Railway.app) - Alternativa más fácil

1. Conecta tu GitHub a railway.app
2. Selecciona el repositorio
3. Crea servicio NODE
4. Railway detecta automáticamente backend/package.json
5. Obtiene la URL pública automáticamente

## Variables de Ambiente para Backend

En tu servicio de hosting, configura:
- `PORT=5000` (o el que uses)
- Los datos de JWT si los necesitas

## Testing Local con URLs de Producción

Edita `frontend/src/api.js`:
```javascript
const BASE = "https://tu-dominio.herokuapp.com/api";
```

Y haz `npm run build` para compilar con URLs de producción.
