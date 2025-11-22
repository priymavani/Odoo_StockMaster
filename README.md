## Team Name : NexByte
## Team Details :
 ### Priy Mavani
 ### Mayur Waykar
 ### Vanshika Jangam
 ### Krish shyara

## Problem Statement - StockMaster
## Revier Name : Aman Patel 

## Demo Video

Watch the demo: [Play video on Google Drive](https://drive.google.com/drive/folders/1xgiYgXuigjltaZf_UEWuIw6FVTkyLNTO)

## Project Link 
[stock master link](https://odoo-stock-frontend.vercel.app/)

[Backend Link](https://odoo-stockmaster-backend.onrender.com)


# StockMaster - Inventory Management System

StockMaster is a comprehensive, full-stack inventory management system designed to digitize and streamline stock operations. It provides a modern web interface for managing products, warehouses/locations, receipts, deliveries, internal transfers, adjustments, and real-time inventory tracking with audit logging.

## 🚀 Features

### Core Functionality
- **Product Management**: Create, update, delete, and search products with SKU tracking
- **Location/Warehouse Management**: Manage multiple storage locations with unique codes
- **Inventory Movements**:
  - **Receipts**: Record incoming stock from suppliers
  - **Deliveries**: Track outgoing stock to customers
  - **Transfers**: Move stock between locations
  - **Adjustments**: Correct inventory discrepancies
- **Real-time Dashboard**: View KPIs, low stock alerts, and recent movements
- **Audit Logging**: Complete audit trail of all inventory operations
- **CSV Import**: Bulk import products with stock quantities
- **Role-based Access Control**: Admin and Staff roles with different permissions

### User Interface
- Modern, responsive React frontend with Tailwind CSS
- Interactive charts and visualizations (Recharts)
- Smooth animations (Framer Motion)
- Real-time notifications (React Hot Toast)
- Protected routes with authentication
- Product search and pagination
- Detailed product views with location breakdown

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Validation**: express-validator
- **Security**: express-rate-limit for API protection
- **File Upload**: Multer for CSV imports
- **Testing**: Jest + Supertest + mongodb-memory-server

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API + TanStack React Query
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        React[React Frontend<br/>Vite + React 19]
    end
    
    subgraph "API Layer"
        Express[Express.js Server<br/>REST API]
        Middleware[Middlewares<br/>Auth, Validation, Rate Limit]
    end
    
    subgraph "Business Logic Layer"
        Controllers[Controllers]
        Services[Services<br/>Business Logic]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB Database)]
        Models[Models<br/>User, Product, Location, Movement, AuditLog]
    end
    
    Browser -->|HTTP/HTTPS| React
    React -->|API Calls| Express
    Express --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Models
    Models --> MongoDB
    
    style Browser fill:#e1f5ff
    style React fill:#61dafb
    style Express fill:#000000,color:#fff
    style MongoDB fill:#47a248,color:#fff
```

### Backend Architecture

```mermaid
graph LR
    subgraph "Request Flow"
        Request[HTTP Request] --> Routes[Route Handlers]
        Routes --> Auth[Auth Middleware]
        Auth --> Validation[Validation Middleware]
        Validation --> Role[Role Middleware]
        Role --> Controller[Controller]
    end
    
    subgraph "Business Logic"
        Controller --> Service[Service Layer]
        Service --> Transaction[Transaction Handler]
    end
    
    subgraph "Data Access"
        Transaction --> Model[Mongoose Models]
        Model --> MongoDB[(MongoDB)]
    end
    
    subgraph "Audit & Logging"
        Service --> Audit[Audit Service]
        Audit --> AuditLog[(Audit Logs)]
    end
    
    style Request fill:#e1f5ff
    style Controller fill:#ffd700
    style Service fill:#90ee90
    style MongoDB fill:#47a248,color:#fff
    style AuditLog fill:#ff6b6b,color:#fff
```

### Frontend Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        Pages[Page Components<br/>Dashboard, Products, etc.]
        Components[UI Components<br/>Forms, Cards, Modals]
    end
    
    subgraph "State Management"
        Context[Auth Context<br/>User State]
        ReactQuery[React Query<br/>Server State Cache]
    end
    
    subgraph "Data Layer"
        Hooks[Custom Hooks<br/>useApi, useAuth]
        ApiClient[API Client<br/>Axios with Interceptors]
    end
    
    subgraph "External"
        BackendAPI[Backend API<br/>Express Server]
    end
    
    Pages --> Components
    Pages --> Context
    Pages --> ReactQuery
    ReactQuery --> Hooks
    Hooks --> ApiClient
    ApiClient -->|HTTP Requests| BackendAPI
    Context -->|Auth Token| ApiClient
    
    style Pages fill:#61dafb
    style Context fill:#ffd700
    style ReactQuery fill:#ff6b6b
    style BackendAPI fill:#000000,color:#fff
```

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Service
    participant Database
    participant Audit
    
    User->>Frontend: User Action
    Frontend->>API: HTTP Request (with JWT)
    API->>API: Validate Token & Role
    API->>Service: Process Request
    Service->>Database: Start Transaction
    Service->>Database: Update Data
    Service->>Audit: Log Action
    Database->>Service: Commit Transaction
    Service->>API: Return Result
    API->>Frontend: JSON Response
    Frontend->>User: Update UI
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthAPI
    participant AuthService
    participant Database
    participant JWT
    
    User->>Frontend: Login Request
    Frontend->>AuthAPI: POST /api/auth/login
    AuthAPI->>AuthService: Validate Credentials
    AuthService->>Database: Find User
    Database->>AuthService: User Data
    AuthService->>AuthService: Verify Password (bcrypt)
    AuthService->>JWT: Generate Token
    JWT->>AuthService: JWT Token
    AuthService->>AuthAPI: Token + User Data
    AuthAPI->>Frontend: Response with Token
    Frontend->>Frontend: Store Token (localStorage)
    Frontend->>User: Redirect to Dashboard
    
    Note over Frontend,Database: Subsequent Requests
    User->>Frontend: Access Protected Route
    Frontend->>AuthAPI: Request with Bearer Token
    AuthAPI->>JWT: Verify Token
    JWT->>AuthAPI: Decoded User Info
    AuthAPI->>Frontend: Authorized Response
```

### Database Schema Relationships

```mermaid
erDiagram
    User ||--o{ Movement : creates
    User ||--o{ AuditLog : performs
    Product ||--o{ Movement : "has movements"
    Product ||--o{ ProductLocation : "stored in"
    Location ||--o{ ProductLocation : "contains"
    Location ||--o{ Movement : "from/to"
    
    User {
        ObjectId _id
        string name
        string email
        string password
        string role
        string resetOtp
        date resetOtpExpiresAt
    }
    
    Product {
        ObjectId _id
        string name
        string sku
        string category
        string uom
        number reorderLevel
        boolean isActive
        number totalQuantity
        array locations
    }
    
    Location {
        ObjectId _id
        string name
        string code
        string description
    }
    
    Movement {
        ObjectId _id
        string type
        ObjectId product
        number qty
        ObjectId fromLocation
        ObjectId toLocation
        ObjectId createdBy
        string referenceId
        string status
        string note
    }
    
    ProductLocation {
        ObjectId location
        number qty
    }
    
    AuditLog {
        ObjectId _id
        ObjectId user
        string action
        string entity
        ObjectId entityId
        object payload
    }
```

### Inventory Movement Flow

```mermaid
flowchart TD
    Start[User Initiates Movement] --> Validate{Validate Input}
    Validate -->|Invalid| Error[Return Error]
    Validate -->|Valid| StartTx[Start MongoDB Transaction]
    
    StartTx --> ProcessLines[Process Each Line]
    ProcessLines --> CheckProduct{Product Exists?}
    CheckProduct -->|No| Rollback[Rollback Transaction]
    CheckProduct -->|Yes| CheckLocation{Location Exists?}
    
    CheckLocation -->|No| Rollback
    CheckLocation -->|Yes| CheckStock{Sufficient Stock?}
    
    CheckStock -->|No| Rollback
    CheckStock -->|Yes| UpdateProduct[Update Product Stock]
    
    UpdateProduct --> CreateMovement[Create Movement Record]
    CreateMovement --> LogAudit[Log Audit Entry]
    LogAudit --> CommitTx[Commit Transaction]
    
    CommitTx --> Success[Return Success Response]
    Rollback --> Error
    
    style Start fill:#e1f5ff
    style Success fill:#90ee90
    style Error fill:#ff6b6b
    style Rollback fill:#ff6b6b
```

## 📁 Project Structure

```
Odoo_StockMaster/
├── backend/                    # Node.js/Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── locationController.js
│   │   ├── movementController.js
│   │   └── productController.js
│   ├── middlewares/           # Express middlewares
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/                # Mongoose models
│   │   ├── AuditLog.js
│   │   ├── Location.js
│   │   ├── Movement.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── locationRoutes.js
│   │   ├── movementRoutes.js
│   │   └── productRoutes.js
│   ├── services/              # Business logic
│   │   ├── auditService.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── inventoryService.js
│   │   └── productService.js
│   ├── scripts/               # Utility scripts
│   │   ├── seed.js           # Database seeding
│   │   └── setAdminPassword.js
│   ├── tests/                 # Test files
│   │   ├── inventoryFlows.test.js
│   │   ├── productModel.test.js
│   │   └── setup.js
│   ├── utils/                 # Utility functions
│   │   ├── pagination.js
│   │   └── response.js
│   ├── app.js                 # Express app configuration
│   ├── server.js               # Server entry point
│   └── package.json
│
└── Frontend/                  # React frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Layout.jsx
    │   │   ├── MovementForm.jsx
    │   │   ├── ProductForm.jsx
    │   │   ├── ProductImportModal.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ui/            # UI components
    │   │       ├── Button.jsx
    │   │       ├── Card.jsx
    │   │       ├── Input.jsx
    │   │       └── Modal.jsx
    │   ├── context/           # React Context
    │   │   └── AuthContext.jsx
    │   ├── hooks/             # Custom hooks
    │   │   ├── useApi.js
    │   │   └── useAuth.js
    │   ├── lib/               # Utilities
    │   │   ├── apiClient.js
    │   │   └── utils.js
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Locations.jsx
    │   │   ├── Receipts.jsx
    │   │   ├── Deliveries.jsx
    │   │   ├── Transfers.jsx
    │   │   ├── Adjustments.jsx
    │   │   ├── Movements.jsx
    │   │   ├── Debug.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── Profile.jsx
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # Entry point
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance like MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Odoo_StockMaster
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

### Configuration

#### Backend Configuration

1. **Create `.env` file in the `backend` directory:**
   ```env
   # Server
   PORT=4000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/stockmaster
   # Or for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Email (for password reset - optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

2. **Start MongoDB** (if using local instance)
   ```bash
   # On Windows (if installed as service, it should auto-start)
   # On Linux/Mac:
   sudo systemctl start mongod
   # Or:
   mongod
   ```

3. **Seed the database** (optional but recommended)
   ```bash
   cd backend
   node scripts/seed.js
   # Or with demo data:
   node scripts/seed.js --demo
   ```

#### Frontend Configuration

The frontend is configured to connect to `https://odoo-stockmaster-backend.onrender.com/api` by default. To change this, edit `Frontend/src/lib/apiClient.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url/api';
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev    # Development mode with nodemon
   # Or:
   npm start      # Production mode
   ```
   The API will be available at `https://odoo-stockmaster-backend.onrender.com`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy)

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or use the seeded admin account
   - Default admin (if seeded): `admin@stockmaster.test` (password needs to be set via reset)

## 📚 API Documentation

### Base URL
```
https://odoo-stockmaster-backend.onrender.com/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Endpoints

**POST `/api/auth/register`** - Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "staff"  // or "admin" (first user can be admin)
}
```

**POST `/api/auth/login`** - Login
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
Response includes `token` and `user` object.

**GET `/api/auth/me`** - Get current user (protected)

**POST `/api/auth/request-reset`** - Request password reset OTP
```json
{
  "email": "john@example.com"
}
```

**POST `/api/auth/reset-password`** - Reset password with OTP
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

### Products

**GET `/api/products`** - List products (with pagination and search)
- Query params: `page`, `size`, `q` (search term)

**GET `/api/products/:id`** - Get single product

**POST `/api/products`** (Admin only) - Create product
```json
{
  "name": "Steel Rods",
  "sku": "SR-001",
  "category": "Raw Material",
  "uom": "kg",
  "reorderLevel": 20
}
```

**PUT `/api/products/:id`** (Admin only) - Update product

**DELETE `/api/products/:id`** (Admin only) - Soft delete product

**POST `/api/products/import`** (Admin only) - Import products from CSV
- Content-Type: `multipart/form-data`
- Field: `file` (CSV file)
- CSV format: `name,sku,category,uom,reorderLevel,locationCode,qty`

### Locations

**GET `/api/locations`** - List all locations

**GET `/api/locations/:id`** - Get single location

**POST `/api/locations`** (Admin only) - Create location
```json
{
  "name": "Main Warehouse",
  "code": "MAIN",
  "description": "Primary storage facility"
}
```

**PUT `/api/locations/:id`** (Admin only) - Update location

**DELETE `/api/locations/:id`** (Admin only) - Delete location

### Inventory Movements

**GET `/api/movements`** - List movements
- Query params: `limit`, `type`, `productId`, `locationId`, `status`

**POST `/api/receipts`** - Create receipt (incoming stock)
```json
{
  "referenceId": "PO-001",
  "note": "Vendor delivery",
  "lines": [
    {
      "productId": "<productId>",
      "qty": 100,
      "toLocationId": "<locationId>"
    }
  ]
}
```

**POST `/api/deliveries`** - Create delivery (outgoing stock)
```json
{
  "referenceId": "SO-001",
  "note": "Customer shipment",
  "lines": [
    {
      "productId": "<productId>",
      "qty": 10,
      "fromLocationId": "<locationId>"
    }
  ]
}
```

**POST `/api/transfers`** - Create transfer (move between locations)
```json
{
  "referenceId": "TR-001",
  "note": "Move to production",
  "lines": [
    {
      "productId": "<productId>",
      "qty": 20,
      "fromLocationId": "<fromLocationId>",
      "toLocationId": "<toLocationId>"
    }
  ]
}
```

**POST `/api/adjustments`** - Create adjustment (correct inventory)
```json
{
  "referenceId": "ADJ-001",
  "note": "Physical count difference",
  "lines": [
    {
      "productId": "<productId>",
      "qty": -3,  // Can be positive or negative
      "toLocationId": "<locationId>"
    }
  ]
}
```

### Dashboard

**GET `/api/dashboard`** - Get dashboard data
Returns:
- `totalProducts`: Total number of active products
- `totalStock`: Sum of all product quantities
- `lowStockItems`: Array of products below reorder level
- `recentMovements`: Last 10 movements with populated data

### Debug (Admin Only)

**GET `/api/debug/state`** - Get complete inventory state
Returns:
- `perProduct`: Stock breakdown by product
- `perLocation`: Stock breakdown by location

## 🎨 Frontend Features

### Pages

- **Dashboard**: Overview with KPIs, charts, low stock alerts, and recent movements
- **Products**: Product list with search, pagination, create/edit/delete, and CSV import
- **Product Details**: Detailed view showing stock per location, movement history
- **Locations**: Manage warehouse locations
- **Receipts**: Record incoming stock
- **Deliveries**: Record outgoing stock
- **Transfers**: Move stock between locations
- **Adjustments**: Correct inventory discrepancies
- **Movements**: View all inventory movements with filtering
- **Debug**: Admin-only view of complete inventory state
- **Profile**: User profile management

### Key Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Form Validation**: Client-side validation with React Hook Form
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Loading indicators for better UX
- **Toast Notifications**: Success and error notifications
- **Protected Routes**: Authentication and role-based route protection
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient pagination for large datasets

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Tests use `mongodb-memory-server` and don't require a real database connection.

### Test Coverage

- Product model tests
- Inventory flow tests (receipts, deliveries, transfers, adjustments)
- Transaction integrity tests

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation with express-validator
- **CORS**: Configurable CORS for API security
- **Role-based Access Control**: Admin and Staff roles
- **Audit Logging**: Complete audit trail of all operations

## 📊 Database Models

### User
- `name`, `email`, `password`, `role` (admin/staff)
- `resetOtp`, `resetOtpExpiresAt` (for password reset)

### Product
- `name`, `sku` (unique), `category`, `uom` (unit of measure)
- `reorderLevel`, `isActive` (soft delete)
- `locations`: Array of `{ location: ObjectId, qty: Number }`
- `totalQuantity`: Auto-calculated from locations
- `version`: For optimistic locking

### Location
- `name`, `code` (unique), `description`

### Movement
- `type`: receipt, delivery, transfer, adjustment
- `product`, `qty`, `fromLocation`, `toLocation`
- `createdBy`, `referenceId`, `status`, `note`
- `createdAt`, `updatedAt`

### AuditLog
- `user`, `action`, `entity`, `entityId`, `payload`
- `createdAt`

## 🚢 Deployment

### Backend Deployment

1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended for production)
3. Build and start:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build for production:
   ```bash
   cd Frontend
   npm run build
   ```

2. Deploy the `dist` folder to a static hosting service (Vercel, Netlify, etc.)

3. Update `API_BASE_URL` in `apiClient.js` to point to your production backend

### Environment Variables for Production

- Use strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Use secure MongoDB connection string
- Configure CORS for your frontend domain
- Set up proper email service for password resets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check `MONGO_URI` in `.env`
   - Ensure network access if using MongoDB Atlas

2. **Port Already in Use**
   - Change `PORT` in backend `.env`
   - Update frontend `API_BASE_URL` accordingly

3. **CORS Errors**
   - Verify CORS configuration in `backend/app.js`
   - Check frontend URL matches allowed origins

4. **JWT Token Errors**
   - Ensure `JWT_SECRET` is set
   - Check token expiration
   - Verify token format in Authorization header


---

**StockMaster** - Streamline your inventory management with modern technology.
