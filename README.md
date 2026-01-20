# Shopping List API Documentation

A RESTful API for managing shopping lists built with Node.js, TypeScript, and the native HTTP module.

## Table of Contents

- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Status Codes](#status-codes)
- [Example Usage](#example-usage)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd shopping-list-api

# Install dependencies
npm install

# Start development server
npm run dev

# Or build and start production server
npm run build
npm start
```

### Quick Test
```bash
curl http://localhost:3000/health
```

## API Overview

The Shopping List API allows you to manage shopping list items with full CRUD (Create, Read, Update, Delete) operations.

### Features
- ✅ Create shopping list items
- ✅ Retrieve all items or individual items
- ✅ Update item details (name, quantity, purchased status)
- ✅ Delete items from the list
- ✅ Input validation and error handling
- ✅ CORS support for web applications

### Technology Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **HTTP Server**: Native Node.js HTTP module
- **Storage**: In-memory (array-based)

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Base URL

```
http://localhost:3000
```

## Response Format

All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message",
  "count": "Number (for list endpoints)"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Optional array of specific errors"]
}
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

- **400 Bad Request** - Invalid input data or malformed JSON
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side error

## API Endpoints

### Health Check

#### Check API Status
```http
GET /health
```

**Description**: Returns the current status of the API server.

**Response**:
```json
{
  "success": true,
  "message": "Shopping List API is running",
  "timestamp": "2024-08-29T10:30:00.000Z"
}
```

---

### Shopping List Items

#### Get All Items
```http
GET /items
```

**Description**: Retrieves all shopping list items.

**Parameters**: None

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1693392600000abc",
      "name": "Milk",
      "quantity": 2,
      "purchased": false,
      "createdAt": "2024-08-29T10:30:00.000Z",
      "updatedAt": "2024-08-29T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes**:
- `200` - Success

---

#### Get Single Item
```http
GET /items/:id
```

**Description**: Retrieves a specific shopping list item by ID.

**Parameters**:
- `id` (string, required) - The unique identifier of the item

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "1693392600000abc",
    "name": "Milk",
    "quantity": 2,
    "purchased": false,
    "createdAt": "2024-08-29T10:30:00.000Z",
    "updatedAt": "2024-08-29T10:30:00.000Z"
  }
}
```

**Status Codes**:
- `200` - Success
- `404` - Item not found

**Error Example**:
```json
{
  "success": false,
  "message": "Item not found"
}
```

---

#### Create New Item
```http
POST /items
```

**Description**: Creates a new shopping list item.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Bread",
  "quantity": 1
}
```

**Body Parameters**:
- `name` (string, required) - The name of the item
- `quantity` (number, optional) - The quantity needed (defaults to 1)

**Response**:
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": "1693392600000abc",
    "name": "Bread",
    "quantity": 1,
    "purchased": false,
    "createdAt": "2024-08-29T10:30:00.000Z",
    "updatedAt": "2024-08-29T10:30:00.000Z"
  }
}
```

**Status Codes**:
- `201` - Created successfully
- `400` - Validation error

**Validation Rules**:
- `name` must be a non-empty string
- `quantity` must be a positive number (if provided)

**Error Example**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required and must be a non-empty string",
    "Quantity must be a positive number"
  ]
}
```

---

#### Update Item
```http
PUT /items/:id
```

**Description**: Updates an existing shopping list item.

**Parameters**:
- `id` (string, required) - The unique identifier of the item

**Request Headers**:
```
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "Whole Milk",
  "quantity": 3,
  "purchased": true
}
```

**Body Parameters**:
- `name` (string, optional) - Updated name of the item
- `quantity` (number, optional) - Updated quantity
- `purchased` (boolean, optional) - Updated purchase status

**Response**:
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": "1693392600000abc",
    "name": "Whole Milk",
    "quantity": 3,
    "purchased": true,
    "createdAt": "2024-08-29T10:30:00.000Z",
    "updatedAt": "2024-08-29T10:35:00.000Z"
  }
}
```

**Status Codes**:
- `200` - Updated successfully
- `400` - Validation error
- `404` - Item not found

**Validation Rules**:
- `name` must be a non-empty string (if provided)
- `quantity` must be a positive number (if provided)
- `purchased` must be a boolean (if provided)

---

#### Delete Item
```http
DELETE /items/:id
```

**Description**: Deletes a shopping list item.

**Parameters**:
- `id` (string, required) - The unique identifier of the item

**Response**: No content (empty response body)

**Status Codes**:
- `204` - Deleted successfully (no content)
- `404` - Item not found

**Error Example**:
```json
{
  "success": false,
  "message": "Item not found"
}
```

## Data Models

### Item Object
```typescript
{
  id: string;           // Unique identifier (auto-generated)
  name: string;         // Name of the item
  quantity: number;     // Quantity needed (default: 1)
  purchased: boolean;   // Purchase status (default: false)
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Create Item DTO
```typescript
{
  name: string;         // Required
  quantity?: number;    // Optional (defaults to 1)
}
```

### Update Item DTO
```typescript
{
  name?: string;        // Optional
  quantity?: number;    // Optional
  purchased?: boolean;  // Optional
}
```

## Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Resource deleted successfully |
| 400 | Bad Request - Invalid input or malformed JSON |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

## Example Usage

### Using cURL

#### Create a new item
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Eggs", "quantity": 12}'
```

#### Get all items
```bash
curl http://localhost:3000/items
```

#### Update an item (mark as purchased)
```bash
curl -X PUT http://localhost:3000/items/1693392600000abc \
  -H "Content-Type: application/json" \
  -d '{"purchased": true}'
```

#### Delete an item
```bash
curl -X DELETE http://localhost:3000/items/1693392600000abc
```

### Using JavaScript (fetch)

#### Create a new item
```javascript
const response = await fetch('http://localhost:3000/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Bread',
    quantity: 2
  })
});

const result = await response.json();
console.log(result);
```

#### Get all items
```javascript
const response = await fetch('http://localhost:3000/items');
const result = await response.json();
console.log(result.data); // Array of items
```

### Using Python (requests)

```python
import requests
import json

# Create a new item
response = requests.post('http://localhost:3000/items', 
  json={'name': 'Milk', 'quantity': 1})
print(response.json())

# Get all items
response = requests.get('http://localhost:3000/items')
print(response.json())

# Update an item
response = requests.put('http://localhost:3000/items/item_id', 
  json={'purchased': True})
print(response.json())

# Delete an item
response = requests.delete('http://localhost:3000/items/item_id')
print(response.status_code)  # Should be 204
```

## Testing with Postman

1. **Import Collection**: Create a new collection called "Shopping List API"
2. **Set Base URL**: Use `http://localhost:3000` as your base URL
3. **Add Environment**: Create variables for `base_url` and `item_id`
4. **Test Sequence**:
   - Health check: `GET /health`
   - Create items: `POST /items`
   - List items: `GET /items`
   - Get specific item: `GET /items/:id`
   - Update item: `PUT /items/:id`
   - Delete item: `DELETE /items/:id`

## Limitations

- **Data Persistence**: Items are stored in memory and will be lost when the server restarts
- **Concurrency**: No built-in handling for concurrent requests
- **Authentication**: No user authentication or authorization
- **Rate Limiting**: No rate limiting implemented
- **Validation**: Basic validation only

## Future Enhancements

- [ ] Database integration (PostgreSQL, MongoDB, SQLite)
- [ ] User authentication and authorization
- [ ] Data persistence across server restarts
- [ ] Advanced filtering and sorting
- [ ] Pagination for large lists
- [ ] Item categories and tags
- [ ] Due dates and reminders
- [ ] API versioning
- [ ] Rate limiting
- [ ] Comprehensive logging
- [ ] Unit and integration tests
- [ ] OpenAPI/Swagger documentation

## Development

### Project Structure
```
src/
├── models/
│   └── item.ts              # Data models and validation
├── services/
│   └── itemService.ts       # Business logic
└── server.ts                # HTTP server and routing
```

### Available Scripts
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.
