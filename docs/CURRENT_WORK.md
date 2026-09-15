# CURRENT TASK
Finish the CUSTOMER ADDRESS APIs.

# COMPLETED
- Customer Address APIs fully implemented and tested:
  - GET    /api/customer/addresses - List all addresses for authenticated customer
  - POST   /api/customer/addresses - Create new address (max 3 enforced)
  - GET    /api/customer/addresses/:index - Get address by index
  - PATCH  /api/customer/addresses/:index - Update address by index
  - DELETE /api/customer/addresses/:index - Delete address by index
  - PATCH  /api/customer/addresses/:index/default - Set address as default
- All backend validation, ownership enforcement, and business rules verified:
  - Maximum 3 addresses per customer (enforced in `addCustomerAddress` service)
  - Address ownership enforced (all operations scoped to `req.user.id`)
  - Customers cannot access other customers' addresses
  - Only one default address exists (handled in add/update/delete/setDefault)
  - Required address fields validated via `addressSchema`
  - Checkout/order address snapshot behavior remains intact (orders copy addresses via `.toObject()`)
  - Updating/deleting saved addresses does not modify historical order addresses

# IN PROGRESS
- None.

# BROKEN / BLOCKED
- Social login (Google OAuth) is not implemented on backend; frontend buttons intentionally removed.
- Blog articles in admin panel and storefront are on mock data; backend blog endpoints not yet implemented.
- Product media uploads are currently URL-based (direct multipart file upload endpoint not active).

# FILES VERIFIED (No changes needed - all APIs already implemented)
- `backend/src/routes/customer-profile.routes.js`
- `backend/src/controllers/customer.controller.js`
- `backend/src/services/customer.service.js`
- `backend/src/validators/customer.validator.js`
- `backend/src/models/address.schema.js`
- `backend/src/models/customer.model.js`
- `backend/src/repositories/customer.repository.js`
- `urban_layer/src/redux/slices/addressesSlice.js`
- `urban_layer/src/api/addressesApi.js`

# NEXT STEP
Ready for next task.

# TEST STATUS
- Backend syntax checks (`node --check`) passed on all address-related files.
- All address endpoints verified to be correctly routed under `/api/customer/addresses*`.
- Frontend Redux slice and API client already integrated with backend endpoints.
