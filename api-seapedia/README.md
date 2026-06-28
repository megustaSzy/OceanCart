# Seapedia API Documentation

Welcome to the Seapedia Backend API Documentation. This application powers a robust multi-role marketplace handling Buyers, Sellers, Drivers, and Admins.

## Table of Contents
- [Seapedia API Documentation](#seapedia-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Base URL](#base-url)
  - [Authentication Mechanism](#authentication-mechanism)
  - [Response Format](#response-format)
    - [Success Response](#success-response)
    - [Error Response](#error-response)
  - [API Endpoints](#api-endpoints)
    - [Auth (\`/api/auth\`)](#auth-apiauth)
    - [Address (\`/api/addresses\`)](#address-apiaddresses)
    - [Store (\`/api/stores\`)](#store-apistores)
    - [Products (\`/api/products\`)](#products-apiproducts)
    - [Cart (\`/api/cart\`)](#cart-apicart)
    - [Orders (\`/api/orders\`)](#orders-apiorders)
    - [Wallet (\`/api/wallet\`)](#wallet-apiwallet)
    - [Driver (\`/api/driver\`)](#driver-apidriver)
    - [Reviews (\`/api/reviews\`)](#reviews-apireviews)
    - [Admin (\`/api/admin\`)](#admin-apiadmin)
  - [Demo Accounts](#demo-accounts)

---

## Base URL
All API endpoints are prefixed with: `/api`
*(e.g., `http://localhost:3001/api`)*

## Authentication Mechanism
Seapedia strictly uses **HttpOnly Cookies** for authentication to prevent XSS attacks.
- Upon successful login/register, the server automatically sets `accessToken` and `refreshToken` cookies.
- You do **not** need to pass an `Authorization` header. Just ensure your HTTP client includes credentials (e.g., `axios.defaults.withCredentials = true`).

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "metadata": {
    "status": 200
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "metadata": {
    "status": 400
  }
}
```

---

## API Endpoints

### Auth (\`/api/auth\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/register\` | Public | Register a new user |
| POST | \`/login\` | Public | Authenticate and receive cookies |
| POST | \`/logout\` | Private | Revoke tokens and clear cookies |
| GET | \`/profile\` | Private | Get current user's profile |
| POST | \`/select-role\` | Private | Switch active role context |
| POST | \`/refresh-token\` | Public | Regenerate access token via valid refresh token cookie |

### Address (\`/api/addresses\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/\` | Private | Add a new delivery address |
| GET | \`/\` | Private | Get all addresses of current user |
| GET | \`/:id\` | Private | Get specific address |
| PUT | \`/:id\` | Private | Update specific address |
| DELETE | \`/:id\` | Private | Delete an address |

### Store (\`/api/stores\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/\` | SELLER | Create a new store |
| GET | \`/\` | Public | Get all stores |
| GET | \`/:id\` | Public | Get specific store details |
| PUT | \`/:id\` | SELLER | Update store details |
| DELETE | \`/:id\` | SELLER | Delete the store |
| GET | \`/revenue-report\` | SELLER | Get store's total revenue from completed orders |

### Products (\`/api/products\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/\` | SELLER | Add a new product to store |
| GET | \`/\` | Public | List products (Supports pagination/search) |
| GET | \`/:id\` | Public | View product details |
| PUT | \`/:id\` | SELLER | Update a product |
| DELETE | \`/:id\` | SELLER | Delete a product |

### Cart (\`/api/cart\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/\` | BUYER | Add product to cart |
| GET | \`/\` | BUYER | View current user's cart |
| PUT | \`/:id\` | BUYER | Update item quantity |
| DELETE | \`/:id\` | BUYER | Remove item from cart |

### Orders (\`/api/orders\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/checkout\` | BUYER | Convert cart into order (deducts wallet, checks stock) |
| GET | \`/:id\` | BUYER/SELLER | Get detailed view of a specific order |
| GET | \`/buyer\` | BUYER | View buyer's order history |
| GET | \`/seller\` | SELLER | View seller's incoming orders |
| PUT | \`/:id/status\` | SELLER | Update order status (e.g. Sedang_Dikemas -> Menunggu_Pengirim) |

### Wallet (\`/api/wallet\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/topup\` | Private | Top up wallet balance |
| GET | \`/\` | Private | Get current wallet balance |
| GET | \`/history\` | Private | View wallet transaction history (In/Out) |

### Driver (\`/api/driver\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | \`/jobs\` | DRIVER | List available delivery jobs (status: Menunggu_Pengirim) |
| POST | \`/jobs/:id/take\` | DRIVER | Accept a delivery job |
| POST | \`/jobs/:id/complete\`| DRIVER | Mark job as complete (Distributes funds to Driver & Seller) |

### Reviews (\`/api/reviews\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | \`/\` | BUYER | Submit a review (Only for bought products) |
| GET | \`/product/:id\` | Public | Fetch all reviews for a specific product |

### Admin (\`/api/admin\`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | \`/dashboard\` | ADMIN | Get platform statistics (Total users, orders, revenue, etc.) |
| POST | \`/vouchers\` | ADMIN | Create a new promotional voucher |
| GET | \`/vouchers\` | Public | View active promotional vouchers |

---

## Demo Accounts
To test the system immediately, the database contains seeded users with their respective roles. 
**Password for all demo accounts:** `password123`

- **Admin:** `admin@seapedia.com`
- **Buyer:** `buyer@seapedia.com` *(Starts with Rp 500,000 balance)*
- **Seller:** `seller@seapedia.com` *(Owns 'Seafood Segar Bahari' store)*
- **Driver:** `driver@seapedia.com`

---

## Request Body Schemas (Payloads)
For POST and PUT requests, the Frontend must send JSON payloads that match our Zod Validation schemas. Here are the most critical ones:

### Auth
- **POST `/api/auth/register`**
  ```json
  {
    "name": "Budi",
    "username": "budi123",
    "email": "budi@email.com",
    "password": "password123",
    "roles": ["BUYER", "SELLER"]
  }
  ```
- **POST `/api/auth/login`**
  ```json
  { "email": "budi@email.com", "password": "password123" }
  ```

### Checkout & Cart
- **POST `/api/cart`**
  ```json
  { "productId": 1, "quantity": 2 }
  ```
- **POST `/api/orders/checkout`**
  ```json
  {
    "deliveryMethod": "Instant", 
    "voucherCode": "DISKON50K" 
  }
  ```

### Wallet
- **POST `/api/wallet/topup`**
  ```json
  { "amount": 50000, "description": "Top up via BCA" }
  ```

### Store & Product (Seller Only)
- **POST `/api/stores`**
  ```json
  { "storeName": "Toko Ikan", "description": "Toko ikan murah", "logo": "https://link.to/logo.png" }
  ```
- **POST `/api/products`**
  ```json
  { "name": "Ikan Nila", "price": 25000, "stock": 100, "description": "Segar", "image": "https://link.to/img.png" }
  ```

### Reviews
- **POST `/api/reviews`**
  ```json
  { "productId": 1, "rating": 5, "comment": "Barangnya sangat segar dan bagus!" }
  ```
