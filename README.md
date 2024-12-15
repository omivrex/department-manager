# Department and Sub-Department Management API

## Description

This project provides a GraphQL API for managing departments and sub-departments within an organization. Users can create, update, read, and delete departments and sub-departments with robust validation, case-insensitive operations, and detailed error handling to ensure reliability. The API implements industry-standard security practices, including short-lived access tokens for sensitive operations.

## Setup Instructions

### Prerequisites

- Node.js (>=16.x)
- npm or Yarn
- PostgreSQL
- A compatible TypeScript editor (e.g., VS Code)
- NestJS CLI (optional but recommended)

### Installation and Use of `.env`

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up a PostgreSQL database. The `.env` file containing necessary credentials (e.g., database configuration, JWT secret) will be sent via email.

4. Run database migrations:

    ```bash
    npm run typeorm:migration:run
    # or
    yarn typeorm:migration:run
    ```

5. Start the development server:

    ```bash
    npm run start:dev
    # or
    yarn start:dev
    ```

6. Access the API via the GraphQL Playground at: [https://department-manager-46pc.onrender.com/graphql](https://department-manager-46pc.onrender.com/graphql).

---

## Features

### Authentication

**Explanation:**

- Users can register (sign-up) and log in to access the system.
- The API uses JSON Web Tokens (JWT) for authentication and authorization.
- Access tokens are short-lived (1 hour), while refresh tokens allow the generation of new access tokens.

**Example Mutations:**

- **Sign Up:**

```graphql
mutation SignUp {
    signUp(input: { email: "user@example.com", password: "StrongPassword123" }) {
        id
        email
        createdAt
    }
}
```

- **Log In:**

```graphql
mutation LogIn {
    logIn(input: { email: "user@example.com", password: "StrongPassword123" }) {
        accessToken
        refreshToken
    }
}
```

**Considerations:**

- Passwords are validated for strength and hashed with bcrypt before storage.
- Access tokens expire after 1 hour to enhance security for this sensitive admin dashboard.
- Refresh tokens are stored securely and can be used to request new access tokens without requiring re-login.
- Ensure your client application handles token expiration gracefully and securely stores tokens.

---

### Department Management

**Explanation:**

- Users can perform CRUD operations on departments:
    - **Create:** Add a new department with optional sub-departments.
    - **Read:** Fetch details of a department or a paginated list of all departments.
    - **Update:** Modify the name of an existing department.
    - **Delete:** Remove a department and its associated sub-departments.

**Example Queries and Mutations:**

- **Create a Department:**

```graphql
mutation CreateDepartment {
    createDepartment(input: { name: "Human Resources", subDepartments: [{ name: "Recruitment" }, { name: "Employee Relations" }] }) {
        id
        name
        subDepartments {
            id
            name
        }
    }
}
```

- **Get Departments (Paginated):**

```graphql
query GetDepartments {
    departments(pagination: { page: 1, limit: 10 }) {
        items {
            id
            name
            subDepartments {
                id
                name
            }
        }
        total
    }
}
```

- **Update a Department:**

```graphql
mutation UpdateDepartment {
    updateDepartment(id: 1, input: { name: "HR" }) {
        id
        name
    }
}
```

- **Delete a Department:**

```graphql
mutation DeleteDepartment {
    deleteDepartment(id: 1)
}
```

**Considerations:**

- Department names must be unique (case-insensitive).
- Conflicts in names during creation or updates return a `409 Conflict` error.
- Attempting to delete a non-existent department results in a `404 Not Found` error.

---

### Sub-Department Management

**Explanation:**

- CRUD operations are supported for sub-departments:
    - **Create:** Add a sub-department under a specific department.
    - **Read:** Fetch all sub-departments for a department or a specific sub-department.
    - **Update:** Modify the name of an existing sub-department.
    - **Delete:** Remove a sub-department.

**Example Queries and Mutations:**

- **Create a Sub-Department:**

```graphql
mutation CreateSubDepartment {
    createSubDepartment(input: { departmentId: 1, name: "Onboarding" }) {
        id
        name
        department {
            id
            name
        }
    }
}
```

- **Get Sub-Departments for a Department:**

```graphql
query GetSubDepartments {
    subDepartments(departmentId: 1) {
        id
        name
    }
}
```

- **Update a Sub-Department:**

```graphql
mutation UpdateSubDepartment {
    updateSubDepartment(id: 2, input: { name: "Training" }) {
        id
        name
    }
}
```

- **Delete a Sub-Department:**

```graphql
mutation DeleteSubDepartment {
    deleteSubDepartment(id: 2)
}
```

**Considerations:**

- Sub-department names must be unique within their parent department.
- Name conflicts during creation or updates return a `409 Conflict` error.
- Attempting to fetch or delete a non-existent sub-department returns a `404 Not Found` error.

---

### Error Handling

**Explanation:**

- The API implements standardized error handling using NestJS exception filters.
- Errors are communicated with descriptive messages and appropriate HTTP status codes.

**Example Error Response:**

```json
{
    "errors": [
        {
            "message": "Department with ID 5 not found.",
            "path": ["deleteDepartment"]
        }
    ]
}
```

**Considerations:**

- All user inputs are validated to prevent SQL injection and other malicious activities.
- Case-insensitivity is enforced for naming to prevent duplicate entries.
- Proper pagination parameters (e.g., `page`, `limit`) are required to avoid unexpected results.

---

## Additional Notes

- The project uses TypeORM for database management and relationships.
- The modular architecture of NestJS ensures clean and maintainable code.
- The GraphQL Playground URL for testing API endpoints is: [https://department-manager-46pc.onrender.com/graphql](https://department-manager-46pc.onrender.com/graphql).
- Edge cases, such as handling duplicate names and missing resources, are accounted for.
