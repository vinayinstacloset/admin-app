# InstaCloset – Admin Web App (TypeScript)

A TypeScript React admin dashboard for InstaCloset, built with the **same
architecture and stack** as the vendor app: Zustand + Redux Toolkit, an
Axios client with token-refresh interceptors, a feature-folder structure
(`api / hooks / screens / types / utils / validation / components` per
feature), and a shared `DashboardLayout` with `Sidebar` + `Topbar`.

Only the **admin** flows are implemented — nothing vendor-specific was
carried over except the folder pattern itself.

## Tech stack

- **React 19 + TypeScript + Vite**
- **React Router v6** — routing, with `ProtectedRoute` / `PublicRoute` guards
- **Zustand** (`persist` middleware) — auth session (access/refresh token, admin profile) + UI state (sidebar collapse, mobile drawer, filters)
- **Redux Toolkit + react-redux** — cross-feature app state (`orders` slice, `adminUi` slice)
- **TanStack Query** — wired up at the root (`QueryClientProvider`), ready for any feature to adopt
- **Axios** — per-domain API clients (`clientAdmin`, `clientOrders`, `clientVendors`, `clientRiders`, `clientCustomers`) all sharing one interceptor pipeline with automatic 401 → refresh → retry
- **MUI Drawer** — mobile + desktop sidebar shell (matches the vendor app's layout primitive)
- **Tailwind CSS** — styling, brand color palette lifted from the vendor app's theme
- **Zod** — form validation schemas per feature
- **Recharts** — revenue / sales / money-spent charts
- **lucide-react** — icon set

## Getting started

```bash
npm install
cp .env.example .env      # already included — point VITE_API_* at your real backend
npm run dev                # http://localhost:5173
npm run build               # tsc -b && vite build -> dist/
npm run preview
```

The app runs fully standalone without a backend: every feature's `api/`
layer tries the real endpoint first and **falls back to realistic mock
data** if the request fails (see `console.warn` in the browser console).
Swap in real endpoints in `config/env.ts` / `.env` and the mock fallback
simply stops firing — no other code changes needed.

## Folder structure

```
src/
├── main.tsx                     # Redux Provider, QueryClientProvider, BrowserRouter
├── App.tsx                      # All route definitions (compulsory, per spec)
├── index.css
├── vite-env.d.ts
│
├── config/
│   └── env.ts                   # Single source of truth for import.meta.env
│
├── themes/
│   └── colors.ts                 # Shared color tokens (brand, semantic, gray…)
│
├── store/
│   ├── redux/
│   │   ├── store.ts               # configureStore
│   │   ├── hooks.ts               # useAppDispatch / useAppSelector
│   │   └── slices/
│   │       ├── ordersSlice.ts
│   │       └── adminUiSlice.ts
│   └── zustand/
│       ├── authStore.ts           # persisted access/refresh token + admin profile
│       ├── uiStore.ts             # sidebar collapse / mobile drawer / filters
│       └── useAuthHydrated.ts     # guards render until persisted state hydrates
│
├── routes/
│   ├── ProtectedRoute.tsx         # requires accessToken, else -> /login
│   └── PublicRoute.tsx            # if already logged in -> /admin-dashboard
│
├── layouts/
│   ├── DashboardLayout.tsx        # Sidebar + Topbar shell, MUI Drawer, Outlet context
│   └── useDashboardOutletContext.ts
│
├── shared/
│   ├── api/
│   │   ├── apiError.ts            # getApiErrorMessage / status helpers
│   │   ├── constants.ts
│   │   ├── auth/authClient.ts      # bare axios instance for login/OTP/refresh
│   │   └── client/
│   │       ├── apiClient.ts        # per-domain axios instances
│   │       ├── interceptors.ts     # auth header + 401 refresh-and-retry
│   │       ├── tokenRefresh.ts     # single-flight refresh
│   │       └── requestManager.ts   # AbortController bookkeeping
│   ├── components/
│   │   ├── common/                 # Logo, AuthLayout, StatCard, StatusBadge, buttons/, forms/
│   │   ├── layout/                 # Sidebar.tsx, Topbar.tsx
│   │   ├── modals/                 # Modal.tsx, SuccessModal.tsx
│   │   └── PlaceholderScreen.tsx   # shared "coming soon" shell for empty modules
│   ├── constants/navigation.ts     # single source of truth for sidebar sections
│   └── utils/                      # currency, time, admin validation helpers
│
└── features/
    ├── login/                      # api, hooks, screens, types, validation, utils
    ├── registration/
    ├── forgot-password/            # email -> OTP -> new password -> success, one flow
    ├── overview/                   # ✅ full screen: stats, revenue chart, alerts, recent orders, top vendors
    ├── orders/                     # ✅ OrderDetailsScreen (map, items, reassign-rider modal); OrdersScreen placeholder
    ├── customers/                  # ✅ CustomerDetailsScreen; CustomersScreen placeholder
    ├── vendors/                    # ✅ VendorDetailsScreen; VendorsScreen placeholder
    ├── riders/                     # ✅ RiderDetailsScreen; RidersScreen placeholder
    ├── store/                      # scaffolded only (api/hooks/screens/types/utils/validation)
    ├── catalogue/                  # scaffolded only
    ├── approvals/                  # scaffolded only
    ├── admins/                     # scaffolded only
    ├── support/                    # scaffolded only
    ├── live-delivery/              # scaffolded only
    ├── ticket-issue/               # scaffolded only
    ├── escalation-tickets/         # scaffolded only
    ├── analytics/                  # scaffolded only
    ├── price-markup/               # scaffolded only
    ├── brands/                     # scaffolded only
    ├── banner-campaigns/           # scaffolded only
    ├── finance/                    # scaffolded only
    ├── returns/                    # scaffolded only
    └── loading/LoadingScreen.tsx
```

Every "scaffolded only" feature already has the full
`api/index.ts`, `hooks/index.ts`, `types/*.types.ts`,
`validation/*.schema.ts`, `utils/*.utils.ts`, `screens/*Screen.tsx`
skeleton wired into `App.tsx` and the sidebar — the screen renders a
clean `PlaceholderScreen` today, since no design was supplied for that
tab yet. Drop the real UI into the existing `screens/` file and the
route, breadcrumb, and sidebar highlight all keep working with zero
other changes.

## Routes

| Path                                   | Screen                       |
|-----------------------------------------|-------------------------------|
| `/login`                                | Login                          |
| `/register`                             | Registration                   |
| `/forgot-password`                      | Forgot password → OTP → new password |
| `/admin-dashboard`                      | Overview                       |
| `/admin-dashboard/orders/:orderId`      | Order details (map, reassign rider) |
| `/admin-dashboard/customers/:customerId`| Customer details               |
| `/admin-dashboard/vendor/:vendorId`     | Vendor details                 |
| `/admin-dashboard/riders/:riderId`      | Rider details                  |
| `/admin-dashboard/{store,orders,catalogue,approvals,customers,admins,vendor,riders,support,live-delivery,ticket-issue,escalation-ticket,analytics,price-markup,brands,banner-campaigns,finance,returns}` | One placeholder screen per sidebar tab |

## How auth + the dashboard chrome fit together

1. `authStore` (Zustand, persisted to `sessionStorage`) holds the access/refresh
   token and admin profile.
2. `ProtectedRoute` / `PublicRoute` read `authStore` to decide whether to
   render the route or redirect.
3. `DashboardLayout` renders `Sidebar` + `Topbar` once, and exposes
   `setPageAction` / `setExtraCrumbs` through React Router's `Outlet`
   context (see `useDashboardOutletContext`) — so a screen like
   `OrderDetailsScreen` can push a "Reassign rider" button and an
   `#OD-5490` breadcrumb into the shared Topbar without either
   component knowing about the other.
4. Every Axios client (`clientAdmin`, `clientOrders`, `clientVendors`,
   `clientRiders`, `clientCustomers`) shares the same request/response
   interceptor: it attaches the bearer token, and on a 401 it calls
   `tokenRefresh.ts` once (single-flight) and retries the original
   request — the same pattern used by the vendor app.
