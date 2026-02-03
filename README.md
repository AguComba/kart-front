# Karting Session Logbook (Frontend)

Frontend en React + TypeScript para gestionar SessionDays y Stints de karting.

## Requisitos
- Node.js 18+
- Backend Fastify levantado

## Configuración
Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_API_URL=http://localhost:3000
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Estructura
- `src/features`: módulos por dominio (SessionDays, Stints, Biblioteca)
- `src/api`: cliente axios y tipos
- `src/components`: componentes reutilizables
- `src/utils`: helpers (tiempos, etc.)

## Endpoints esperados
- `GET /session-days`
- `POST /session-days`
- `GET /session-days/:id`
- `POST /session-days/:id/stints`
- `PUT /session-days/:id/stints/:stintId`
- `POST /session-days/:id/stints/duplicate-last`
- `GET/POST/PUT/DELETE /tracks`
- `GET/POST/PUT/DELETE /tire-sets`
- `GET/POST/PUT/DELETE /kart-setups`
