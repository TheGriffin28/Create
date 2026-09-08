# API Documentation: Create
*Compiled by Scribe — Technical Documentation Writer, Nexora AI Office*

## Base URL
```
http://localhost:3000/api
```

## Authentication
Unless noted otherwise, endpoints accept and return JSON payloads.

---

## Endpoints

### 1. System Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Returns server uptime and database connection status.
- **Response (`200 OK`):**
```json
{
  "status": "healthy",
  "service": "Create API",
  "timestamp": "2026-09-08T12:00:00.000Z"
}
```

### 2. List Items
- **Endpoint:** `GET /api/create`
- **Query Parameters:**
  - `limit` (integer, optional, default: 20)
  - `offset` (integer, optional, default: 0)
  - `search` (string, optional)
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [],
  "total": 0
}
```

### 3. Create Item
- **Endpoint:** `POST /api/create`
- **Request Body:**
```json
{
  "title": "Sample Item",
  "description": "Item description"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "item_123",
    "title": "Sample Item",
    "created_at": "2026-09-08T12:00:00.000Z"
  }
}
```

### 4. Delete Item
- **Endpoint:** `DELETE /api/create/:id`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```
