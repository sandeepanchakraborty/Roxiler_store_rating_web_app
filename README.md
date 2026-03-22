# Store Rating Web Application

A full-stack web application that enables users to submit ratings for stores registered on the platform. It supports role-based access control with three user roles: System Administrator, Normal User, and Store Owner — each having specific functionalities and dashboards.

---

## Features

### User Roles & Functionalities

#### System Administrator
- Add new stores, normal users, and admin users.
- View dashboard with total counts of users, stores, and ratings.
- Manage users (view, add, filter by Name, Email, Address, Role).
- View stores with details including name, email, address, and ratings.
- Filter users and stores by key attributes.
- View detailed user info, including ratings for Store Owners.
- Secure logout.

#### Normal User
- User registration with signup form (Name, Email, Address, Password).
- Login/logout.
- Update password.
- View and search stores by name and address.
- View store details including overall rating and their own rating.
- Submit new ratings and update existing ratings (1 to 5 stars).

#### Store Owner
- Login/logout.
- Update password.
- Dashboard to view users who rated their stores.
- View average rating for their stores.

---

## Validation Rules

- **Name:** Minimum 20 characters, maximum 60 characters.
- **Address:** Maximum 400 characters.
- **Password:** 8–16 characters, must include at least one uppercase letter and one special character.
- **Email:** Must be a valid email format.

---

## Technical Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL (using Sequelize ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt hashing
- **API:** RESTful endpoints with role-based authorization
- **Other:** CORS, environment variable management, client-server architecture

---

## Database Schema

- **Users:** id, name, email, password, address, role (admin, user, owner)
- **Stores:** id, name, email, address, ownerId (references Users)
- **Ratings:** id, rating (1–5), userId, storeId, timestamps

---

## Features in Detail

- Role-based access control to secure APIs and frontend views.
- Password hashing and validation for security.
- Sorting and filtering on tables (Name, Email, Address, Role).
- Validation both client-side and server-side.
- User-friendly error handling and success messages.
- Modular, maintainable codebase following best practices.

---

