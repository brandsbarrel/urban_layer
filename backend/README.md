# Urban Layers Backend

Backend API for the Urban Layers admin/storefront ecosystem.

## Current Scope

- Foundation app/server setup
- Admin and customer authentication
- Categories and products
- Customer management and profile/address flows
- Customer cart and minimal checkout

## Local Setup

1. Copy `.env.example` to `.env`
2. Fill in real secrets and service credentials
3. Set `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` for the initial admin seed
4. Install dependencies with `npm install`
5. Create the first admin with `npm run seed:admin`
6. Start the server with `npm run dev`

## Scripts

- `npm run dev` - run the backend with Node watch mode
- `npm start` - run the backend normally
- `npm run seed:admin` - create the first `SuperAdmin` from env values

## Notes

- Environment variables are validated at boot in `src/config/env.schema.js`
- The project uses ESM only (`"type": "module"`)
- `context.md` is the running implementation/spec reference for this backend
