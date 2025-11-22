# StockMaster Backend (Node.js + Express + MongoDB)

This is a modular backend for **StockMaster**, an Inventory Management System (IMS) that digitizes and streamlines stock operations: products, warehouses/locations, receipts, deliveries, internal transfers, adjustments, dashboard, and audit logging.

## Tech Stack
- Node.js 18+
- Express 4
- MongoDB + Mongoose
- JWT auth (email + password) with bcrypt password hashing
- express-validator for validation
- express-rate-limit for auth endpoints
- CORS enabled
- Jest + Supertest + mongodb-memory-server for tests

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the values as needed (Mongo URI, JWT secret, etc.).

### 3. Run the server

```bash
npm start
```

The API runs on `http://localhost:4000` by default.

You can verify with:

```bash
curl http://localhost:4000/health
```

### 4. Seed data

Seed basic data (admin user, locations, products, initial movements):

```bash
node scripts/seed.js
```

Seed with **demo flows** (receipt → transfer → delivery → adjustment):

```bash
node scripts/seed.js --demo
```

Admin user created by the seed:
- Email: `admin@stockmaster.test`
- Password: (random placeholder hash only; use `/api/auth/reset-password` to set a real password for this user in a real deployment)

### 5. Run tests

```bash
npm test
```

Tests use **mongodb-memory-server** and do not touch your real database.

## Authentication & Roles

- `POST /api/auth/register` – Register a user (name, email, password, role). First user can be admin.
- `POST /api/auth/login` – Login and receive JWT.
- `GET /api/auth/me` – Get current user profile based on JWT.
- `POST /api/auth/request-reset` – Request OTP for password reset (logs OTP to server console in this MVP).
- `POST /api/auth/reset-password` – Reset password using email + OTP + newPassword.

Roles:
- `admin` – Can manage products, locations, and access admin-only endpoints (like debug state).
- `staff` – Can perform receipts, deliveries, transfers, view dashboard, etc.

Auth endpoints are rate-limited.

## Core Resources & Endpoints

All responses follow this pattern:
- Success: `{ "error": false, "message": "...", "data": { ... } }`
- Error: `{ "error": true, "message": "...", "details"?: [...] }`

### 1. Products

**Model fields**
- `name` (string, required)
- `sku` (string, unique, required)
- `category` (string)
- `uom` (string, unit of measure, required)
- `reorderLevel` (number, default 0)
- `isActive` (boolean, soft delete flag)
- `locations`: array of `{ location: ObjectId, qty: number }`
- `totalQuantity` (number, aggregated from locations)

**Endpoints**

- `GET /api/products?page=&size=&q=` – List products with pagination and search (`q` on name, sku, category).
- `POST /api/products` (admin) – Create product.
- `GET /api/products/:id` – Get single product.
- `PUT /api/products/:id` (admin) – Update product.
- `DELETE /api/products/:id` (admin) – Soft-delete product (`isActive = false`).
- `POST /api/products/import` (admin) – Bulk CSV import.

**CSV import**
- Endpoint: `POST /api/products/import` with `multipart/form-data` and field `file`.
- Columns: `name, sku, category, uom, reorderLevel, locationCode (optional), qty (optional)`.
- If the SKU exists and a location/qty is provided, the stock is **incremented** for that location.

### 2. Locations

Represents warehouses/racks.

- `GET /api/locations` – List locations.
- `POST /api/locations` (admin) – Create location `{ name, code, description? }`.
- `GET /api/locations/:id` – Get location.
- `PUT /api/locations/:id` (admin) – Update location.
- `DELETE /api/locations/:id` (admin) – Delete location.

### 3. Inventory Movements (Ledger)

Movement types: `receipt`, `delivery`, `transfer`, `adjustment`.

Common line format:
- `productId` – Product ID
- `qty` – Quantity (positive). For adjustments, this is a **delta** and may be negative.
- `fromLocationId` / `toLocationId` as required.

All movement operations use **MongoDB transactions** (when supported) to:
- Insert movement records,
- Update per-location stock and `totalQuantity` on products,
- Write audit logs.

#### 3.1 Movements list

- `GET /api/movements?limit=&type=&productId=&locationId=&status=`

#### 3.2 Receipts (Incoming Stock)

- `POST /api/receipts`

Request body:
```json
{
  "referenceId": "PO-001",
  "note": "Vendor delivery",
  "lines": [
    { "productId": "<productId>", "qty": 50, "toLocationId": "<locationId>" }
  ]
}
```

Effect: Increases stock at `toLocationId` and updates `totalQuantity`.

#### 3.3 Deliveries (Outgoing Stock)

- `POST /api/deliveries`

Request body:
```json
{
  "referenceId": "SO-001",
  "note": "Customer shipment",
  "lines": [
    { "productId": "<productId>", "qty": 10, "fromLocationId": "<locationId>" }
  ]
}
```

Effect: Decreases stock at `fromLocationId`. Fails with **400** if insufficient stock.

#### 3.4 Internal Transfers

- `POST /api/transfers`

Request body:
```json
{
  "referenceId": "TR-001",
  "note": "Move to production",
  "lines": [
    {
      "productId": "<productId>",
      "qty": 20,
      "fromLocationId": "<fromId>",
      "toLocationId": "<toId>"
    }
  ]
}
```

Effect: Moves stock between locations; `totalQuantity` remains unchanged.

#### 3.5 Adjustments

- `POST /api/adjustments`

Request body:
```json
{
  "referenceId": "ADJ-001",
  "note": "Physical count difference",
  "lines": [
    {
      "productId": "<productId>",
      "qty": -3,
      "toLocationId": "<locationId>"
    }
  ]
}
```

Effect: Applies `qty` as a **delta** at `toLocationId` (can be + or −). Fails if resulting stock would be negative.

### 4. Dashboard

- `GET /api/dashboard` – Returns:
  - `totalProducts`
  - `totalStock`
  - `lowStockItems` (array of products where `totalQuantity <= reorderLevel`)
  - `recentMovements` (last 10 movements with product, locations, and user populated)

### 5. Debug (Admin Only)

- `GET /api/debug/state` – Admin-only. Returns:
  - `perProduct`: aggregated stock per product with per-location breakdown.
  - `perLocation`: aggregated stock per location with per-product breakdown.

### 6. Audit Logs

Every create/update/delete on **products**, **locations**, and **movements** writes an `AuditLog` record with:
- `user`, `action`, `entity`, `entityId`, `payload`, `timestamp`.

## 2-Minute Demo Script

1. **Register & login** as admin:
   - `POST /api/auth/register` → `POST /api/auth/login` → copy JWT.
2. **Create locations** `MAIN` and `PROD` via `POST /api/locations`.
3. **Create a product** `Steel Rods` via `POST /api/products`.
4. **Receive goods**:
   - `POST /api/receipts` with 100 kg to `MAIN`.
5. **Transfer internally**:
   - `POST /api/transfers` moving 40 kg from `MAIN` to `PROD`.
6. **Deliver goods**:
   - `POST /api/deliveries` delivering 10 kg from `MAIN`.
7. **Adjust damaged stock**:
   - `POST /api/adjustments` with `qty = -3` at `PROD`.
8. **View dashboard**:
   - `GET /api/dashboard` to see KPIs and recent movements.
9. **Debug state (admin-only)**:
   - `GET /api/debug/state` to check per-product and per-location stock.

## Curl Examples

Replace `${TOKEN}` with your JWT.

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stockmaster.test","password":"yourPassword"}'
```

### Create Product (admin)
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Steel Rods","sku":"SR-001","uom":"kg","category":"Raw Material","reorderLevel":20}'
```

### Receipt
```bash
curl -X POST http://localhost:4000/api/receipts \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"referenceId":"PO-001","lines":[{"productId":"<PRODUCT_ID>","qty":100,"toLocationId":"<LOCATION_ID>"}]}'
```

### Transfer
```bash
curl -X POST http://localhost:4000/api/transfers \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"referenceId":"TR-001","lines":[{"productId":"<PRODUCT_ID>","qty":40,"fromLocationId":"<MAIN_ID>","toLocationId":"<PROD_ID>"}]}'
```

### Delivery
```bash
curl -X POST http://localhost:4000/api/deliveries \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"referenceId":"DEL-001","lines":[{"productId":"<PRODUCT_ID>","qty":10,"fromLocationId":"<MAIN_ID>"}]}'
```

### Dashboard
```bash
curl -H "Authorization: Bearer ${TOKEN}" http://localhost:4000/api/dashboard
```

---

If anything in this backend differs from your expectations (naming, flows, or additional fields), you can tweak the models/routes, and the rest of the architecture should still hold.
