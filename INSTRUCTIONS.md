Backend Development Prompt Rules

Follow these rules strictly when generating code.

Database
Use MongoDB with the following connection string for development.

MONGO_URI=mongodb+srv://livoraAdmin:Livora123DB@cluster0.pwmr7wq.mongodb.net/Livora?appName=Cluster0

These credentials are temporary and will be deleted after production.

Architecture
Use REST API architecture with proper endpoint naming conventions.

Examples
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

Technology Stack
Backend: Node.js with Express.js
Database: MongoDB with Mongoose

Authentication & Authorization
Use JWT for authentication.
Protected routes must verify the JWT token through middleware.

Security
Always consider application security.

Requirements
Use hashed passwords with bcrypt
Validate and sanitize inputs
Protect routes with JWT middleware
Prevent unauthorized access
Never expose sensitive data in responses

Code Rules
Do not include comments in the generated code.
Use clean and readable code structure.
Follow modular architecture.

Structure example

/config
/controllers
/middleware
/models
/routes
/server.js

Validation
All request body inputs must be validated before processing.

Error Handling
Use proper HTTP status codes.

Examples
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error

Environment Variables
Sensitive information must use environment variables.

Examples

JWT_SECRET
MONGO_URI
PORT

API Response Format
All responses must return JSON in this format.

Success

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

Error

{
  "success": false,
  "message": "Error message"
}

Scalability
Structure the code so it is production-ready and scalable.