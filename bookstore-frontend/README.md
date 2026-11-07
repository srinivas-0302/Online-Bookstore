# Online Book Store: Frontend

React (Vite) single page application for the Online Book Store.

## Run
```
npm install
npm run dev        # development on http://localhost:5173
npm run build      # production build in the dist folder
npm run preview    # test the production build on http://localhost:4173
```

## Configuration
Create `.env` (development) and `.env.production` (production build):
```
VITE_API_BASE_URL=http://localhost:8181
```
Never put secrets in `VITE_` variables. They are visible to every visitor.

## Structure
`src/api` (server calls) · `src/components` · `src/context` (auth, cart, theme, toast) · `src/hooks` · `src/pages` · `src/utils`