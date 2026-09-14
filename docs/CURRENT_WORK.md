# CURRENT TASK
Fix the Admin Products → Best Seller logic so marking/unmarking Best Seller updates only Best Seller state without wiping or changing other product fields.

# COMPLETED
- Identified root cause in Zod validator defaults (`productCreateSchema.partial()` applied schema defaults during partial `PATCH /api/admin/products/:id` calls, replacing omitted fields with empty values and Draft status).
- Fixed `catalog.validator.js`: separated base fields from creation defaults, created non-defaulting `productUpdateSchema`, and added `productBestSellerSchema`.
- Implemented dedicated atomic `PATCH /api/admin/products/:id/best-seller` endpoint in backend routes, controller, and service with atomic `$addToSet`/`$pull` on `tags` and `$set` on `bestSeller`.
- Updated `ProductModel` to include `bestSeller: { type: Boolean, default: false }`.
- Updated admin `productsSlice.js`, `ProductsTable.jsx`, and `ProductDrawer.jsx` to send `{ bestSeller: boolean }` and handle state updates without document overwrites.
- Verified database document state before and after toggling with live MongoDB tests.

# IN PROGRESS
- None.

# BROKEN / BLOCKED
- Social login (Google OAuth) is not implemented on backend; frontend buttons intentionally removed.
- Blog articles in admin panel and storefront are on mock data; backend blog endpoints not yet implemented.
- Product media uploads are currently URL-based (direct multipart file upload endpoint not active).

# FILES BEING MODIFIED
- `admin/src/redux/slices/productsSlice.js`
- `admin/src/components/products/ProductsTable/ProductsTable.jsx`
- `admin/src/components/products/ProductDrawer/ProductDrawer.jsx`
- `backend/src/models/product.model.js`
- `backend/src/validators/catalog.validator.js`
- `backend/src/services/product.service.js`
- `backend/src/controllers/product.controller.js`
- `backend/src/routes/product.routes.js`
- `docs/CURRENT_WORK.md`

# NEXT STEP
Ready for next task.

# TEST STATUS
- Backend syntax checks (`node --check`) passed on all modified files.
- Admin production build (`npm run build`) passed with 0 errors.
- Live MongoDB database test verified: all product fields (categories, images, description, stock, status, name, sku) remain 100% intact before and after marking/unmarking best seller.
- Filter query test verified: `listProducts({ tag: "best-seller" })` accurately includes/excludes product upon toggle.
