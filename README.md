# Finance Dashboard API

Backend API for a finance dashboard with role-based access control.

## Setup

```bash
pnpm install
cp .env.example .env  # Add DATABASE_URL, JWT_SECRET & SEED_PASSWORD
npx prisma generate
npx prisma db push
npx prisma db seed # push ADMIN
pnpm dev
```

## Database

PostgreSQL with Prisma ORM. Models: `User`, `Record`.

## Authentication

JWT token required in `Authorization: Bearer <token>` header.

Token payload: `{ id, role, status }`

Token expires in 3 days.

## Roles

| Role | Permissions |
|------|-------------|
| VIEWER | Read dashboards |
| ANALYST | All VIEWER + view all records |
| ADMIN | Full access: manage users, create/update/delete records |

---

## API Endpoints

### Auth

#### POST /api/auth/sign-up

Register new user (no auth required).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created. Await activation."
}
```

**Errors:** 400 (validation/duplicate), 500

---

#### POST /api/auth/login

Authenticate user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { "id": 1, "email": "user@example.com", "role": "ADMIN" }
}
```

Sets `auth-token` cookie (httpOnly, 3-day expiry).

**Errors:** 400 (validation), 401 (invalid credentials), 403 (account inactive), 500

---

### Users

#### GET /api/users

List all users. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "users": [
    { "id": 1, "email": "admin@example.com", "role": "ADMIN", "status": "ACTIVE", "createdAt": "2024-01-01T00:00:00Z" }
  ]
}
```

**Errors:** 401, 403, 500

---

#### POST /api/users

Create user. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "email": "newuser@example.com",
  "role": "VIEWER",
  "status": "INACTIVE"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created"
}
```

**Errors:** 400 (missing fields/duplicate), 401, 403, 500

---

#### GET /api/users/:id

Get single user. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "user": { "id": 1, "email": "user@example.com", "role": "VIEWER", "status": "ACTIVE", "createdAt": "2024-01-01T00:00:00Z" }
}
```

**Errors:** 401, 403, 404, 500

---

#### PUT /api/users/:id

Update user. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Request (all fields optional):**
```json
{
  "email": "newemail@example.com",
  "role": "ANALYST",
  "status": "ACTIVE"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { "id": 1, "email": "newemail@example.com", "role": "ANALYST", "status": "ACTIVE", "createdAt": "2024-01-01T00:00:00Z" }
}
```

**Validation:** `email` must be valid, `role` must be VIEWER|ANALYST|ADMIN, `status` must be ACTIVE|INACTIVE.

**Errors:** 400 (validation), 401, 403, 500

---

#### DELETE /api/users/:id

Delete user. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "success": true }
```

**Errors:** 401, 403, 500

---

### Records

#### GET /api/records

List records with optional filtering. **ADMIN, ANALYST only.**

**Headers:** `Authorization: Bearer <token>`

**Query params:**
| Param | Description |
|-------|-------------|
| type | INCOME or EXPENSE |
| category | Category name |
| startDate | ISO date string |
| endDate | ISO date string |

**Example:** `GET /api/records?type=EXPENSE&category=Food&startDate=2024-01-01`

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "amount": 100.50, "type": "INCOME", "category": "Salary", "notes": "Monthly pay", "date": "2024-01-15T00:00:00Z", "userId": 1 }
  ]
}
```

**Errors:** 401, 403, 500

---

#### POST /api/records

Create record. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "amount": 1500.00,
  "type": "INCOME",
  "category": "Salary",
  "notes": "Monthly salary",
  "date": "2024-01-15",
  "userId": 1
}
```

**Validation:** `amount` (number), `type` (INCOME|EXPENSE), `category` (string), `date` (string), `userId` (number). `notes` optional.

**Response (201):**
```json
{
  "success": true,
  "data": { "id": "uuid", "amount": 1500.00, "type": "INCOME", ... }
}
```

**Errors:** 400 (validation), 401, 403, 500

---

#### GET /api/records/:id

Get single record. **ADMIN, ANALYST, VIEWER only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "record": { "id": "uuid", "amount": 100, "type": "EXPENSE", ... }
}
```

**Errors:** 401, 403, 404, 500

---

#### PUT /api/records/:id

Update record. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Request (all fields optional):**
```json
{
  "amount": 200.00,
  "type": "EXPENSE",
  "category": "Food",
  "notes": "Updated notes",
  "date": "2024-02-01"
}
```

**Response (200):**
```json
{
  "success": true,
  "record": { "id": "uuid", "amount": 200.00, ... }
}
```

**Errors:** 400 (validation), 401, 403, 500

---

#### DELETE /api/records/:id

Delete record. **ADMIN only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{ "success": true }
```

**Errors:** 401, 403, 404, 500

---

### Dashboard

#### GET /api/dashboard/summary

Get financial summary. **ADMIN, ANALYST, VIEWER only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.00,
    "totalExpense": 1500.00,
    "balance": 3500.00
  }
}
```

**Errors:** 401, 403, 500

---

#### GET /api/dashboard/categories

Get totals grouped by category. **ADMIN, ANALYST, VIEWER only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "Salary": { "income": 5000, "expense": 0 },
    "Food": { "income": 0, "expense": 500 },
    "Transport": { "income": 0, "expense": 200 }
  }
}
```

**Errors:** 401, 403, 500

---

#### GET /api/dashboard/trends

Get monthly income/expense trends. **ADMIN, ANALYST, VIEWER only.**

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "month": "2024-01", "income": 3000, "expense": 800 },
    { "month": "2024-02", "income": 2000, "expense": 700 }
  ]
}
```

Sorted chronologically (oldest first).

**Errors:** 401, 403, 500

---

## Error Format

All errors follow this structure:

```json
{
  "success": false,
  "error": "Error message"
}
```

Validation errors include field-level details:

```json
{
  "success": false,
  "error": {
    "fieldErrors": {
      "email": ["Invalid email address"],
      "password": ["Minimum 8 characters required"]
    }
  }
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation/input error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient role or inactive account) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Testing

```bash
pnpm test
```

46 tests covering schemas, authorization, filtering, and dashboard logic.
