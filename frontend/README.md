# LUXORA — Phase 1 foundation
Next.js 15 (App Router) + TypeScript + Tailwind 3. EN/FA (RTL), light/dark theme, header/footer, Home, Shop (demo), Brands, About, Contact.

    npm install
    npm run dev      # http://localhost:3000  (redirects to /en or /fa)
    npm run build && npm run typecheck

Content lives in src/dictionaries/{en,fa}.ts. Demo data (src/data/demo.ts) is placeholder only.
Not built yet: database, auth, cart/checkout, admin, real 3D, region/currency model (docs/prompts/01).
