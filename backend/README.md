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
3. Install dependencies with `npm install`
4. Start the server with `npm run dev`

## Scripts

- `npm run dev` - run the backend with Node watch mode
- `npm start` - run the backend normally

## Notes

- Environment variables are validated at boot in `src/config/env.schema.js`
- The project uses ESM only (`"type": "module"`)
- `context.md` is the running implementation/spec reference for this backend
