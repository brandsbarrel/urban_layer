# BACKEND_SPECIFICATION.md
## Urban Layers Co. — Enterprise Ecommerce Backend Specification

**Status:** Final. Derived exclusively from the built React + Redux Admin Panel (Dashboard, Products, Product Form, Categories, Orders, Customers, Coupons & Offers, Blogs, Blog Form) and the Admin Panel Workflow business rules that governed that build.

## Implementation Progress

**Last updated:** August 11, 2026

### Completed
- Product admin form now supports phone-case ecommerce data end-to-end: required phone model, case-style categories, bulk image URL entry, featured image URL, gallery image URLs, cost price, tax rate, package type, shipping class, fragile flag, weight, and package dimensions. Product edit mode fetches the full backend product detail so saved media and delivery fields reload correctly.
- Product images are URL-only for now; no multipart file upload endpoint is active.
- Categories now support `phoneModels`, letting each case style store phone names such as iPhone 16 Pro or Samsung S25 Ultra.
- Product backend model, validation, and admin form response mapping now include media/gallery, pricing/tax, and shipping/delivery fields needed by the admin frontend.
- Simplified auth after implementation feedback: admin/customer login now returns a single access token, frontend stores the admin token in `localStorage`, and API requests send `Authorization: Bearer <token>`. Refresh-token cookies, refresh routes, and Redis-backed refresh sessions are no longer part of the active implementation.
- Phase 1 foundation scaffold has been created in `backend/src`.
- Added `package.json` with the initial runtime dependencies required for the backend foundation.
- Added Zod-based environment validation in `src/config/env.schema.js`.
- Added structured Pino logger setup in `src/config/logger.js`.
- Added MongoDB and Redis connection modules in `src/database/`.
- Added shared API success/error response helpers in `src/shared/api-response.js`.
- Added centralized custom error classes in `src/shared/app-error.js`.
- Added base middlewares for request IDs, 404 handling, and centralized error handling.
- Added Express app assembly in `src/app.js` with Helmet, CORS, compression, cookie parsing, JSON parsing, request logging, and Mongo sanitization.
- Added server bootstrap and graceful shutdown flow in `src/server.js`.
- Added a minimal `/api/health` route for boot verification.
- Added Phase 2 auth foundations:
- Admin and Customer role constants plus auth constants.
- `Admin` and `Customer` Mongoose models, including embedded address schema and customer `avgOrderValue` virtual.
- Admin and Customer repositories for basic auth lookups and updates.
- Shared validation middleware plus auth Zod schemas for admin login, customer register/login, and admin creation.
- Password hashing and JWT utility helpers.
- Shared token service for issuing access/refresh tokens, refresh-session rotation, refresh-cookie helpers, and access-token revocation storage.
- Admin auth service and customer auth service.
- `authenticate(realm)` and `authorize(...roles)` middlewares.
- Admin auth routes under `/api/admin/auth/*`.
- Customer auth routes under `/api/customer/auth/*`.
- Added Phase 3 catalog foundations:
- Category and Product constants.
- `Category` and `Product` Mongoose models.
- Category and Product repositories.
- Catalog validators for category/product create and update flows.
- Shared slugify, SEO score, and pagination helpers.
- Category service with list/create/update/toggle-visibility/move/delete logic.
- Product service with list/detail/create/update/archive/delete logic.
- Admin-protected category routes under `/api/admin/categories/*`.
- Admin-protected product routes under `/api/admin/products/*`.
- Frontend-oriented response mapping so product/category list and detail payloads align with the current admin UI field names where practical.
- Product validator coercion for string numeric fields so the current React admin forms can submit values without extra frontend serialization work.
- Added customer profile/address foundations and admin customer management:
- Customer validators for admin edits, self-profile edits, and address create/update.
- Admin customer service/controller/routes under `/api/admin/customers/*`.
- Customer self-service profile/address routes under `/api/customer/*`.
- Frontend-friendly admin customer list/detail mapping for the current React customer table and drawer.
- Initial order-history repository stub so customer detail responses can already expose a stable `orderHistorySummary` shape without blocking on the Orders phase.
- Added minimal cart + checkout foundations:
- `Cart` and `Order` models for customer cart persistence and pending order creation.
- Cart repositories, checkout repository, checkout validators, and order-number helper.
- Customer cart service/controller/routes under `/api/customer/cart/*`.
- Checkout flow now re-validates live stock, snapshots line items, computes subtotal/tax/shipping totals, creates a pending order, reserves stock, increments product unfulfilled counts, and clears the customer cart.
- Customer detail responses now read order history from the real order repository rather than a placeholder stub.
- Added admin orders and minimal payment foundations:
- Admin order repository, validators, service, controller, and routes under `/api/admin/orders/*`.
- Order list/detail mapping aligned to the current admin Orders table and drawer structure.
- Strict next-step admin order transitions for confirm, pack, ship, out-for-delivery, deliver, and pending-only cancel flows.
- Minimal payment service/controller/routes under `/api/storefront/payments/*` for payment-order creation and signature verification.
- Order model now stores payment gateway references, shipping summary fields, delivery timestamp, and cancellation reason.
- Added coupons and storefront coupon validation foundations:
- Coupon constants, model, repository, validator, service, controller, and routes.
- Admin coupon APIs under `/api/admin/coupons/*` for list/create/update/activate/pause/archive/delete/analytics.
- Storefront coupon validation endpoint under `/api/storefront/coupons/validate`.
- Coupon response mapping aligned to the current admin coupon cards, details drawer, and form field names.

### Verified
- Syntax-checked `src/app.js`, `src/server.js`, `src/config/env.schema.js`, and `src/shared/app-error.js` with `node --check`.
- Syntax-checked selected Phase 2 files: `src/routes/admin-auth.routes.js`, `src/services/admin-auth.service.js`, `src/middlewares/authenticate.middleware.js`, and `src/models/customer.model.js`.
- Syntax-checked selected Phase 3 files: `src/services/category.service.js`, `src/services/product.service.js`, `src/validators/catalog.validator.js`, `src/routes/product.routes.js`, `src/controllers/category.controller.js`, `src/controllers/product.controller.js`, and `src/routes/category.routes.js`.
- Syntax-checked selected customer-phase files: `src/services/customer.service.js`, `src/controllers/customer.controller.js`, `src/routes/admin-customer.routes.js`, and `src/validators/customer.validator.js`.
- Syntax-checked cart/checkout files: `src/services/cart.service.js`, `src/models/order.model.js`, `src/routes/cart.routes.js`, and `src/validators/checkout.validator.js`.
- Syntax-checked orders/payment files: `src/services/order.service.js`, `src/services/payment.service.js`, `src/routes/order.routes.js`, and `src/controllers/order.controller.js`.
- Syntax-checked coupon files: `src/services/coupon.service.js`, `src\validators\coupon.validator.js`, `src\routes\coupon.routes.js`, and `src\controllers\coupon.controller.js`.

### Not Yet Started
- Dependency installation
- `.env` file creation
- Feature modules (categories, products, customers, carts, payments, orders, shipping, coupons, blogs, dashboard, notifications)
- Forgot-password/reset-password flow
- Login attempt throttling and temporary account lock in Redis
- Activity log persistence for auth actions
- Token cookie environment tuning (`secure`/production behavior)
- Category stats/preview aggregate endpoints
- Product stats endpoints and bulk product actions
- Frontend API wiring in the React admin app
- Cart persistence and merge logic
- Checkout flow and order creation
- Guest cart in Redis and guest-to-user cart merge
- Shiprocket integration and shipping sync/webhooks
- Dashboard aggregates, notifications, activity log persistence, and search
- Full Razorpay API integration and webhook processing (current payment layer covers internal order creation and signature verification flow only)
- Auto-expiry coupon job and per-customer usage tracking
- Blogs CMS APIs
- Dashboard summary/chart/best-sellers/recent-activity APIs

### Next Recommended Phase
- Implement blogs next, then dashboard/notifications/search, because the admin commerce core is now present and the remaining read-heavy modules can build on the existing entities.

**Audience:** A backend coding agent implementing this from scratch, with no access to prior conversation history.

**Rule for the implementing agent:** If a requirement is not written in this document, it does not exist. Do not invent fields, endpoints, or business rules. Where the frontend currently uses mock/local data for something not specified here (e.g., a placeholder marked "Coming Soon" or "Integration Required" in the UI), treat that feature as **out of scope** for this backend phase unless explicitly specified below.

---

## 1. Technology Stack & Rationale

| Dependency | Purpose | Why |
|---|---|---|
| Node.js (latest LTS) | Runtime | Long-term support, stable ESM support, wide ecosystem |
| Express.js | HTTP framework | Minimal, unopinionated, battle-tested, huge middleware ecosystem |
| MongoDB | Primary datastore | Document model fits variant-heavy product catalog and nested order snapshots well |
| Mongoose | ODM | Schema validation, hooks, virtuals, population, transactions support |
| Redis | Cache, sessions, queues | Fast key-value store for rate limiting, refresh-token blocklists, cart TTLs, BullMQ job queues |
| JWT (jsonwebtoken) | Stateless auth tokens | Access/refresh token pattern scales horizontally without server-side session storage |
| bcrypt | Password hashing | Industry-standard adaptive hashing; resistant to brute force |
| Zod | Request validation | Type-safe schema validation, composes well, single source of truth for validation + TypeScript types if adopted later |
| Multer | Multipart form handling | Required to receive image uploads before forwarding to Cloudinary |
| Cloudinary | Image storage & CDN | Handles product/category/blog image storage, transformation, and delivery — avoids self-hosting binary storage |
| Razorpay | Payment gateway | Specified payment provider; supports India-first card/UPI/netbanking flows required by the storefront checkout |
| Shiprocket | Shipping/courier aggregator | Specified shipping provider; supports AWB generation, tracking, label/invoice generation referenced by Order fulfillment workflow |
| Pino | Logging | Extremely low-overhead structured JSON logging suitable for production log aggregation |
| Helmet | HTTP security headers | Sets sane default security headers (CSP, HSTS, etc.) |
| CORS | Cross-origin control | Restricts API access to approved frontend origins (admin panel + storefront) |
| Compression | Response compression | Reduces payload size for JSON API responses |
| Cookie Parser | Cookie handling | Required to read/set httpOnly refresh-token cookies |
| dotenv | Environment config | Loads `.env` in non-production environments |
| UUID | ID generation | Used for idempotency keys, webhook dedup keys, and any ID not backed by Mongo ObjectId |
| Resend | Transactional email | Chosen over Nodemailer+SMTP because it has a simpler API, built-in deliverability, and native React-email template support — fits a small admin team better than self-managed SMTP |

No deprecated packages. No `request`, no `moment` (use `date-fns` if date math is needed), no callback-style libraries.

---

## 2. Module System Rules

- `package.json` must contain `"type": "module"`.
- Use `import` / `export` exclusively. Never use `require()` or `module.exports`.
- Use **named exports** only (no default exports), so every import is explicit at the call site.
- All `export` statements appear at the **end of the file**, after all declarations — never inline `export const` at declaration site.

```js
// ✅ correct pattern
const createOrder = async (payload) => { /* ... */ };
const getOrderById = async (id) => { /* ... */ };

export { createOrder, getOrderById };
```

---

## 3. Architecture

```
src/
  app.js                 # Express app assembly (middleware, routers, error handler) — no listen()
  server.js               # Boots HTTP server, connects DB/Redis, graceful shutdown
  config/                 # env schema (Zod-validated), constants read from process.env
  database/               # Mongo connection, Redis connection, transaction helpers
  routes/                 # Top-level route aggregation per feature (imports feature routers)
  controllers/             # (per feature, see below) — request/response only, no business logic
  services/                # (per feature) — business logic, orchestration, transactions
  repositories/            # (per feature) — Mongoose queries only, no business logic
  models/                  # (per feature) — Mongoose schemas
  validators/               # (per feature) — Zod schemas per endpoint
  middlewares/              # auth, error handler, rate limiter, request logger, file upload
  utils/                   # pure helper functions (pagination builder, slugify, currency math)
  helpers/                 # cross-feature helpers (order-number generator, invoice numbering)
  constants/                # enums (order status, coupon type, roles) as single source of truth
  events/                   # internal event bus (emits: order.confirmed, coupon.used, etc.)
  jobs/                     # scheduled jobs (coupon expiry sweep, scheduled blog publisher)
  queues/                   # BullMQ queue definitions (email queue, shipping sync queue)
  webhooks/                 # Razorpay + Shiprocket webhook handlers
  emails/                   # Resend client wrapper + send functions
  templates/                 # React-email / HTML email templates
  storage/                  # Cloudinary client wrapper
  docs/                     # OpenAPI/Swagger source (optional, generated from Zod)
  types/                    # shared TS types/JSDoc typedefs if used
  shared/                   # cross-cutting concerns: pagination response shape, API response wrapper
  features/
    admin/                  # admin auth, admin profile, activity log, settings
    customer/                # customer profile, addresses, wishlist
    product/                 # products, categories, inventory
    order/                   # orders, returns, refunds
    payment/                  # Razorpay integration
    shipping/                 # Shiprocket integration
    coupon/                   # coupons & offers
    blog/                     # blog CMS
    notification/              # email/SMS/push dispatch
    analytics/                 # dashboard aggregates
    auth/                      # shared JWT issuing/verification logic
```

### Folder rules

| Folder | Responsibility | Allowed to depend on | Forbidden to depend on |
|---|---|---|---|
| `controllers/` | Parse req, call service, shape response, call `next(err)` | `services/`, `validators/`, `shared/` | `models/`, `repositories/` directly |
| `services/` | Business rules, transactions, orchestration across repositories | `repositories/`, `events/`, `emails/`, `queues/`, other `services/` | `req`/`res` objects, `routes/` |
| `repositories/` | Mongoose CRUD/query only | `models/` | `services/`, `controllers/` |
| `models/` | Schema, indexes, hooks, virtuals | `constants/` | `services/`, `controllers/` |
| `validators/` | Zod schemas | `constants/` | everything else |
| `middlewares/` | Cross-cutting request handling | `utils/`, `config/`, `models/` (for auth lookups) | `services/` (to avoid circular business logic in middleware) |

This layering ensures a strict one-directional dependency flow: `routes → controllers → services → repositories → models`.

---

## 4. Standard API Response Format

**Success**
```json
{
  "success": true,
  "message": "Order confirmed successfully.",
  "data": { "...": "..." },
  "meta": { "page": 1, "perPage": 10, "totalItems": 42, "totalPages": 5 }
}
```
`meta` is omitted (not `null`) for non-paginated endpoints.

**Failure**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Must be a valid email address." }
  ]
}
```

### HTTP status code conventions
- `200` — success (GET, PATCH, action endpoints)
- `201` — resource created (POST)
- `204` — success, no body (DELETE)
- `400` — validation error
- `401` — not authenticated (missing/invalid/expired token)
- `403` — authenticated but not authorized (wrong role, not owner)
- `404` — resource not found
- `409` — conflict (duplicate SKU, duplicate slug, invalid state transition)
- `422` — semantically invalid business rule (e.g., cancel a Delivered order)
- `429` — rate limited
- `500` — unhandled server error

---

## 5. Centralized Error Handling

Custom error classes, all extending a base `AppError { statusCode, message, errors[] }`:

- `ValidationError` (400) — thrown by the Zod validation middleware
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `BusinessRuleError` (422) — e.g. invalid order status transition, category has assigned products
- `ExternalServiceError` (502) — Razorpay/Shiprocket/Cloudinary/Resend failures, includes `provider` and `originalError` (logged, not exposed to client)

A single Express error-handling middleware (last in the chain) catches all thrown/`next(err)`'d errors, logs via Pino (full stack trace at `error` level in production, pretty-printed in development), and responds using the standard Failure shape. Unknown errors are normalized to `500` with a generic message — never leak stack traces or internal error text to the client.

---

## 6. Authentication

Two independent authentication realms: **Admin** and **Customer**. They use separate JWT secrets, separate cookie names, and separate Mongoose collections (`Admin`, `Customer`). An admin token must never validate against customer-only routes and vice versa.

### 6.1 Token strategy
- **Access Token**: JWT, 15 minute expiry, contains `{ sub: userId, role, tokenVersion }`, sent in `Authorization: Bearer <token>` header, stored in memory on the frontend (not localStorage).
- **Refresh Token**: JWT, 7 day expiry, contains `{ sub: userId, role, tokenVersion }`, stored in an `httpOnly`, `secure`, `sameSite=strict` cookie named `admin_refresh_token` / `customer_refresh_token`.
- `tokenVersion` is a counter stored on the user document. Incrementing it (on password change, forced logout, or "logout all devices") invalidates all previously issued refresh tokens for that user without needing a blocklist for every token — the refresh endpoint checks `payload.tokenVersion === user.tokenVersion`.
- Redis is used as a short-lived blocklist for access tokens revoked before their natural 15-minute expiry (e.g., admin deactivation).

### 6.2 Admin Authentication flow (maps to Admin Login page — Section 2 of workflow)
- `POST /api/admin/auth/login` — validates email/password, verifies `role IN (Admin, SuperAdmin)`, checks `isActive`, issues access + refresh token, sets refresh cookie, logs an `ActivityLog` entry (`action: "Admin Login"`).
- On failure: generic `"Invalid email or password"` message (never reveal which field was wrong), does NOT redirect, returns `401`.
- `POST /api/admin/auth/refresh` — reads refresh cookie, verifies signature + `tokenVersion`, issues new access token. Rotates the refresh token (issues a new one, invalidates the old by bumping a per-token Redis-tracked jti) to mitigate replay.
- `POST /api/admin/auth/logout` — clears cookie, adds current access token's jti to the Redis blocklist until its natural expiry.
- `POST /api/admin/auth/forgot-password` — always responds `200` regardless of whether the email exists (prevents user enumeration); if it exists, emails a signed, 1-hour-expiry reset token link via Resend.
- `POST /api/admin/auth/reset-password` — validates reset token, hashes new password with bcrypt (cost factor 12), increments `tokenVersion` (forces logout everywhere), invalidates the reset token (single use, tracked in Redis with the token's jti).
- Every admin API route (except login/forgot/reset) requires a valid access token AND `role IN (Admin, SuperAdmin)`. Unauthenticated admin-route access must redirect the client to the Admin Login route (frontend responsibility); backend simply returns `401`.

### 6.3 Customer Authentication (storefront-facing; required to support Orders/Customers backend even though no customer-facing frontend was built in this phase)
- Mirrors the admin flow structurally (`/api/customer/auth/*`) but customers self-register (`POST /api/customer/auth/register`) with email/password or a future OAuth provider (out of scope now).
- Passwords are hashed identically (bcrypt, cost 12).
- **Admin must never be able to read a customer's password field.** The `Customer` model's password field has `select: false` by default in Mongoose and is never included in any admin-facing serializer.

---

## 7. Authorization (RBAC)

| Role | Scope |
|---|---|
| `Customer` | Own profile, own orders, own addresses, own wishlist, own reviews. Zero access to `/api/admin/*`. |
| `Admin` | Full CRUD on Products, Categories, Orders, Customers (view/edit/deactivate, never delete passwords), Coupons, Blogs. Cannot manage other Admin accounts or global Settings. |
| `SuperAdmin` | Everything Admin can do, plus: manage Admin accounts (create/deactivate/change role), edit Website Settings, view security/audit logs, access Login Activity across all admins. |

Authorization is enforced via an `authorize(...allowedRoles)` middleware placed after the `authenticate` middleware on every protected route. Ownership checks (e.g., a customer accessing `/api/customer/orders/:id`) are enforced in the **service layer** by comparing `order.customerId === req.user.id`, returning `404` (not `403`) to avoid leaking existence of other customers' resources.

### Access matrix (abridged — full matrix lives in `docs/access-matrix.md`, generated from this table)

| Resource | Customer | Admin | SuperAdmin |
|---|---|---|---|
| Products (read published) | ✅ | ✅ | ✅ |
| Products (create/edit/archive/delete) | ❌ | ✅ | ✅ |
| Categories (create/edit/delete) | ❌ | ✅ | ✅ |
| Orders (own, read) | ✅ | — | — |
| Orders (all, read/update status) | ❌ | ✅ | ✅ |
| Customers (list/view/deactivate) | ❌ | ✅ | ✅ |
| Coupons (create/edit/archive) | ❌ | ✅ | ✅ |
| Blogs (create/edit/publish/schedule/archive/delete) | ❌ | ✅ | ✅ |
| Admin account management | ❌ | ❌ | ✅ |
| Website Settings | ❌ | ❌ (read-only) | ✅ |

---

## 8. Database Design

All collections include `createdAt` / `updatedAt` (Mongoose `timestamps: true`). Soft-delete is used wherever the frontend workflow requires "Archive" as distinct from permanent "Delete" (Products, Categories, Coupons, Blogs). Hard delete is only exposed where the frontend explicitly shows a Delete action behind a confirmation modal.

### 8.1 `Admin`
| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `email` | String, required, unique, lowercase | |
| `passwordHash` | String, required, `select: false` | |
| `role` | Enum `["Admin","SuperAdmin"]`, required, default `"Admin"` | |
| `avatarUrl` | String | Cloudinary URL |
| `isActive` | Boolean, default `true` | Deactivated admins fail login |
| `tokenVersion` | Number, default `0` | Incremented to force logout everywhere |
| `lastLoginAt` | Date | |
| `loginHistory` | Array of `{ ip, userAgent, at }`, capped to last 20 | Powers "Login Activity" |

Indexes: unique on `email`.

### 8.2 `Customer`
| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `email` | String, required, unique, lowercase | |
| `passwordHash` | String, required, `select: false` | Never returned to admin |
| `phone` | String | |
| `avatarUrl` | String | |
| `status` | Enum `["Active","VIP Elite","Verified","Deactivated"]`, default `"Active"` | Matches Customers table status badges |
| `tier` | String | e.g. `"PLATINUM LEVEL"` — display label, computed/set by loyalty logic (out of scope to compute here; stored as a field admin/system can set) |
| `totalOrders` | Number, default `0` | Denormalized, recalculated via order events |
| `lifetimeSpend` | Number, default `0` | Denormalized in cents/smallest currency unit |
| `rewardPoints` | Number, default `0` | |
| `avgOrderValue` | Number, virtual (computed from `lifetimeSpend / totalOrders`) | |
| `returnRate` | Number, default `0` | Percentage, recalculated via return events |
| `addresses` | Array of `AddressSchema` (embedded) | See 8.3 |
| `wishlist` | Array of `ObjectId` ref `Product` | |
| `lastLoginAt` | Date | |
| `tokenVersion` | Number, default `0` | |
| `deactivatedAt` | Date, nullable | Set when status becomes `Deactivated` |

Indexes: unique on `email`; text index on `name`+`email` for search.

### 8.3 `AddressSchema` (embedded, reused in Customer + Order snapshot)
`{ label, recipientName, line1, line2, city, state, postalCode, country, phone, isDefault }`

### 8.4 `Category`
| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `slug` | String, required, unique | Auto-generated from `name` if not supplied, always prefixed with `/` on the frontend but stored WITHOUT the leading slash |
| `description` | String | |
| `parent` | ObjectId ref `Category`, nullable | Supports subcategories |
| `image` | String (Cloudinary URL) | |
| `seoTitle` | String | |
| `seoDescription` | String | |
| `status` | Enum `["Active","Hidden"]`, default `"Active"` | Maps to Hide/Unhide action |
| `sortOrder` | Number, default `0` | Powers Move Up/Move Down reordering |
| `productsAssignedCount` | Number, virtual/denormalized | Recalculated on product save; used to block/warn on delete |
| `seoScore` | Number, 0–100 | Computed heuristic (see 12.3) or admin-set |

Indexes: unique on `slug`; index on `parent`; index on `sortOrder`.

**Delete rule (hard rule from workflow Section 9):** `DELETE /api/admin/categories/:id` MUST check `productsAssignedCount`. If `> 0`, return `409 Conflict` with `{ requiresReassignment: true, productsAssignedCount }` unless the request includes `?force=true` **and** a `reassignToCategoryId`, in which case all assigned products are reassigned inside a transaction before the category is deleted. Products must never be silently orphaned.

### 8.5 `Product`
| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `slug` | String, required, unique | |
| `sku` | String, required, unique | |
| `shortDescription` | String | |
| `description` | String | |
| `brand` | String | |
| `tags` | Array of String | |
| `categories` | Array of ObjectId ref `Category` | |
| `collection` | String | Free-text collection label (e.g. "Heritage 2024") |
| `featuredImage` | String (Cloudinary URL) | |
| `gallery` | Array of `{ url, order, isFeatured }` | |
| `basePrice` | Number, required | Stored in smallest currency unit (paise) |
| `salePrice` | Number, nullable | |
| `costPrice` | Number, nullable, admin-only field | |
| `taxRate` | Number, default `0` | Percentage |
| `sku` (inventory) | see Inventory sub-doc below | |
| `stock` | Number, required, default `0` | Available stock |
| `reservedStock` | Number, default `0` | Held for unfulfilled/pending orders |
| `soldCount` | Number, default `0` | Denormalized |
| `lowStockThreshold` | Number, default `10` | Triggers Low Stock dashboard/product-list flag |
| `allowBackorder` | Boolean, default `false` | Stock must never go negative unless true |
| `variants` | Array of `VariantSchema` (embedded) | See 8.6 |
| `weight` | Number | kg |
| `dimensions` | `{ length, width, height }` | cm |
| `seoTitle` | String | |
| `seoDescription` | String | |
| `status` | Enum `["Draft","Published","Archived"]`, default `"Draft"` | |
| `visibility` | Enum `["Public","Private","Hidden"]`, default `"Public"` | |
| `scheduledPublishAt` | Date, nullable | Used by "Publish Immediately" vs scheduled path |
| `createdBy` | ObjectId ref `Admin` | |

Indexes: unique on `slug`, unique on `sku`; text index on `name`+`tags`+`sku` for search; index on `status`; index on `categories`.

### 8.6 `VariantSchema` (embedded)
`{ name, material, sku (unique within product), stock, priceAdjustment, image, status }`

**Duplicate rule:** "Duplicate Product" action generates a new `_id`, appends `-copy` (or a numeric suffix on collision) to the slug, requires a new unique SKU (rejects duplication until the client supplies one, or auto-suffixes and flags for admin review), and always forces `status: "Draft"` regardless of the source product's status.

### 8.7 `Order`
| Field | Type | Notes |
|---|---|---|
| `orderNumber` | String, required, unique | Human-readable, e.g. `UL-2934`, generated sequentially |
| `customer` | ObjectId ref `Customer`, required | |
| `items` | Array of `OrderItemSchema` (embedded, snapshotted at order time — see below) | |
| `subtotal` | Number, required | |
| `discountAmount` | Number, default `0` | |
| `taxAmount` | Number, default `0` | |
| `shippingAmount` | Number, default `0` | |
| `totalAmount` | Number, required | `subtotal - discount + tax + shipping` |
| `couponCode` | String, nullable | |
| `paymentMethod` | Enum `["Card","UPI","NetBanking","COD"]` | |
| `paymentStatus` | Enum `["Pending","Paid","Failed","Refunded"]`, default `"Pending"` | |
| `razorpayOrderId` / `razorpayPaymentId` | String, nullable | |
| `status` | Enum `["Pending","Confirmed","Packed","Shipped","Out for Delivery","Delivered","Cancelled","Return Requested","Return Approved","Return Rejected","Return Pickup","Returned","Refund Processing","Refunded"]`, required, default `"Pending"` | See state machine, 12.2 |
| `shippingAddress` | `AddressSchema` (snapshot, embedded) | Copied at order time, never references live Customer address (address may change later) |
| `billingAddress` | `AddressSchema` (snapshot, embedded) | |
| `shipment` | `{ courier, trackingNumber, shippingMethod, shiprocketShipmentId, shiprocketAwbCode, labelUrl, invoiceUrl }` | Populated on Mark Shipped |
| `cancellation` | `{ reason, cancelledAt, cancelledBy }` | Only present if cancelled |
| `returnRequest` | `{ reason, requestedAt, status, rejectionReason, approvedAt }` | Only present if a return was requested |
| `refund` | `{ amount, reason, status, processedAt, razorpayRefundId }` | |
| `timeline` | Array of `{ title, note, actor, at }` | Append-only audit trail, mirrors the frontend Tracking Timeline exactly |
| `placedAt` | Date, default `now` | |

### 8.8 `OrderItemSchema` (embedded — snapshot, not a live reference)
`{ product: ObjectId ref Product, name, sku, variant, image, unitPrice, quantity, lineTotal }`
Snapshotting name/price/image at order time is required so historical orders remain accurate even if the product is later edited, archived, or deleted.

Indexes on `Order`: unique on `orderNumber`; index on `customer`; index on `status`; index on `placedAt` (descending, for recent-orders queries); compound index on `(status, placedAt)` for filtered dashboard queries.

### 8.9 `Coupon`
| Field | Type | Notes |
|---|---|---|
| `code` | String, required, unique, uppercase | |
| `title` | String | Display name (e.g. "SUMMER24") |
| `subtitle` | String | |
| `discountType` | Enum `["Percentage","Fixed Amount","BOGO"]`, required | |
| `discountValue` | Number, required | Percentage (0–100) or fixed amount depending on type |
| `minOrderValue` | Number, default `0` | |
| `maxDiscountAmount` | Number, nullable | Cap for percentage discounts |
| `usageLimit` | Number, nullable | Total redemptions allowed; `null` = unlimited |
| `usageLimitPerCustomer` | Number, default `1` | |
| `usageCount` | Number, default `0` | Denormalized, incremented atomically on each successful order using the coupon |
| `eligibleProducts` | Array ObjectId ref `Product`, empty = all | |
| `eligibleCategories` | Array ObjectId ref `Category`, empty = all | |
| `eligibleCustomers` | Array ObjectId ref `Customer`, empty = all | |
| `startDate` | Date, required | |
| `endDate` | Date, required | |
| `status` | Enum `["Active","Scheduled","Expired","Archived"]`, required | See 12.4 for auto-expiry rule |

Indexes: unique on `code`; index on `status`; index on `endDate` (used by the expiry sweep job).

### 8.10 `Blog`
| Field | Type | Notes |
|---|---|---|
| `title` | String, required | |
| `slug` | String, required, unique | |
| `category` | String | |
| `tags` | Array of String | |
| `author` | ObjectId ref `Admin`, required | |
| `content` | String (rich text/markdown), required for publish | |
| `featuredImage` | String (Cloudinary URL) | |
| `seoTitle` | String | |
| `seoDescription` | String | |
| `status` | Enum `["Draft","Scheduled","Published","Archived"]`, required, default `"Draft"` | |
| `publiclyVisible` | Boolean, computed — `true` only when `status === "Published"` **or** (`status === "Scheduled"` AND `scheduledDate <= now`) | Enforced server-side on every read of public blog endpoints, never trust a client-sent flag |
| `scheduledDate` | Date, nullable | Required if `status === "Scheduled"`; must be in the future at time of scheduling |
| `publishedDate` | Date, nullable | Set once, first time status becomes `Published` |
| `seoScore` | Number, 0–100 | Computed heuristic or admin-set |
| `views` | Number, default `0` | |
| `avgSessionDuration` | Number (seconds), nullable | |
| `bounceRate` | Number (percentage), nullable | |

Indexes: unique on `slug`; index on `status`; index on `scheduledDate` (used by the scheduled-publish job); text index on `title`+`tags`.

### 8.11 `ActivityLog`
| Field | Type | Notes |
|---|---|---|
| `actor` | ObjectId ref `Admin` | |
| `action` | String | e.g. `"Product Created"`, `"Order Confirmed"` |
| `entityType` | String | `"Product" \| "Order" \| "Category" \| "Coupon" \| "Customer" \| "Blog" \| "Settings"` |
| `entityId` | ObjectId | |
| `metadata` | Mixed | Free-form diff/snapshot |

Append-only, never updated or deleted. Indexed on `(entityType, entityId)` and `createdAt` (descending).

### 8.12 `Notification` (admin-facing bell notifications)
`{ type: Enum["New Order","Low Stock","Return Request","Refund Request","Payment Failure","New Customer","Coupon Expiring","Scheduled Blog Published"], title, body, link, isRead, recipientAdmin (nullable = broadcast to all admins) }`

### 8.13 `Settings` (singleton document — always exactly one document in this collection)
Sections mirror workflow Section 26 exactly: `general{websiteName, websiteUrl, businessEmail, supportEmail, phone, currency, timezone}`, `branding{logoUrl, faviconUrl, brandColors}`, `seo{metaTitle, metaDescription, analyticsId, sitemapUrl}`, `contact{address, phone, email, businessHours}`, `social{instagram, facebook, youtube, linkedin}`, `payment{codEnabled, razorpayEnabled}`, `shipping{flatRate, freeShippingThreshold}`, `homepage{heroBannerImage, featuredCategoryIds, featuredProductIds}`. Editable only by `SuperAdmin`.

---

## 9. Feature Specifications

Each feature below maps 1:1 to a page/Redux slice already built on the frontend. The backend must satisfy the exact state shape and actions the frontend already dispatches; do not require the frontend to change.

### 9.1 Dashboard
- **Frontend:** `pages/Dashboard`, Redux slice `dashboardSlice`
- **Purpose:** Read-only business overview. Statistics cards must never allow mutation — all dashboard endpoints are `GET` only.
- **Required data:** total/today revenue, order counts by status, total customers, total products, low-stock count, return/refund request counts, recent orders (last 10), best-selling products (by `soldCount`, last 30 days), revenue chart series (7D/30D/90D), sales chart series (7D/30D/90D), recent customer registrations.
- **Business rule:** All figures are computed from live `Order`/`Product`/`Customer` collections via aggregation pipelines — never hand-maintained counters except the denormalized fields explicitly listed in section 8 (which are kept in sync by the relevant service on every mutating operation).

### 9.2 Products & Product Form
- **Frontend:** `pages/Products`, `pages/ProductForm`, slices `productsSlice` + `productFormSlice`
- **Business rules:**
  - Save Draft: validates only `name` is present; sets `status: "Draft"`; never appears on storefront endpoints.
  - Publish: validates `name`, `sku` (unique), `basePrice` are present; sets `status: "Published"`.
  - Archive: sets `status: "Archived"`; hidden from storefront; **historical order references (`OrderItemSchema` snapshots) are untouched** since they don't reference the live product by mutable fields.
  - Delete: soft — actually maps to Archive in this system (workflow prefers archive over hard delete for data integrity); a genuine hard-delete endpoint exists but is restricted to `SuperAdmin` and blocked entirely if the product appears in any `Order.items`.
  - Duplicate: see 8.6 duplicate rule.
  - Stock math: on order confirmation, `reservedStock += qty`; on shipment, `stock -= qty, reservedStock -= qty`; on cancellation of a reserved (not yet shipped) order, `reservedStock -= qty`. Stock must never go negative unless `allowBackorder: true`.

### 9.3 Categories
- **Frontend:** `pages/Categories`, slice `categoriesSlice`
- **Business rules:** see 8.4 delete rule. Reorder (`Move Up`/`Move Down`) persists `sortOrder` via a single atomic swap between the two affected documents.

### 9.4 Orders
- **Frontend:** `pages/Orders`, slice `ordersSlice`
- **This is the most business-rule-critical feature.** See 12.2 (Order Status State Machine) — the backend is the sole enforcer of valid transitions; it must reject any transition not in the state machine with `422 Business Rule Error`, regardless of what the client requests.

### 9.5 Customers
- **Frontend:** `pages/Customers`, slice `customersSlice`
- **Business rules:** Deactivate (`Restrict Account`) sets `status: "Deactivated"`, `deactivatedAt: now`; a deactivated customer's login attempts fail with `403` even with correct credentials. Delete follows data retention rules: customer PII may be anonymized rather than the document removed, if the customer has order history (orders must retain a valid `customer` reference or a "Deleted Customer" placeholder — implementation detail left to the agent, but historical orders must never break).

### 9.6 Coupons & Offers
- **Frontend:** `pages/Coupons`, slice `couponsSlice`
- **Business rules:** see 12.4 (coupon validation + auto-expiry).

### 9.7 Blogs & Blog Form
- **Frontend:** `pages/Blogs`, `pages/BlogForm`, slices `blogsSlice` + `blogFormSlice`
- **Business rules:** see 12.5 (publish/schedule/archive state machine). `publiclyVisible` is **never** trusted from the client — always recomputed server-side from `status` + `scheduledDate` on every read.

### 9.8 Settings, Profile, Admin Login
- Frontend pages exist as placeholders ("Coming Soon") pending final admin build-out. Backend for `Admin Auth` (6.2) and the `Settings` singleton (8.13) is specified now so the API contract is ready when those pages are implemented; no additional endpoints beyond what's listed in 10.8/10.9 are required at this phase.

---

## 10. API Specification

All admin routes are prefixed `/api/admin`. All routes require `Authorization: Bearer <accessToken>` and `authorize("Admin","SuperAdmin")` unless noted otherwise. Standard success/failure envelope (Section 4) applies to every endpoint below; only distinguishing details are listed per endpoint.

### 10.1 Auth
| Endpoint | Method | Auth | Notes |
|---|---|---|---|
| `/api/admin/auth/login` | POST | None | Body: `{email, password}`. Sets refresh cookie. Returns `{admin, accessToken}`. |
| `/api/admin/auth/refresh` | POST | Refresh cookie | Returns new `{accessToken}`. |
| `/api/admin/auth/logout` | POST | Access token | Clears cookie, blocklists current token. |
| `/api/admin/auth/forgot-password` | POST | None | Body: `{email}`. Always `200`. |
| `/api/admin/auth/reset-password` | POST | Reset token in body | Body: `{token, newPassword}`. |

### 10.2 Products
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/products` | GET | Query: `page, perPage, search, category, collection, priceMin, priceMax, stock(low/out/in), status(Draft/Published/Archived), sort(newest/oldest/price-asc/price-desc/most-sold/least-stock/recently-updated)` |
| `/api/admin/products/:id` | GET | 404 if not found |
| `/api/admin/products` | POST | Create. Body validated by `createProductSchema` (Zod). `409` on duplicate `sku`/`slug`. |
| `/api/admin/products/:id` | PATCH | Partial update |
| `/api/admin/products/:id/publish` | POST | Validates required fields, sets `status: Published` |
| `/api/admin/products/:id/save-draft` | POST | Sets `status: Draft` |
| `/api/admin/products/:id/archive` | POST | Sets `status: Archived` |
| `/api/admin/products/:id/duplicate` | POST | Returns new product with new id/slug, `status: Draft` |
| `/api/admin/products/:id` | DELETE | `SuperAdmin` only. `409` if referenced in any Order. |
| `/api/admin/products/bulk/archive` | POST | Body: `{ ids: [] }` |

### 10.3 Categories
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/categories` | GET | Query: `search, status, parent` |
| `/api/admin/categories` | POST | |
| `/api/admin/categories/:id` | PATCH | |
| `/api/admin/categories/:id/hide` | POST | Toggles `status` Active↔Hidden |
| `/api/admin/categories/:id/reorder` | POST | Body: `{direction: "up"|"down"}` |
| `/api/admin/categories/:id` | DELETE | Query: `force, reassignToCategoryId` — see 8.4 rule. `409` if products assigned and `force` not set. |

### 10.4 Orders
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/orders` | GET | Query: `page, perPage, search, status, paymentStatus, dateFrom, dateTo` |
| `/api/admin/orders/:id` | GET | Full order details including timeline |
| `/api/admin/orders/:id/confirm` | POST | Only from `Pending`. See 12.2. |
| `/api/admin/orders/:id/pack` | POST | Only from `Confirmed`. |
| `/api/admin/orders/:id/ship` | POST | Only from `Packed`. Body required: `{courier, trackingNumber, shippingMethod}`. Triggers Shiprocket shipment creation (13.2). |
| `/api/admin/orders/:id/out-for-delivery` | POST | Only from `Shipped`. |
| `/api/admin/orders/:id/deliver` | POST | Only from `Out for Delivery`. Triggers customer notification + dashboard stat update. |
| `/api/admin/orders/:id/cancel` | POST | Only from `Pending`. Body required: `{reason}` (enum: Customer Request/Out of Stock/Payment Issue/Fraud/Other). Triggers refund flow if prepaid. |
| `/api/admin/orders/:id/return/approve` | POST | Only from `Return Requested`. |
| `/api/admin/orders/:id/return/reject` | POST | Body required: `{reason}`. |
| `/api/admin/orders/:id/refund/approve` | POST | Only from `Refund Processing`. Calls Razorpay refund API; status only becomes `Refunded` after Razorpay confirms (never before). |
| `/api/admin/orders/:id/refund/reject` | POST | Body required: `{reason}`. |
| `/api/admin/orders/export` | POST | Body: `{ids: []}` — returns a signed download URL (async job, not synchronous CSV generation) |

Every transition endpoint above:
1. Loads the order.
2. Checks the current `status` against the allowed source state for that transition (Section 12.2) — returns `422` if invalid.
3. Performs the mutation inside a Mongo transaction (order + product stock + customer stats where relevant).
4. Appends a `timeline` entry.
5. Emits an internal event (`order.<transition>`), which the notification service and dashboard cache invalidation subscribe to.
6. Writes an `ActivityLog` entry.

### 10.5 Customers
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/customers` | GET | Query: `page, perPage, search, vipStatus, region` |
| `/api/admin/customers/:id` | GET | Includes order history summary, addresses, wishlist, activity |
| `/api/admin/customers/:id` | PATCH | Admin-editable fields only (never password) |
| `/api/admin/customers/:id/deactivate` | POST | |
| `/api/admin/customers/:id` | DELETE | Follows retention rule (9.5) |
| `/api/admin/customers/bulk/deactivate` | POST | Body: `{ids: []}` |
| `/api/admin/customers/export` | POST | Body: `{ids: []}` |

### 10.6 Coupons
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/coupons` | GET | Query: `search, status, type` |
| `/api/admin/coupons` | POST | Validates `endDate > startDate`, `discountValue` bounds by type |
| `/api/admin/coupons/:id` | PATCH | |
| `/api/admin/coupons/:id/activate` | POST | Only if not `Expired` |
| `/api/admin/coupons/:id/pause` | POST | Sets `status: Scheduled` (paused = not currently redeemable) |
| `/api/admin/coupons/:id/archive` | POST | |
| `/api/admin/coupons/:id` | DELETE | |
| `/api/admin/coupons/:id/analytics` | GET | Read-only: usage, orders using coupon, revenue generated, discount given, conversion rate. Never mutates coupon data. |
| `/api/storefront/coupons/validate` | POST | Customer-facing (see 12.4). Body: `{code, cartTotal, customerId}`. |

### 10.7 Blogs
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/blogs` | GET | Query: `search, status, category, author` |
| `/api/admin/blogs` | POST | |
| `/api/admin/blogs/:id` | PATCH | |
| `/api/admin/blogs/:id/save-draft` | POST | |
| `/api/admin/blogs/:id/publish` | POST | Validates `title, category, content` present |
| `/api/admin/blogs/:id/schedule` | POST | Body: `{scheduledDate}`, must be future |
| `/api/admin/blogs/:id/archive` | POST | |
| `/api/admin/blogs/:id` | DELETE | |
| `/api/public/blogs` | GET | Public-facing, only returns docs where `publiclyVisible` computed `true` |

### 10.8 Dashboard
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/dashboard/summary` | GET | All KPI cards in one aggregate call |
| `/api/admin/dashboard/revenue-chart` | GET | Query: `period(7D/30D/90D)` |
| `/api/admin/dashboard/sales-chart` | GET | Query: `period(7D/30D/90D)` |
| `/api/admin/dashboard/best-sellers` | GET | |
| `/api/admin/dashboard/recent-activity` | GET | |

### 10.9 Settings
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/settings` | GET | Any authenticated admin |
| `/api/admin/settings` | PATCH | `SuperAdmin` only |

### 10.10 Search
| Endpoint | Method | Notes |
|---|---|---|
| `/api/admin/search?q=` | GET | Federated search across Products, Orders (by orderNumber), Customers, Categories, Coupons, Blogs. Returns `{type, id, title, url}[]`, capped at 5 per type. |

---

## 11. Validation (Zod, representative rules)

- **Email:** RFC-compliant regex, lowercase-normalized, max 254 chars.
- **Password:** min 8 chars, at least 1 letter and 1 number (align exactly with whatever the eventual Admin Login form enforces client-side — do not diverge).
- **Phone:** E.164 format validation.
- **Price/stock/discountValue:** non-negative numbers; `discountValue` for `Percentage` type additionally bounded `0–100`.
- **SKU:** required, uppercase-normalized, alphanumeric + hyphen only, 3–40 chars.
- **Slug:** lowercase, alphanumeric + hyphen only, auto-generated via slugify if omitted, re-validated for uniqueness at the DB layer (unique index) with a friendly `409` on collision.
- **Dates:** ISO 8601 strings; `endDate > startDate` enforced at the schema level via `.refine()` for Coupons; `scheduledDate` for Blogs must be `> Date.now()` at creation time.
- **Images/URLs:** must be `https://` URLs pointing at the configured Cloudinary domain (reject arbitrary external URLs to prevent hot-linking abuse).
- **Enums:** every enum field validated with Zod `.enum([...])` sourced from the single `constants/` definition — never duplicate the list of valid statuses in two places.

Every `POST`/`PATCH` route has a corresponding named Zod schema in `validators/<feature>.validator.js`; the validation middleware runs before the controller and short-circuits with `400 ValidationError` (mapped to the field-level `errors[]` array in the Failure response) on any failure.

---

## 12. Business Logic Detail

### 12.1 Generic mutation chain (applies to every state-changing admin action)
```
ADMIN ACTION → AUTHENTICATION CHECK → AUTHORIZATION CHECK → REQUEST VALIDATION
→ SERVICE-LAYER BUSINESS RULE CHECK → DB TRANSACTION (primary + related docs)
→ RELATED DATA UPDATE (denormalized counters) → EVENT EMITTED
→ ACTIVITY LOG WRITTEN → NOTIFICATION TRIGGERED (if applicable) → RESPONSE
```
No endpoint may skip the business-rule check step even if the request otherwise looks valid — e.g. a syntactically valid "confirm order" request on an already-`Shipped` order must still be rejected with `422`.

### 12.2 Order Status State Machine (authoritative)

```
Pending  → Confirmed → Packed → Shipped → Out for Delivery → Delivered
Pending  → Cancelled                                        (only from Pending)
Delivered → Return Requested → Return Approved → Return Pickup → Returned → Refund Processing → Refunded
Return Requested → Return Rejected                            (terminal)
```

Any transition not present in this exact graph is rejected with `422`. In particular:
- `Pending → Delivered` is invalid (must pass through every intermediate state).
- `Shipped → Cancelled` is invalid (cancellation is Pending-only per the workflow's explicit rule).
- Mark Shipped requires `courier`, `trackingNumber`, `shippingMethod` in the request body — reject with `400` if any is missing.
- On `Deliver`: set `deliveredAt`, increment `Customer.totalOrders`/`lifetimeSpend` if not already counted, trigger customer notification, invalidate dashboard cache.
- On `Cancel`: if `paymentStatus === "Paid"`, create a `refund` sub-document with `status: "Refund Processing"` and enqueue the Razorpay refund job; if `paymentMethod === "COD"` and no payment was collected, no refund is created.
- Refund only reaches `status: "Refunded"` after a **confirmed webhook** from Razorpay (12.6) — never optimistically marked complete by the initiating request.

### 12.3 Product/Category SEO Score
Not a third-party integration. Computed heuristically server-side on save: presence of `seoTitle` (≤65 chars), presence of `seoDescription` (≤160 chars), presence of at least one image, slug matches title reasonably. Each check contributes a weighted point value summing to 100. This keeps the "SEO Score" badges genuinely computed rather than fabricated, without requiring an external SEO API (none was specified).

### 12.4 Coupon validation & auto-expiry
- `POST /api/storefront/coupons/validate` checks, in order: coupon exists and `status === "Active"`, `now` between `startDate`/`endDate`, `cartTotal >= minOrderValue`, `eligibleProducts`/`eligibleCategories`/`eligibleCustomers` constraints (empty array = unrestricted) satisfied by the cart/customer, `usageCount < usageLimit` (if set), customer's own redemption count `< usageLimitPerCustomer`. Any failure returns `422` with a specific reason — never a generic "invalid coupon."
- **Auto-expiry job** (`jobs/expireCoupons.job.js`, runs hourly via node-cron or BullMQ repeatable job): finds all coupons `WHERE status = "Active" AND endDate < now`, sets `status: "Expired"` in bulk. The frontend's "Coupon Analytics" view remains read-only regardless of this job (12.6 rule: viewing analytics never mutates data — the job is the only writer of `status → Expired`).
- `usageCount` is incremented atomically (`$inc`) inside the same transaction that confirms an order using that coupon, never as a separate, potentially-lost write.

### 12.5 Blog publish/schedule/archive state machine
```
Draft → Published
Draft → Scheduled → Published (automatic, via job, when scheduledDate arrives)
Draft/Published/Scheduled → Archived
```
- **Scheduled publish job** (`jobs/publishScheduledBlogs.job.js`, runs every minute): finds all blogs `WHERE status = "Scheduled" AND scheduledDate <= now`, sets `status: "Published"`, `publishedDate: now`, emits `blog.published` event (triggers the "Scheduled Blog Published" admin notification type).
- `publiclyVisible` is **always recomputed on read**, never stored as a trusted flag alone — see 8.10.

### 12.6 Payment (Razorpay)
- **Flow:** storefront checkout creates a Razorpay order (`orders.create`) server-side with `amount = totalAmount`, returns the Razorpay `order_id` to the client for the Razorpay Checkout widget. The client never sees the API secret.
- **Verification:** on payment completion, the client posts `{razorpay_order_id, razorpay_payment_id, razorpay_signature}` to `/api/storefront/payments/verify`; the server recomputes the HMAC SHA256 signature using the webhook secret and compares — **only a matching signature confirms payment**, the client's claim alone is never trusted.
- **Webhook:** `/api/webhooks/razorpay` is the source of truth for `payment.captured`, `payment.failed`, `refund.processed` events. Signature-verified using the Razorpay webhook secret header. Idempotent — dedupes by `event.id` stored in Redis with a 24h TTL before processing, so retried webhook deliveries don't double-process.
- **Refund flow:** `services/refund.service.js` calls Razorpay's refund API, stores `razorpayRefundId`, and only flips `Order.refund.status → "Refunded"` upon receiving the corresponding `refund.processed` webhook — never immediately after the API call returns `200`, since Razorpay refunds are asynchronous.
- **Failure cases:** `payment.failed` webhook sets `Order.paymentStatus: "Failed"`, keeps `Order.status: "Pending"`, triggers a "Payment Failure" admin notification.
- **Security:** Razorpay key secret and webhook secret live only in server env vars, never sent to any client.

### 12.7 Shipping (Shiprocket)
- **Auth:** Shiprocket token obtained via `/auth/login` with account email/password, cached in Redis with its ~10-day expiry, refreshed proactively before expiry.
- **On "Mark Shipped":** service creates a Shiprocket order (`/orders/create/adhoc`) using the order's shipping address + items, then creates a shipment and requests AWB assignment. Stores `shiprocketShipmentId`, `shiprocketAwbCode` on the order.
- **Label/Invoice:** separate calls to generate label PDF and invoice PDF, URLs stored on `Order.shipment`.
- **Tracking sync:** a scheduled job polls Shiprocket's tracking endpoint for all orders with `status IN (Shipped, Out for Delivery)` and updates status accordingly when Shiprocket reports movement — this is the mechanism that can auto-advance `Shipped → Out for Delivery` in addition to the manual admin action; both paths go through the same state-machine-enforcing service function so validity rules are never bypassed.
- **Webhook (preferred over polling once configured):** `/api/webhooks/shiprocket` receives push status updates; validated by a shared secret token in the request; same idempotency-by-event-id pattern as Razorpay.
- **Failure handling:** if AWB assignment fails, the order remains in `Packed` status, an `ExternalServiceError` is logged, and an admin notification is raised rather than silently failing.

### 12.8 Cart & Checkout (storefront-facing, minimal spec to support Orders)
Not covered by the admin frontend built so far, but required for `Order` documents to ever be created. Spec kept intentionally minimal:
- **Guest cart:** stored in Redis keyed by a signed anonymous cart-id cookie, 14-day TTL.
- **User cart:** stored in a `Cart` collection (`{customer, items[], updatedAt}`) once authenticated.
- **Merge logic:** on login, guest cart items are merged into the user cart (quantities summed for matching `product+variant`, no duplicates).
- **Checkout:** validates live stock for every line item at the moment of order creation (re-check, not trusted from cart state), applies the coupon (12.4), computes tax via `Settings.payment`/regional rule (kept simple: flat `taxRate` per product), computes shipping via `Settings.shipping` (flat rate or free-shipping threshold), creates the `Order` document in `Pending` status, reserves stock, and only then creates the Razorpay order for payment.

---

## 13. Notifications

| Channel | Provider | Triggers |
|---|---|---|
| Email | Resend | Order confirmation, shipment update, delivery confirmation, password reset, admin new-order alert (optional digest) |
| Admin in-app (bell) | Internal `Notification` collection + polling or SSE | New Order, Low Stock, Return Request, Refund Request, Payment Failure, New Customer, Coupon Expiring (3 days before `endDate`, generated by a daily job), Scheduled Blog Published |
| SMS / Push | Not specified by any built frontend — **out of scope**, do not implement | — |

Clicking a notification on the frontend must deep-link to the relevant admin route (e.g., a "New Return Request" notification's `link` field is `/orders?tab=return-requests&orderId=...`) — the backend's job is only to populate `link` correctly; navigation is a frontend concern.

---

## 14. Search

- Federated search endpoint (10.10) queries five collections in parallel using MongoDB text indexes (Section 8) and `$regex` fallback for partial SKU/order-number matches (text indexes don't handle prefix search well).
- Order search additionally matches exact `orderNumber` (case-insensitive) as a fast-path before falling back to text search.
- All search queries are read-only, capped result sets, and rate-limited per admin (60 requests/minute) to prevent abuse.

---

## 15. Logging

- **Development:** Pino with `pino-pretty` transport, `debug` level, full request/response logging via `pino-http`.
- **Production:** Pino JSON output at `info` level (structured, shippable to any log aggregator), `error` level always includes stack trace + request id.
- **Audit logs:** the `ActivityLog` collection (8.11) is the durable audit trail for all admin mutating actions — distinct from application logs, queryable by entity for the future "Activity Log" admin page.
- **Security logs:** failed login attempts (both admin and customer) are logged with IP + timestamp; 5 failed attempts within 15 minutes triggers a temporary account lock (15 minutes) tracked in Redis, independent of the rate limiter.

---

## 16. Security

- **Helmet** with a strict CSP disallowing inline scripts on any server-rendered surface (API is JSON-only, so this mainly hardens default headers).
- **CORS**: explicit allowlist of the admin panel origin and (later) storefront origin; `credentials: true` required for the refresh-token cookie flow.
- **Rate limiting**: global `express-rate-limit` (or Redis-backed for multi-instance) — 100 req/min per IP on public endpoints, 20 req/min on auth endpoints specifically (login/forgot-password) to blunt credential stuffing.
- **JWT**: short-lived access tokens, rotated refresh tokens, `tokenVersion` invalidation (6.1).
- **Password hashing**: bcrypt cost factor 12 minimum.
- **Ownership validation**: enforced in the service layer for every customer-scoped resource (9.5, Section 7).
- **Server-side validation always wins**: the frontend's own client-side validation (already built) is a UX convenience only; every rule in Section 11 is re-enforced server-side regardless of what the client sent.
- **Sanitization**: Mongo query sanitization (`express-mongo-sanitize`) against NoSQL injection; HTML sanitization on any rich-text field (`Blog.content`, `Product.description`) before storage to prevent stored XSS.
- **Secure cookies**: `httpOnly`, `secure` (production), `sameSite=strict`.
- **Secrets management**: all provider keys (Razorpay, Shiprocket, Cloudinary, Resend, JWT secrets, Mongo URI, Redis URL) via environment variables only, validated at boot with a Zod env schema (`config/env.schema.js`) that crashes the process immediately on any missing required secret — never allow the server to start in a half-configured state.
- **Never trust the frontend price.** Every order total is recomputed server-side from live product prices + coupon rules at checkout time; a tampered client-sent price is always ignored.

---

## 17. Implementation Order

1. **Foundation** — `config/`, `database/` (Mongo + Redis connections), `app.js`/`server.js` skeleton, error handler, response wrapper, logger. *(Nothing else can be built or tested without this.)*
2. **Auth (Admin + Customer)** — models, JWT issuing, middleware, login/refresh/logout. *(Every other route depends on `authenticate`/`authorize` middleware existing.)*
3. **Core catalog: Category → Product** — Category depends on nothing; Product depends on Category existing (for the assignment relationship and the delete-guard rule).
4. **Customer profile + Address** — needed before Cart/Checkout/Orders can reference a real customer.
5. **Cart & Checkout (minimal)** — needed before an `Order` can ever legitimately be created; depends on Product (stock/price) and Customer.
6. **Payment (Razorpay) integration** — checkout is incomplete without it; build immediately after Checkout so Orders are created with real payment status from day one rather than needing a later migration.
7. **Orders + state machine** — the single most rule-dense feature; build once Product (stock rules) and Payment (refund triggers) exist so the transition logic can be implemented completely, not partially.
8. **Shipping (Shiprocket) integration** — depends on Orders existing (Mark Shipped is an order-state transition).
9. **Coupons** — depends on Product/Category (eligibility) and Customer (per-customer limits) and is consumed by Checkout, but is functionally independent enough to build in parallel with steps 6–8 if resourcing allows.
10. **Blogs (CMS)** — fully independent of commerce logic; safe to build any time after Auth, included here after commerce-critical paths to keep focus on revenue-affecting features first.
11. **Dashboard aggregates** — depends on all commerce collections existing with real data to aggregate; build last among the "read" features so the aggregation pipelines have real shapes to query against.
12. **Notifications, ActivityLog, Search, Settings** — cross-cutting features that consume events emitted by everything above; implemented last since they observe, rather than drive, the core flows.

Each phase should ship with its own integration tests before the next phase begins, since later phases (e.g., Orders) transactionally depend on earlier ones (Product stock) behaving correctly.

---

*End of BACKEND_SPECIFICATION.md*
