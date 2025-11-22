# StockMaster Frontend

A premium, modern React frontend for the StockMaster inventory management system.

## Features

- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 📊 **Interactive Dashboard** - KPI cards, charts, and real-time data visualization
- 📦 **Product Management** - Full CRUD operations with search and filters
- 📍 **Location Management** - Manage warehouses and storage locations
- 📥 **Stock Movements** - Receipts, Deliveries, Transfers, and Adjustments
- 📋 **Movement History** - Complete ledger with advanced filtering
- 🔐 **Authentication** - Secure login, registration, and password reset
- 👤 **User Profiles** - View and manage account information
- 🐛 **Debug Tools** - Admin-only stock state inspection

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library
- **Framer Motion** - Animation library
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `https://odoo-stockmaster-backend.onrender.com`

## Installation

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Building for Production

Build the production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components (Button, Card, Input, Modal)
│   │   ├── Layout.jsx       # Main layout with sidebar
│   │   ├── ProtectedRoute.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductImportModal.jsx
│   │   └── MovementForm.jsx
│   ├── context/             # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── hooks/               # Custom React hooks
│   │   ├── useApi.js        # API hooks (React Query)
│   │   └── useAuth.js       # Auth hooks
│   ├── lib/                 # Utilities and helpers
│   │   ├── apiClient.js     # Axios instance with interceptors
│   │   └── utils.js         # Helper functions
│   ├── pages/               # Page components
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
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## API Integration

All API calls are made to `https://odoo-stockmaster-backend.onrender.com/api` using Axios. The API client automatically:

- Adds JWT tokens to requests
- Handles 401 errors (redirects to login)
- Provides error handling

## Authentication Flow

1. **Login/Register** - Users authenticate and receive a JWT token
2. **Token Storage** - Token stored in localStorage
3. **Protected Routes** - Routes require authentication
4. **Auto-refresh** - Token validated on app load
5. **Logout** - Clears token and redirects to login

## Key Features

### Dashboard
- Real-time KPIs (Total Products, Total Stock, Low Stock Items)
- Interactive charts (Line chart for movements, Bar chart for types)
- Low stock alerts
- Recent movements timeline

### Products
- Search and filter products
- Create, edit, delete products (admin only)
- CSV import (admin only)
- View product details with stock per location
- Pagination support

### Stock Movements
- **Receipts** - Add incoming stock
- **Deliveries** - Remove outgoing stock (with stock validation)
- **Transfers** - Move stock between locations
- **Adjustments** - Correct discrepancies (positive/negative quantities)

### Movement History
- Filter by type, product, location
- Pagination
- Complete audit trail

## Environment Variables

Create a `.env` file if you need to customize the API URL:

```env
VITE_API_URL=https://odoo-stockmaster-backend.onrender.com/api
```

## Troubleshooting

### CORS Issues
Ensure the backend allows requests from `http://localhost:5173`

### Authentication Issues
- Check that the backend is running
- Verify JWT token is being stored in localStorage
- Check browser console for errors

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## Contributing

1. Follow the existing code style
2. Use TypeScript-like prop validation
3. Keep components small and focused
4. Add loading and error states
5. Use React Query for data fetching

## License

This project is part of the StockMaster system.
