# 🏗️ Arquitectura Profesional: tuControl — App de Gastos Personales
> Presupuesto: $0 | Stack: 100% Web | Hosting: Vercel + Alternativas Gratuitas

---

## 🎯 Visión General del Producto

**tuControl** es una SaaS web de gestión financiera personal con:
- Control de gastos por portafolios (Personal, Negocio, Pareja, etc.)
- Registro de ingresos y ahorros
- Gráficos y métricas avanzadas
- Exportación a PDF y Excel
- Monetización con anuncios + donaciones
- Autenticación manual (tú autorizas cada usuario)

---

## 🧱 Stack Tecnológico Recomendado

### Frontend + Backend (Full-Stack en un solo proyecto)
| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Next.js 14** (App Router) | Ya lo usas, Vercel lo optimiza, SSR gratis |
| UI | **Tailwind CSS + shadcn/ui** | Componentes premium listos, rápido de usar |
| Gráficos | **Recharts** o **Chart.js** | Gratis, profesional, React-friendly |
| Estado | **Zustand** | Ligero, sin overhead de Redux |
| Formularios | **React Hook Form + Zod** | Validación robusta y performante |
| PDF Export | **jsPDF + html2canvas** | 100% cliente, sin backend extra |
| Excel Export | **SheetJS (xlsx)** | Gratis, muy completo |
| Autenticación | **NextAuth.js v5** | Gratuito, flexible, soporta credenciales propias |
| ORM | **Prisma** | Type-safe, migrations automáticas |

---

## 🗄️ Base de Datos — Alternativas a Supabase (Gratis)

> Agotaste Supabase. Aquí las mejores alternativas **gratuitas**:

### ✅ Opción 1 (RECOMENDADA): **Neon.tech** — PostgreSQL Serverless
- **Plan gratuito:** 0.5 GB storage, 10h compute/mes, siempre activo
- **Por qué:** Compatible con Prisma, serverless-first, excelente DX
- **URL:** [neon.tech](https://neon.tech)
- **Conexión:** `DATABASE_URL=postgresql://...`

### ✅ Opción 2: **Turso** (SQLite distribuido)
- **Plan gratuito:** 500 DBs, 9GB storage, 1B filas leídas/mes
- **Por qué:** Ultra rápido, serverless edge
- **Stack:** Prisma + libSQL driver

### ✅ Opción 3: **MongoDB Atlas**
- **Plan gratuito:** 512MB storage
- **Por qué:** Flexible para datos dinámicos como portafolios
- **Stack:** Mongoose o Prisma con adaptador MongoDB

> 💡 **Mi recomendación: Neon.tech** — PostgreSQL es ideal para datos financieros relacionales, y tiene el plan más generoso.

---

## 🔐 Autenticación y Seguridad

### Sistema de Auth: NextAuth.js v5 (Auth.js)

```
Flujo de registro / acceso:
1. Usuario ve la Landing Page (pública)
2. Llena formulario de contacto → te llega un email
3. TÚ verificas el pago externo
4. TÚ creas el usuario manualmente en el panel admin
5. Le envías las credenciales al usuario
6. Usuario inicia sesión con email + contraseña
```

### Configuración de Seguridad

| Medida | Implementación | Costo |
|--------|---------------|-------|
| **SSL/HTTPS** | Vercel lo provee automáticamente | $0 |
| **Contraseñas hasheadas** | bcrypt (incluido en NextAuth) | $0 |
| **JWT Sessions** | NextAuth maneja tokens seguros | $0 |
| **Rate Limiting** | `@upstash/ratelimit` + Upstash Redis (gratis) | $0 |
| **CSRF Protection** | NextAuth lo incluye por defecto | $0 |
| **Headers de Seguridad** | `next.config.js` headers | $0 |
| **Variables de entorno** | `.env.local` + Vercel Env Vars | $0 |
| **Roles de usuario** | Campo `role` en DB: `admin`, `user` | $0 |
| **Middleware de rutas** | Next.js Middleware protege rutas privadas | $0 |

### Headers de Seguridad Recomendados (next.config.js)
```js
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
  { key: 'Content-Security-Policy', value: "default-src 'self'..." }
]
```

---

## 💰 Monetización: Anuncios + Donaciones

### Anuncios (Google AdSense)
- **Requisito:** Dominio propio, contenido de calidad
- **Implementación:** Componente `<AdBanner>` que se oculta si `user.isPremium === true`
- **Control:** En tu panel admin, marcas al usuario como premium tras su donación

### Donaciones (Ko-fi, PayPal.me, Stripe Links — sin integración)
- **Flujo:** Landing page con botón "Quitar anuncios → Donar aquí"
- **Sin pasarela en el código** → enlace externo a Ko-fi/PayPal
- **Tú recibes el pago → actualizas `user.isPremium = true` en tu panel admin**

```
Usuario dona → Te contacta → Tú marcas isPremium → Anuncios desaparecen
```

---

## 🏠 Hosting — Todo Gratis

| Servicio | Plataforma | Límite Gratis |
|---------|-----------|--------------|
| **Frontend + API** | **Vercel** | 100GB bandwidth, deployments ilimitados |
| **Base de Datos** | **Neon.tech** | 0.5GB, suficiente para miles de usuarios |
| **Rate Limiting Cache** | **Upstash Redis** | 10,000 req/día gratis |
| **Email transaccional** | **Resend.com** | 3,000 emails/mes gratis |
| **Dominio** | **js.org o .eu.org** | Gratuitos con verificación |

> ⚠️ **Dominio propio:** Para Google AdSense necesitas dominio. `.eu.org` es gratuito y aceptado.

---

## 📁 Arquitectura de la DB (Modelo Relacional)

```
User
├── id, email, passwordHash, name
├── role: 'admin' | 'user'
├── isPremium: boolean
└── createdAt

Portfolio (Portafolios de gastos)
├── id, name, label (Personal/Negocio/etc), color/icon
├── userId → User
└── createdAt

Transaction (Gastos, Ingresos, Ahorros)
├── id, amount, description, date
├── type: 'expense' | 'income' | 'saving'
├── category: string
├── portfolioId → Portfolio
└── createdAt

Category
├── id, name, icon, color
└── userId → User (categorías personalizadas)
```

---

## 🗺️ Estructura de Rutas de la App

```
/ (Landing pública)
  ├── /contact (formulario de contacto → email a ti)
  ├── /login
  └── /dashboard (protegida)
      ├── /dashboard (resumen general)
      ├── /dashboard/portfolio/[id] (portafolio específico)
      ├── /dashboard/transactions (lista de transacciones)
      ├── /dashboard/savings (ahorros)
      ├── /dashboard/reports (exportar PDF/Excel)
      └── /dashboard/settings
/admin (solo role: admin)
  ├── /admin/users (gestionar usuarios)
  └── /admin/approve (aprobar nuevos accesos)
```

---

## 📊 Funcionalidades Clave — Implementación

### Portafolios con "+"
```jsx
// Botón + abre modal → crea Portfolio en DB
// Tabs o sidebar lista todos los portafolios del usuario
// Cada portafolio es una "pantalla" independiente
```

### Gráficos Profesionales (Recharts)
- Gráfico de dona: distribución de gastos por categoría
- Gráfico de barras: ingresos vs gastos por mes
- Gráfico de línea: evolución de ahorros
- Gauge: % de presupuesto usado

### Exportación
- **PDF:** `jsPDF + html2canvas` → captura la vista y genera PDF
- **Excel:** `SheetJS` → exporta tabla de transacciones

### Resend (Email)
- Notificación cuando alguien te contacta por la landing
- Bienvenida al usuario cuando lo apruebas

---

## 🚀 Hoja de Ruta de Construcción (Phases)

### Fase 1 — Fundación (Semana 1-2)
- [ ] Setup Next.js 14 + Tailwind + shadcn/ui en Vercel
- [ ] Configurar Neon.tech + Prisma
- [ ] Implementar NextAuth.js (Credentials provider)
- [ ] Landing page + formulario de contacto (Resend)
- [ ] Panel Admin básico: crear/desactivar usuarios

### Fase 2 — Core App (Semana 3-4)
- [ ] CRUD de Portafolios
- [ ] CRUD de Transacciones (gasto/ingreso/ahorro)
- [ ] Dashboard con métricas básicas
- [ ] Gráficos con Recharts

### Fase 3 — Features Avanzados (Semana 5-6)
- [ ] Exportación PDF y Excel
- [ ] Categorías personalizadas
- [ ] Filtros y búsqueda avanzada
- [ ] Notificaciones y alertas de presupuesto

### Fase 4 — Monetización (Semana 7)
- [ ] Integrar Google AdSense
- [ ] Lógica isPremium para ocultar anuncios
- [ ] Landing page optimizada para conversión
- [ ] SEO básico

---

## 📦 Dependencias Clave del Proyecto

```json
{
  "dependencies": {
    "next": "^14",
    "next-auth": "^5",
    "@prisma/client": "^5",
    "prisma": "^5",
    "recharts": "^2",
    "react-hook-form": "^7",
    "zod": "^3",
    "zustand": "^4",
    "jspdf": "^2",
    "html2canvas": "^1",
    "xlsx": "^0.18",
    "resend": "^3",
    "bcryptjs": "^2",
    "@upstash/ratelimit": "^1",
    "shadcn-ui": "latest"
  }
}
```

---

## ✅ Checklist de Seguridad Final

- [x] HTTPS automático en Vercel
- [x] Contraseñas nunca en texto plano (bcrypt)
- [x] JWT con secreto fuerte (`NEXTAUTH_SECRET`)
- [x] Rate limiting en login (evitar brute force)
- [x] Validación de inputs con Zod (frontend + backend)
- [x] Rutas protegidas con Middleware
- [x] Variables sensibles en `.env` nunca en git
- [x] Panel admin accesible solo a `role: admin`
- [x] Datos de usuario aislados por `userId` en todas las queries

---

## 💡 Resumen Ejecutivo

| Aspecto | Decisión |
|---------|---------|
| **Framework** | Next.js 14 (Full-Stack) |
| **DB** | Neon.tech (PostgreSQL gratis) |
| **Auth** | NextAuth.js v5 + bcrypt |
| **Hosting** | Vercel (ya lo tienes) |
| **Email** | Resend.com (3k/mes gratis) |
| **Anuncios** | Google AdSense |
| **Donaciones** | Ko-fi / PayPal (enlace externo) |
| **Costo total** | **$0/mes** |

