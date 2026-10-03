# Campus Complaint Tracker API

A production-ready, RESTful backend API built with **Node.js**, **Express**, and **MongoDB (Mongoose)** for logging, tracking, filtering, and resolving student complaints across a campus.

---

## 1. Project Overview

The **Campus Complaint Tracker** allows students and campus administration to manage complaints with:
- **Strict Data Validation**: Validates mandatory fields, email formatting, and categorical/priority enums.
- **Dynamic Search & Filtering**: Multi-parameter query filtering by `status`, `category`, and `priority`, plus case-insensitive regex text search on `title` and `studentName`.
- **Clean Error Handling**: Standardized responses for `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`, with special handling for invalid MongoDB ObjectIDs.
- **MVC Architecture**: Clear separation of concerns across Models, Controllers, Routes, and Config.
- **Audit Timestamps**: Automatic `createdAt` and `updatedAt` tracking via Mongoose schemas.

---

## 2. Complaint Data Model

| Field | Type | Required | Allowed Values / Default | Notes |
|---|---|---|---|---|
| `studentName` | String | Yes | Non-empty string | Trimmed |
| `email` | String | Yes | Valid email format | Trimmed, lowercased |
| `title` | String | Yes | Non-empty string, max 150 chars | Trimmed |
| `description` | String | Yes | Non-empty string | Trimmed |
| `category` | String | Yes | `'Infrastructure'`, `'IT'`, `'Cleanliness'`, `'Security'`, `'Other'` | Strict Enum |
| `priority` | String | Yes | `'Low'`, `'Medium'`, `'High'` | Default: `'Medium'` |
| `location` | String | No | Free text (e.g. `'Academic Block 2'`) | Optional |
| `status` | String | No | `'Open'`, `'In Progress'`, `'Resolved'`, `'Rejected'` | Default: `'Open'` |
| `createdAt` | Date | Auto | ISO Timestamp | Automatically generated |
| `updatedAt` | Date | Auto | ISO Timestamp | Automatically updated on edit |

---

## 3. Project Structure

```
campus-complaint-tracker/
├── config/
│   └── db.js                             # MongoDB Mongoose connection handler
├── controllers/
│   └── complaintController.js            # Business logic for all complaint operations
├── models/
│   └── Complaint.js                      # Mongoose schema and model definition
├── routes/
│   └── complaintRoutes.js                # API route definitions
├── scripts/
│   ├── seed.js                           # Populates database with sample test records
│   └── test-api.js                       # Comprehensive automated API test suite
├── .env                                  # Environment variables
├── .env.example                          # Environment template
├── Campus_Complaint_Tracker.postman_collection.json # Ready-to-import Postman Collection
├── package.json                          # Project dependencies and npm scripts
└── server.js                             # Express server entry point
```

---

## 4. Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher, v24 recommended)
- [MongoDB](https://www.mongodb.com/) (Local mongod service or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI)

### Installation

1. Navigate to the project root:
   ```bash
   cd campus-complaint-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Edit `.env` (or copy `.env.example` to `.env`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/campus_complaints
   NODE_ENV=development
   ```
   > **Note**: If using MongoDB Atlas, replace `MONGO_URI` with your connection string:
   > `mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_complaints?retryWrites=true&w=majority`

4. (Optional) Seed the Database with Sample Complaints:
   ```bash
   npm run seed
   ```

5. Start the Server:
   - Development mode (with auto-reload):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

The server will be running at `http://localhost:5000`.

---

## 5. API Endpoints

### Base URL: `http://localhost:5000/api/complaints`

| Method | Endpoint | Description | Sample Query / Body |
|---|---|---|---|
| `POST` | `/api/complaints` | Create a new complaint | `{ studentName, email, title, description, category, priority, location }` |
| `GET` | `/api/complaints` | Get all complaints | `?status=Open&category=IT&priority=High&search=projector` |
| `GET` | `/api/complaints/:id` | Get single complaint by ID | None (URL parameter `:id`) |
| `PUT` | `/api/complaints/:id` | Update complaint details | `{ title, description, priority, location, ... }` |
| `PATCH`| `/api/complaints/:id/status`| Update only complaint status | `{ "status": "In Progress" }` |
| `DELETE`| `/api/complaints/:id` | Delete a complaint | None (URL parameter `:id`) |

---

## 6. Sample Requests & Responses

### 1. Create a Complaint
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/complaints`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "studentName": "Aarav Sharma",
    "email": "aarav.sharma@campus.edu",
    "title": "Broken projector in Seminar Hall B",
    "description": "The projector in Seminar Hall B flickers constantly and shuts down after 5 minutes.",
    "category": "IT",
    "priority": "High",
    "location": "Academic Block 2, Seminar Hall B"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Complaint created successfully",
    "data": {
      "_id": "65b8e9f1a23c4d5e6f7a8b9c",
      "studentName": "Aarav Sharma",
      "email": "aarav.sharma@campus.edu",
      "title": "Broken projector in Seminar Hall B",
      "description": "The projector in Seminar Hall B flickers constantly and shuts down after 5 minutes.",
      "category": "IT",
      "priority": "High",
      "location": "Academic Block 2, Seminar Hall B",
      "status": "Open",
      "createdAt": "2026-10-03T05:30:00.000Z",
      "updatedAt": "2026-10-03T05:30:00.000Z"
    }
  }
  ```

---

### 2. Get All Complaints (with Filtering & Search)
- **Method**: `GET`
- **URL Examples**:
  - All complaints: `http://localhost:5000/api/complaints`
  - Filter by status: `http://localhost:5000/api/complaints?status=Open`
  - Filter by category: `http://localhost:5000/api/complaints?category=IT`
  - Filter by priority: `http://localhost:5000/api/complaints?priority=High`
  - Search by keyword: `http://localhost:5000/api/complaints?search=projector`
  - Combined filter & search: `http://localhost:5000/api/complaints?category=IT&priority=High&search=Seminar`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "65b8e9f1a23c4d5e6f7a8b9c",
        "studentName": "Aarav Sharma",
        "email": "aarav.sharma@campus.edu",
        "title": "Broken projector in Seminar Hall B",
        "description": "The projector in Seminar Hall B flickers constantly...",
        "category": "IT",
        "priority": "High",
        "location": "Academic Block 2, Seminar Hall B",
        "status": "Open",
        "createdAt": "2026-10-03T05:30:00.000Z",
        "updatedAt": "2026-10-03T05:30:00.000Z"
      }
    ]
  }
  ```

---

### 3. Get Complaint by ID
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/complaints/65b8e9f1a23c4d5e6f7a8b9c`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "65b8e9f1a23c4d5e6f7a8b9c",
      "studentName": "Aarav Sharma",
      "email": "aarav.sharma@campus.edu",
      "title": "Broken projector in Seminar Hall B",
      "description": "The projector in Seminar Hall B flickers constantly...",
      "category": "IT",
      "priority": "High",
      "location": "Academic Block 2, Seminar Hall B",
      "status": "Open",
      "createdAt": "2026-10-03T05:30:00.000Z",
      "updatedAt": "2026-10-03T05:30:00.000Z"
    }
  }
  ```

---

### 4. Update Complaint (PUT)
- **Method**: `PUT`
- **URL**: `http://localhost:5000/api/complaints/65b8e9f1a23c4d5e6f7a8b9c`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Broken projector in Seminar Hall B (Lens Inspection Scheduled)",
    "priority": "Medium",
    "location": "Academic Block 2, Seminar Hall B"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Complaint updated successfully",
    "data": {
      "_id": "65b8e9f1a23c4d5e6f7a8b9c",
      "studentName": "Aarav Sharma",
      "email": "aarav.sharma@campus.edu",
      "title": "Broken projector in Seminar Hall B (Lens Inspection Scheduled)",
      "priority": "Medium",
      "status": "Open",
      "updatedAt": "2026-10-03T05:35:10.000Z"
    }
  }
  ```

---

### 5. Change Status Only (PATCH)
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/complaints/65b8e9f1a23c4d5e6f7a8b9c/status`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "status": "In Progress"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Complaint status updated successfully",
    "data": {
      "_id": "65b8e9f1a23c4d5e6f7a8b9c",
      "status": "In Progress",
      "updatedAt": "2026-10-03T05:36:00.000Z"
    }
  }
  ```
  *(Allowed statuses: `Open`, `In Progress`, `Resolved`, `Rejected`)*

---

### 6. Delete Complaint
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/complaints/65b8e9f1a23c4d5e6f7a8b9c`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Complaint deleted successfully",
    "data": {}
  }
  ```

---

## 7. Testing with Postman

1. Open Postman.
2. Click **Import** in the top-left corner.
3. Select `Campus_Complaint_Tracker.postman_collection.json` located in the root of this project.
4. The collection includes **17 pre-configured requests**:
   - `0. Root & Overview`
   - `1. Create Complaint (Success)`
   - `2. Create Complaint (Cleanliness Sample)`
   - `3. Validation Error (Missing Fields - 400)`
   - `4. Validation Error (Invalid Enums - 400)`
   - `5. Get All Complaints`
   - `6. Filter Complaints by Status`
   - `7. Filter Complaints by Category`
   - `8. Filter Complaints by Priority`
   - `9. Search Complaints by Keyword`
   - `10. Get Complaint by ID`
   - `11. Error Test - Invalid ID Format (400)`
   - `12. Error Test - Non-Existent ID (404)`
   - `13. Update Complaint Details (PUT)`
   - `14. Update Status Only (PATCH - In Progress)`
   - `15. Update Status Only (PATCH - Resolved)`
   - `16. Update Status Invalid Value (400)`
   - `17. Delete Complaint (DELETE)`
5. The collection uses `{{baseUrl}}` (defaults to `http://localhost:5000`) and `{{complaintId}}` which can be set with any valid ObjectId.
