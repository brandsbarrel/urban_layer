# Project Overview

Urban Layers Co. is an enterprise e-commerce platform specializing in premium phone cases and accessories. The platform consists of an Express/Node.js REST API backend with MongoDB, a customer-facing storefront React SPA (`urban_layer`), and an administrative dashboard React SPA (`admin`).

---

# Repository Structure

- **`backend/`**: Node.js/Express REST API (ES Modules)
  - `src/server.js`: Server boot and process lifecycle
  - `src/app.js`: Express app setup and middleware configuration
  - `src/routes/`: Route declarations and mounting
  - `src/controllers/`: HTTP request handlers and payload extraction
  - `src/services/`: Core business logic, third-party integrations, transactions
  - `src/repositories/`: Mongoose database query abstractions
  - `src/models/`: Mongoose schemas and model definitions
  - `src/middlewares/`: Auth, role check, validation, request ID, error handling
  - `src/validators/`: Zod request validation schemas
  - `src/constants/`: Enums, status definitions, role matrices, transitions
  - `src/config/`: Zod environment validation (`env.schema.js`), Pino logger
  - `src/database/`: MongoDB connection setup
  - `src/jobs/`: Background tasks (e.g. `tracking-sync.job.js`)
- **`urban_layer/`**: Customer storefront SPA (Vite + React + Redux Toolkit)
  - `src/main.jsx`: Vite React root entry
  - `src/App.jsx`: App router root
  - `src/routes/AppRoutes.jsx`: Customer application routing
  - `src/pages/`: Customer pages (Home, Shop, ProductDetails, Cart, Checkout, Account, Orders, TrackOrder, etc.)
  - `src/components/`: Reusable storefront UI components and skeletons
  - `src/services/`: Axios HTTP API client and domain service modules
  - `src/redux/`: Redux store and slices (auth, cart, etc.)
- **`admin/`**: Merchant administrative panel SPA (Vite + React + Redux Toolkit)
  - `src/main.jsx`: Vite React root entry
  - `src/App.jsx`: Admin router and shell layout
  - `src/pages/`: Admin management views (Dashboard, Products, Categories, PhoneModels, HeroSlides, Orders, Payments, Customers, Coupons, Settings)
  - `src/components/`: Reusable admin layouts, tables, drawers, form elements
  - `src/redux/`: Admin Redux slices (auth, dashboard, orders, etc.)
  - `src/api/`: Admin Axios API instances and interceptors

---

# Backend Architecture

- **Server Entry**: `src/server.js` boots HTTP server on `PORT` (default 6002/4000) after verifying MongoDB connectivity (`src/database/mongo.js`). Handles graceful shutdown (`SIGTERM`, `SIGINT`).
- **App Assembly**: `src/app.js` disables `x-powered-by`, configures `helmet`, `cors` (`FRONTEND_ORIGINS`), `compression`, `express.json` (25MB limit with raw body capture for webhook verification), and attaches `attachRequestId`. Mounts routes under `API_BASE_PATH` (default `/api`).
- **Routes**: `src/routes/index.js` acts as central router aggregating sub-routers (`adminAuthRouter`, `categoryRouter`, `adminCustomerRouter`, `couponRouter`, `heroSlideAdminRouter`, `orderRouter`, `settingsRouter`, `shiprocketRouter`, `phoneModelRouter`, `productRouter`, `customerAuthRouter`, `cartRouter`, `customerOrderRouter`, `customerProfileRouter`, `wishlistRouter`, `storefrontCouponRouter`, `storefrontCatalogRouter`, `paymentRouter`, `heroSlidePublicRouter`, `homepagePublicRouter`).
- **Controllers**: Express route handlers invoke service methods and respond using standardized `sendSuccess` or forward errors via `next(error)`.
- **Services**: Pure business logic layer. Coordinates Mongoose operations, stock updates, validation rules, external gateway communication (Razorpay, Shiprocket), and transactional consistency.
- **Repositories**: Data access layer wrapping Mongoose models with specialized lookup and mutation methods.
- **Models**: Mongoose schemas enforcing constraints, timestamps, indexing, and virtuals.
- **Middleware**:
  - `attachRequestId`: Generates unique UUID per request.
  - `validate(schema)`: Validates body, query, and params against Zod schemas.
  - `authenticate(realm)`: Validates Bearer JWT for `"admin"` or `"customer"` realm and checks token revocation/version.
  - `authorize(...roles)`: Verifies caller has required role.
  - `notFoundHandler`: Catches unhandled routes and returns 404 AppError.
  - `errorHandler`: Central error handler formatting responses and suppressing internals in production.
- **Validation & Error Handling**: Zod schemas in `src/validators/`. Custom errors extend `AppError` (`ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`, `BusinessRuleError`, `ExternalServiceError`). Responses use standardized `{ success, message, data }` or `{ success: false, error: { message, code, details } }`.

---

# Frontend Architecture

- **Entry Points**:
  - Storefront: `urban_layer/src/main.jsx` wraps `<App />` with `<Provider store={store}>` and `<BrowserRouter>`.
  - Admin: `admin/src/main.jsx` wraps `<App />` with `<Provider store={store}>` and `<BrowserRouter>`.
- **Routing**:
  - Storefront (`urban_layer/src/routes/AppRoutes.jsx`): Public routes (`/`, `/shop`, `/collections`, `/product/:productId`, `/search`, `/cart`, `/order-success/:orderId?`, `/order-failed/:orderId?`, `/track-order/:orderId`), auth routes (`/login`, `/register`, `/forgot-password`), and customer-protected account routes (`/account`, `/account/orders`, `/account/addresses`, `/account/settings`, `/checkout`).
  - Admin (`admin/src/App.jsx`): Login (`/login`) and protected shell (`/`, `/hero-slides`, `/products`, `/products/new`, `/products/edit/:id`, `/categories`, `/phone-models`, `/orders`, `/payments`, `/customers`, `/coupons`, `/blogs`, `/settings`).
- **API Clients & Services**:
  - Storefront: `urban_layer/src/services/publicApi.js` provides shared Axios instance (`baseURL` configured via `VITE_API_BASE_URL`). Specialized services: `homeService.js`, `productsService.js`, `productDetailsService.js`, `orderService.js`, `trackingService.js`.
  - Admin: `admin/src/api/` provides authenticated Axios instance with Bearer token interceptor reading from `localStorage`.
- **Customer/Storefront Structure**:
  - Layouts: `MainLayout` (Header, Footer, Cart Drawer), `AuthLayout`, `AccountLayout`.
  - State: Redux Toolkit slices (`authSlice.js`, `cartSlice.js`, `wishlistSlice.js`).
- **Admin Structure**:
  - Layout: `AdminLayout` (Sidebar, Header, Footer, dynamic main column).
  - State: Redux Toolkit slices (`authSlice`, `ordersSlice`, `productsSlice`, `categoriesSlice`, `customersSlice`, `couponsSlice`, `heroSlidesSlice`, `phoneModelsSlice`, `settingsSlice`).
- **Reusable Components**:
  - Storefront: `ProductCard`, `HeroSearchBar`, `Pagination`, `PriceRangeFilter`, skeletons (`HomeSkeletons`), empty and error section wrappers.
  - Admin: `DataTable`, `Drawer`, `Badge`, `ConfirmModal`, `DateRangePicker`, `ComingSoon`.

---

# Database / Models

- **`Admin` (`admin.model.js`)**: Backoffice administrators and staff. Fields: name, email, passwordHash, role (`Admin`, `SuperAdmin`), permissions, tokenVersion, isActive.
- **`Customer` (`customer.model.js`)**: End-user accounts. Fields: name, email, phone, passwordHash, addresses (embedded schema), wishlist (array of `Product` ObjectIds), tokenVersion, isActive.
- **`Address` (`address.schema.js`)**: Embedded schema for customer and order addresses (recipientName, line1, line2, city, state, postalCode, country, phone, isDefault).
- **`Product` (`product.model.js`)**: Catalog items. Fields: name, slug, sku, description, categories (refs to `Category`), phoneModelId (ref to `PhoneModel`), basePrice, salePrice, costPrice, stock, reservedStock, unfulfilledOrders, taxRate, status (`Draft`, `Published`, `Archived`), featuredImage, gallery, packageDimensions, packageWeight, fragile, pickupLocation, activity log.
- **`Category` (`category.model.js`)**: Case style taxonomy (e.g., Slim, Tough, Leather). Fields: name, slug, description, image, icon, isVisible, displayOrder, metadata.
- **`PhoneModel` (`phone-model.model.js`)**: Device taxonomy (e.g., iPhone 16 Pro, Galaxy S25). Fields: brand, name, slug, releaseYear, isPopular, isDiscontinued.
- **`Cart` (`cart.model.js`)**: Customer active basket. Fields: customer (ref), items array (product ref, variantId, quantity).
- **`Order` (`order.model.js`)**: Core commerce transaction. Fields: orderNumber, customer (ref), items snapshot, shippingAddress, billingAddress, status, paymentStatus, paymentMethod (`Online`, `COD`), subtotal, taxAmount, shippingAmount, discountAmount, totalAmount, paymentGatewayOrderId, paymentGatewayPaymentId, paymentGatewaySignature, shipping details (awb, carrier, shiprocketOrderId, shiprocketShipmentId, shiprocketTrackingUrl), returnShipment details, trackingEvents array, returnTrackingEvents array, timeline array.
- **`Coupon` (`coupon.model.js`)**: Discount coupons. Fields: code, discountType (`Percentage`, `Flat`), discountValue, minOrderValue, maxDiscount, startsAt, expiresAt, usageLimit, usageCount, status.
- **`HeroSlide` (`hero-slide.model.js`)**: Storefront hero banner carousel slides. Fields: title, subtitle, eyebrow, ctaText, ctaLink, backgroundImage, imageAlt, displayOrder, isActive.
- **`Settings` (`settings.model.js`)**: Singleton (`global_settings`) storing store preferences, contact info, and encrypted/hidden Shiprocket credentials (`email`, `password`, `webhookSecret`).

---

# API Structure

### Public & Storefront APIs
- `GET /api/categories`: Active category list
- `GET /api/devices`: Active phone models with dynamic product counts
- `GET /api/products`: Storefront catalog product list (supports filters, search, sort, pagination)
- `GET /api/hero-slides`: Active hero slider slides
- `GET /api/storefront/catalog/products/:identifier`: Product detail by ID or slug
- `POST /api/storefront/coupons/validate`: Coupon validation against cart subtotal
- `POST /api/customer/auth/register`: Customer account creation
- `POST /api/customer/auth/login`: Customer login (returns access token)
- `POST /api/webhooks/razorpay`: Razorpay webhook ingestion (payment capture/failure)
- `POST /api/webhooks/tracking`: Shiprocket shipment tracking webhook

### Customer-Authenticated APIs (`/api/customer/*`)
- `GET, PUT /api/customer/profile`: Customer profile details and updates
- `GET, POST, PUT, DELETE /api/customer/addresses`: Saved address management
- `GET, POST, PUT, DELETE /api/customer/cart`: Customer persistent cart management
- `POST /api/customer/cart/checkout`: Cart checkout (creates pending online order or confirmed COD order)
- `GET /api/customer/orders`: Customer order history
- `GET /api/customer/orders/:id`: Customer order detail
- `GET /api/customer/orders/:id/tracking`: Customer tracking timeline and courier status
- `GET, POST, DELETE /api/customer/wishlist`: Customer wishlist management
- `POST /api/storefront/payments/orders/:orderId/create`: Initiate/fetch Razorpay payment order
- `POST /api/storefront/payments/verify`: Verify Razorpay signature and confirm order

### Admin-Authenticated APIs (`/api/admin/*`)
- `POST /api/admin/auth/login`: Staff/Admin login
- `GET, POST, PUT, DELETE /api/admin/products`: Product CRUD, archive, stock adjustments
- `GET, POST, PUT, DELETE /api/admin/categories`: Category management and order sorting
- `GET, POST, PUT, DELETE /api/admin/phone-models`: Phone model device management
- `GET, POST, PUT, DELETE /api/admin/hero-slides`: Hero slide banner management
- `GET, PUT /api/admin/orders`: Order listing, filtering, detail, manual status transition
- `GET /api/admin/orders/:id/tracking`: Admin full shipment tracking view
- `POST /api/admin/orders/:id/refresh-tracking`: On-demand tracking refresh from Shiprocket
- `POST /api/admin/shiprocket/create-order`: Adhoc Shiprocket order generation
- `POST /api/admin/shiprocket/create-shipment`: Courier assignment and AWB generation
- `POST /api/admin/shiprocket/generate-label`: Shipping label PDF generation
- `POST /api/admin/shiprocket/generate-invoice`: Tax invoice PDF generation
- `GET, PUT /api/admin/customers`: Customer listing and status toggle
- `GET, POST, PUT, DELETE /api/admin/coupons`: Promotion and coupon management
- `GET, PUT /api/admin/settings`: Store settings and Shiprocket credentials configuration

---

# Authentication / Authorization

- **Mechanisms**: Stateless Bearer JWT tokens passed via `Authorization: Bearer <token>`. Tokens contain `sub` (user ID), `role`, and `realm` (`"admin"` or `"customer"`).
- **Secrets**: Two separate secrets configured in environment: `ADMIN_JWT_ACCESS_SECRET` and `CUSTOMER_JWT_ACCESS_SECRET`.
- **Validation**: `authenticate(realm)` middleware extracts the Bearer token, verifies signature against the specified realm secret, checks revocation (`isAccessTokenRevoked`), verifies user existence, and matches `tokenVersion`.
- **Roles**:
  - Admin Realm: `SuperAdmin`, `Admin`, `Staff`
  - Customer Realm: `Customer`
- **Authorization**: `authorize(...roles)` middleware validates `req.user.role` matches allowed roles for the route.

---

# Payment Architecture

- **Payment Methods**: `Online` (Razorpay) and `COD` (Cash on Delivery).
- **Payment Statuses**: `Pending`, `Paid`, `Failed`, `Refund Processing`, `Refunded`, `Partially Refunded`, `Collected` (COD), `Settled` (COD), `Collection Failed`, `Settlement Failed`.
- **Order Statuses**: `Pending`, `Confirmed`, `Processing`, `Packed`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`, `Return Requested`, `Return Approved`, `Return Pickup`, `Returned`, `Refund Processing`, `Refunded`, `Return Rejected`.

### Razorpay Flow
1. Customer initiates checkout at `POST /api/customer/cart/checkout` with `paymentMethod: "Online"`.
2. Order is created in MongoDB with `status: "Pending"` and `paymentStatus: "Pending"`.
3. Stock is **not** deducted yet; Cart is **not** cleared yet.
4. Backend creates an order on Razorpay API (`POST https://api.razorpay.com/v1/orders`) in paise (`unitPrice * 100`).
5. Frontend opens Razorpay Checkout modal using `razorpayOrderId` and public key.
6. Upon payment completion, frontend calls `POST /api/storefront/payments/verify` with `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
7. Backend verifies HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`.
8. Confirmation logic executes via `confirmOnlinePaymentSuccess`.
9. Alternatively, Razorpay webhook at `POST /api/webhooks/razorpay` verifies signature on `rawBody` using `RAZORPAY_WEBHOOK_SECRET` for `payment.captured` or `order.paid` and triggers `confirmOnlinePaymentSuccess`.

### COD Flow
1. Customer initiates checkout at `POST /api/customer/cart/checkout` with `paymentMethod: "COD"`.
2. Stock is deducted immediately in the transaction (`stock -= qty`, `reservedStock += qty`, `unfulfilledOrders += qty`).
3. Customer cart is cleared immediately in the database.
4. Order is saved with `status: "Confirmed"` and `paymentStatus: "Pending"` (COD remains unpaid until courier collection).
5. Shiprocket order creation is triggered immediately outside the MongoDB transaction via `createShiprocketOrderForConfirmedOrder(order)`.

### Confirmation & Idempotency Rules
- `confirmOnlinePaymentSuccess` is fully idempotent.
- First check: If order already has `paymentStatus: "Paid"` and `status: "Confirmed"`, it immediately returns existing order state.
- Atomic claim: Executes Mongoose `OrderModel.findOneAndUpdate({ _id: orderId, paymentStatus: { $ne: "Paid" } }, { ... })`. If another concurrent execution or webhook already updated the order, it cleanly yields.
- Stock deduction: Executed exactly once during confirmation (`stock` decreases, `reservedStock` and `unfulfilledOrders` increase).
- Cart clearing: Customer DB cart cleared exactly once.
- Shiprocket order creation: Executed once via `createShiprocketOrderForConfirmedOrder`, which contains an idempotency check (`freshOrder.shipping?.shiprocketOrderId`).

---

# Shiprocket Architecture

- **Logistics Role**: Shiprocket is the external logistics orchestrator and provider of tracking truth.
- **Shiprocket Order Creation**:
  - Triggered automatically on order confirmation (COD checkout or Online payment verification) or manually via `POST /api/admin/shiprocket/create-order`.
  - Makes authenticated request to Shiprocket API: `POST https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`.
  - Credentials: Read from `SettingsModel` (`global_settings`) with fallback to environment variables (`SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`).
  - Auth Token: Token cached with 9-day expiration buffer (`getShiprocketToken`).
- **Shipment / AWB Flow**:
  - `POST /api/admin/shiprocket/create-shipment` requests courier assignment via `POST /courier/assign/awb`.
  - Assigns AWB number and tracking URL, updating order `shipping.awb`, `shipping.shiprocketAwbCode`, `shipping.shiprocketTrackingUrl`.
  - Label & Invoice: `POST /api/admin/shiprocket/generate-label` and `POST /api/admin/shiprocket/generate-invoice`.
- **Tracking & Webhook**:
  - Webhook Endpoint: `POST /api/webhooks/tracking` (unauthenticated public endpoint, validated via security secret).
  - Webhook Security: Inspects `x-api-key`, `x-shiprocket-signature`, or `shiprocket-webhook-secret` header. Validated against `SettingsModel` webhookSecret or `SHIPROCKET_WEBHOOK_SECRET`.
  - Event Key & Idempotency: Generates SHA256 hash `eventKey` from `${awb_code}|${scanDate}|${status_code}|${activity}|${location}`. If `eventKey` already exists in `trackingEvents` or `returnTrackingEvents`, duplicate is ignored.
  - Event Timestamp: `occurredAt` MUST be taken from the carrier scan date (`updated_at`), never from `Date.now()`.
  - Tracking Source of Truth: Webhook updates `shipping.currentStatus`, `shipping.currentStatusId`, `shipping.shipmentStatus`, `shipping.trackingUrl`, and appends to `trackingEvents`.
- **Identifier Mapping**:
  - Urban Layers Order Number (`order.orderNumber`): Sent to Shiprocket as `order_id` in creation payload.
  - Shiprocket Internal Order ID (`response.order_id`): Integer ID returned by Shiprocket. Stored in Urban Layers as `order.shipping.shiprocketOrderId`. NEVER conflate this with `order.orderNumber`.
  - Shiprocket Shipment ID (`response.shipment_id`): Stored in `order.shipping.shiprocketShipmentId`.
  - Reference Order ID (`order.shipping.shiprocketReferenceOrderId`): Preserves Urban Layers orderNumber.
- **Return Tracking**:
  - If incoming webhook AWB or shipment ID matches `order.returnShipment.awb` or `order.returnShipment.shiprocketShipmentId`, event is appended to `order.returnTrackingEvents` and updates `order.returnShipment`.
- **Fallback Tracking API**:
  - Admin manual refresh: `POST /api/admin/orders/:id/refresh-tracking` invokes `refreshOrderTracking(orderId)`, querying `GET /courier/track/awb/${awb}`.
  - Scheduled Background Job: `src/jobs/tracking-sync.job.js` polls non-final orders (active AWBs not in Delivered/Cancelled/RTO Delivered) every 15-30 minutes.

---

# Admin Architecture

The Admin dashboard (`admin`) provides backoffice operations:
- **Dashboard**: High-level store metrics, sales revenue, order volumes, recent orders.
- **Products**: Table listing, filtering by status/category/stock, product creation (`/products/new`), and edit (`/products/edit/:id`) with phone case specifications, pricing, gallery URLs, and shipping dimensions.
- **Categories**: Case styles management (Slim, Tough, Leather), active status toggles, sort ordering.
- **Phone Models / Devices**: Manage compatible devices (Apple, Samsung, Google), brand grouping, and product compatibility mapping.
- **Hero Slides**: Manage storefront homepage hero slides (title, subtitle, background image, CTA links, display order, active status).
- **Orders**: Order processing table, order detail drawer, manual next-step status transitions (Confirm, Pack, Ship, Deliver, Cancel), Shiprocket shipment initiation, AWB assignment, label generation, and tracking inspection.
- **Payments**: Transaction log and payment status visibility.
- **Customers**: Customer listing, order history aggregates, account status controls.
- **Coupons**: Coupon creation and management (discount types, thresholds, date ranges, usage limits).
- **Blogs**: Mock CMS interface (ready for future blog API integration).
- **Settings**: Store profile settings and Shiprocket credentials management (email, password, pickup location, webhook secret).

---

# Homepage Architecture

- **Active Sections & APIs**:
  1. `HeroSlider`: Dynamic banner slider powered by `GET /api/hero-slides`.
  2. `TrustStrip`: Static value proposition strip (free delivery, quality guarantee, easy returns).
  3. `ShopByDevice`: Device category carousel powered by `GET /api/devices`.
  4. `ShopByCategory`: Material & collection cards powered by `GET /api/categories`.
  5. `BestSellers`: Curated product grid powered by `GET /api/products?tag=best-seller`.
  6. `MaterialStory`: Editorial story section powered by structured editorial content (`homeMockData.js`).
  7. `LifestyleCampaign`: Editorial banner powered by structured editorial content (`homeMockData.js`).
  8. `Newsletter`: Customer newsletter signup component.
- **Intentionally Removed / Retired Sections**:
  - Static legacy `HeroSection` (superseded by dynamic `HeroSlider`).
  - Static `ShopByDeviceSection` (superseded by API-driven `ShopByDevice`).
  - Static `CollectionsSection` (superseded by API-driven `ShopByCategory`).
  - Static `BestSellersSection` (superseded by API-driven `BestSellers`).
  - `FeatureBannerSection` (removed in favor of unified editorial layout).
  - `WhyChooseSection` (superseded by `TrustStrip`).
  - Social login buttons on login/register (temporarily removed until social OAuth backend is implemented).

---

# Environment

### Backend Environment Variables
- `NODE_ENV`
- `PORT`
- `APP_NAME`
- `API_BASE_PATH`
- `MONGO_URI`
- `ADMIN_JWT_ACCESS_SECRET`
- `CUSTOMER_JWT_ACCESS_SECRET`
- `FRONTEND_ORIGINS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `SHIPROCKET_EMAIL`
- `SHIPROCKET_PASSWORD`
- `SHIPROCKET_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LOG_LEVEL`
- `TRACKING_SYNC_INTERVAL_MS` (optional job tuning)
- `TRACKING_SYNC_BATCH_SIZE` (optional job tuning)

### Storefront (`urban_layer`) Environment Variables
- `VITE_API_BASE_URL`
- `VITE_RAZORPAY_KEY_ID`

### Admin Panel (`admin`) Environment Variables
- `VITE_API_BASE_URL`

---

# Important Architectural Rules

1. **Browser must never call Shiprocket directly**: All Shiprocket API requests must pass through backend services.
2. **Shiprocket is the logistics source of truth**: Shipment status and tracking events come from Shiprocket webhooks or backend refresh jobs, never manipulated manually on the client.
3. **Payment confirmation must be idempotent**: Both frontend verification and Razorpay webhooks can confirm payments; execution must be atomic and safe against concurrent attempts.
4. **COD is unpaid until collection**: COD orders are created as `status: "Confirmed"` but `paymentStatus: "Pending"` until collected by courier.
5. **Stock reservation rules**: COD reserves stock immediately upon checkout. Online orders reserve stock upon successful payment capture.
6. **No identifier confusion**: `order.orderNumber` is our internal order code (sent as `order_id` to Shiprocket). Shiprocket's returned `order_id` is an internal provider ID stored in `shipping.shiprocketOrderId`.
7. **Tracking event timestamps**: `occurredAt` for tracking scans must always reflect the carrier's scan date (`updated_at`), never `Date.now()`.
8. **Do not duplicate existing models/services/APIs**: Always extend or consume existing patterns across routes, services, repositories, and models.
9. **No raw secrets in repositories**: Secrets belong strictly in local/server environment configs.

---

# Current System Status

### DONE
- Complete backend foundation (Express, MongoDB, Zod validation, structured logging, centralized errors).
- Dual-realm JWT authentication (`Admin` and `Customer`).
- Product catalog, category taxonomy, and phone model device management APIs.
- Customer cart and address management.
- Complete checkout flow with COD and Razorpay integration.
- Full Shiprocket logistics integration: adhoc order creation, AWB generation, label/invoice generation, tracking webhook, and fallback tracking sync job.
- Customer order tracking API with courier timeline.
- Dynamic homepage storefront APIs (`/api/hero-slides`, `/api/devices`, `/api/categories`, `/api/products`).
- Admin panel core modules: Dashboard, Products, Categories, Phone Models, Hero Slides, Orders, Payments, Customers, Coupons, Settings.
- Storefront core flows: Browse, Cart, Checkout, Order Tracking, Customer Account, Wishlist.

### IN PROGRESS
- Storefront editorial/blog content backend wiring (currently backed by mock data structure).
- Polish for admin order creation / category edit modals marked with `ComingSoon`.

### KNOWN ISSUES
- Social login buttons temporarily removed from storefront UI (OAuth backend not implemented).
- Product media uploads are currently URL-only (multipart file upload pipeline not connected).

---

# AGENT WORK RULES

1. Read PROJECT_CONTEXT.md first.
2. Read CURRENT_WORK.md second.
3. Do not perform a full repository audit unless necessary.
4. Verify only files relevant to the requested task.
5. Reuse existing services/models/routes.
6. Avoid duplicate implementations.
7. Make minimal changes.
8. Run relevant tests.
9. Update CURRENT_WORK.md after every task.
10. Update PROJECT_CONTEXT.md only when architecture/features change.
